import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import {
  createPixPayment,
  createCardPayment,
  getPaymentStatus,
  verifyWebhookSignature,
} from "./server/mercadoPago";
import { liberarAcesso, revogarAcesso, salvarLeadAbandonado, getAccessByEmail } from "./server/accessControl";
import { sendMetaPurchaseConversion } from "./server/metaCapi";
import { PaymentTransaction } from "./src/types";

// Banco de dados em memória para transações (persistência durante execução da aplicação)
const transactionsDb = new Map<string, PaymentTransaction>();
const processedWebhooks = new Set<string>();

const OFFER_DETAILS = {
  id: "metodo-5p",
  name: "Plataforma Método 5P (workbook interativo de preparação familiar)",
  bonus: "Manual Completo de Sobrevivência Apocalíptica (PDF)",
  items: [
    "calculadora de água e comida",
    "mapa de riscos da casa",
    "protocolos e checklists",
    "manual em PDF",
  ],
  price: 39.9,
  paymentType: "pagamento único",
  guaranteeDays: 7,
  deliveryText: "acesso por e-mail logo após a aprovação",
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // 1. Dados Oficiais da Oferta (Sem invenções, conforme regra 1)
  app.get("/api/offer", (_req, res) => {
    res.json({
      success: true,
      offer: OFFER_DETAILS,
    });
  });

  // 2. Chave Pública do Mercado Pago para o Frontend (SDK React)
  app.get("/api/config/mp-public-key", (_req, res) => {
    const publicKey = process.env.VITE_MERCADO_PAGO_PUBLIC_KEY || "";
    res.json({ publicKey });
  });

  // 3. Captura de Lead Abandonado (ao sair de cada campo do formulário)
  app.post("/api/lead/abandoned", async (req, res) => {
    try {
      const { name, email, phone, document, tracking } = req.body;
      await salvarLeadAbandonado({ name, email, phone, document, tracking });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ success: false, error: "Erro ao salvar lead." });
    }
  });

  // 4. Criação de Pagamento PIX com Mercado Pago
  app.post("/api/payment/pix", async (req, res) => {
    try {
      const { customer, tracking } = req.body;

      if (!customer?.email || !customer?.name) {
        return res.status(400).json({
          success: false,
          message: "Nome e e-mail são obrigatórios para emissão do Pix.",
        });
      }

      const eventId = tracking?.eventId || `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const cleanDocument = (customer.document || "00000000000").replace(/\D/g, "");

      const mpResponse = await createPixPayment({
        amount: OFFER_DETAILS.price,
        description: "Plataforma Método 5P + Manual PDF",
        payer: {
          email: customer.email.trim().toLowerCase(),
          firstName: customer.name.trim(),
          phone: customer.phone ? customer.phone.replace(/\D/g, "") : "",
          identification: {
            type: "CPF",
            number: cleanDocument || "00000000000",
          },
        },
        eventId,
        metadata: {
          utm_source: tracking?.utm_source,
          utm_medium: tracking?.utm_medium,
          utm_campaign: tracking?.utm_campaign,
          fbclid: tracking?.fbclid,
        },
      });

      const transactionId = `TRX-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

      const transaction: PaymentTransaction = {
        id: transactionId,
        mpPaymentId: String(mpResponse.id),
        status: mpResponse.status === "approved" ? "approved" : "pending",
        paymentMethod: "pix",
        total: OFFER_DETAILS.price,
        customer,
        tracking: { ...tracking, eventId },
        eventId,
        qrCode: mpResponse.qrCode,
        qrCodeBase64: mpResponse.qrCodeBase64,
        expirationDate: mpResponse.dateOfExpiration,
        ticketUrl: mpResponse.ticketUrl,
        createdAt: new Date().toISOString(),
      };

      transactionsDb.set(transactionId, transaction);

      console.log(`[PIX GERADO] Pedido: ${transactionId} | MP ID: ${mpResponse.id} | Cliente: ${customer.email}`);

      res.json({
        success: true,
        transaction,
      });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Erro ao gerar PIX com o Mercado Pago.";
      console.error("[ERRO PIX ENDPOINT]", errorMsg);
      res.status(500).json({ success: false, message: errorMsg });
    }
  });

  // 5. Processamento de Cartão de Crédito com Card Payment Brick do Mercado Pago
  app.post("/api/payment/card", async (req, res) => {
    try {
      const { token, issuerId, paymentMethodId, installments, customer, tracking } = req.body;

      if (!customer?.email || !customer?.name) {
        return res.status(400).json({
          success: false,
          message: "Nome e e-mail são obrigatórios.",
        });
      }

      const eventId = tracking?.eventId || `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const cleanDocument = (customer.document || "").replace(/\D/g, "");

      const mpResponse = await createCardPayment({
        token,
        amount: OFFER_DETAILS.price,
        description: "Plataforma Método 5P + Manual PDF",
        installments: Number(installments) || 1,
        paymentMethodId: paymentMethodId || "visa",
        issuerId: issuerId ? String(issuerId) : undefined,
        payer: {
          email: customer.email.trim().toLowerCase(),
          firstName: customer.name.trim(),
          identification: {
            type: "CPF",
            number: cleanDocument,
          },
        },
        eventId,
        metadata: {
          utm_source: tracking?.utm_source,
          utm_medium: tracking?.utm_medium,
          utm_campaign: tracking?.utm_campaign,
          fbclid: tracking?.fbclid,
        },
      });

      const transactionId = `TRX-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

      const isApproved = mpResponse.status === "approved";

      const transaction: PaymentTransaction = {
        id: transactionId,
        mpPaymentId: String(mpResponse.id),
        status: isApproved ? "approved" : mpResponse.status === "rejected" ? "rejected" : "in_process",
        paymentMethod: "credit_card",
        total: OFFER_DETAILS.price,
        customer,
        tracking: { ...tracking, eventId },
        eventId,
        rejectionMessage: mpResponse.rejectionMessage,
        createdAt: new Date().toISOString(),
        accessGranted: isApproved,
      };

      transactionsDb.set(transactionId, transaction);

      if (isApproved) {
        // Libera acesso
        await liberarAcesso(customer.email, customer.name);

        // Dispara Purchase via Meta Conversions API (CAPI) com o MESMO eventId do navegador
        const clientIp = req.headers["x-forwarded-for"] as string || req.socket.remoteAddress;
        const userAgent = req.headers["user-agent"];

        sendMetaPurchaseConversion({
          eventId,
          email: customer.email,
          phone: customer.phone,
          firstName: customer.name,
          clientIpAddress: clientIp,
          clientUserAgent: userAgent,
          fbp: tracking?._fbp,
          fbc: tracking?._fbc,
          value: OFFER_DETAILS.price,
          currency: "BRL",
        }).catch((e) => console.error("[ERRO DISPARO CAPI NO CARTAO]", e));
      }

      res.json({
        success: isApproved,
        transaction,
        message: isApproved ? "Pagamento aprovado com sucesso!" : mpResponse.rejectionMessage || "Cartão recusado.",
      });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Erro ao processar cartão com Mercado Pago.";
      console.error("[ERRO CARD ENDPOINT]", errorMsg);
      res.status(500).json({ success: false, message: errorMsg });
    }
  });

  // 6. Consulta de Status da Transação (utilizado para polling automático do Pix)
  app.get("/api/payment/status/:id", async (req, res) => {
    const { id } = req.params;
    let transaction = transactionsDb.get(id);

    // Se não encontrou pelo ID local, procura pelo ID do Mercado Pago
    if (!transaction) {
      for (const t of transactionsDb.values()) {
        if (t.mpPaymentId === id) {
          transaction = t;
          break;
        }
      }
    }

    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transação não encontrada." });
    }

    // Se ainda está pendente e possui ID no Mercado Pago, verifica na API do MP
    if (transaction.status === "pending" && transaction.mpPaymentId && !transaction.mpPaymentId.startsWith("MP-TEST")) {
      const updated = await getPaymentStatus(transaction.mpPaymentId);
      if (updated && updated.status === "approved") {
        transaction.status = "approved";
        transaction.accessGranted = true;
        transactionsDb.set(transaction.id, transaction);

        await liberarAcesso(transaction.customer.email, transaction.customer.name);

        sendMetaPurchaseConversion({
          eventId: transaction.eventId,
          email: transaction.customer.email,
          phone: transaction.customer.phone,
          firstName: transaction.customer.name,
          fbp: transaction.tracking?._fbp,
          fbc: transaction.tracking?._fbc,
          value: OFFER_DETAILS.price,
          currency: "BRL",
        }).catch((e) => console.error("[CAPI STATUS SYNC ERROR]", e));
      }
    }

    const access = getAccessByEmail(transaction.customer.email);

    res.json({
      success: true,
      transaction,
      access,
    });
  });

  // 7. Simulação de Aprovação Instantânea (para testes e homologação rápida em ambiente local/sandbox)
  app.post("/api/payment/simulate-approve", async (req, res) => {
    try {
      const { transactionId } = req.body;
      const transaction = transactionsDb.get(transactionId);

      if (!transaction) {
        return res.status(404).json({ success: false, message: "Transação não encontrada." });
      }

      transaction.status = "approved";
      transaction.accessGranted = true;
      transactionsDb.set(transactionId, transaction);

      const access = await liberarAcesso(transaction.customer.email, transaction.customer.name);

      const clientIp = req.headers["x-forwarded-for"] as string || req.socket.remoteAddress;
      const userAgent = req.headers["user-agent"];

      sendMetaPurchaseConversion({
        eventId: transaction.eventId,
        email: transaction.customer.email,
        phone: transaction.customer.phone,
        firstName: transaction.customer.name,
        clientIpAddress: clientIp,
        clientUserAgent: userAgent,
        fbp: transaction.tracking?._fbp,
        fbc: transaction.tracking?._fbc,
        value: OFFER_DETAILS.price,
        currency: "BRL",
      }).catch((e) => console.error("[CAPI SIMULATE ERROR]", e));

      console.log(`[SIMULAÇÃO APROVADA] Transação: ${transactionId} confirmada.`);

      res.json({
        success: true,
        message: "Pagamento aprovado com sucesso! Acesso liberado.",
        transaction,
        access,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao simular aprovação.";
      res.status(500).json({ success: false, message: msg });
    }
  });

  // 8. Webhook do Mercado Pago
  app.post("/api/webhook/mercadopago", async (req, res) => {
    try {
      const xSignature = req.headers["x-signature"] as string | undefined;
      const paymentId = (req.body?.data?.id || req.query?.id || req.body?.id) as string;

      console.log(`[WEBHOOK MERCADO PAGO RECEBIDO] ID: ${paymentId} | Ação: ${req.body?.action || req.body?.type}`);

      if (!paymentId) {
        return res.status(200).send("No payment id in webhook");
      }

      // Validação de assinatura
      const isValid = verifyWebhookSignature(xSignature, paymentId);
      if (!isValid) {
        console.warn(`[WEBHOOK RECUSADO] Assinatura inválida para paymentId ${paymentId}`);
        return res.status(401).send("Invalid signature");
      }

      // Idempotência: chave composta por paymentId e status
      const webhookKey = `${paymentId}_${req.body?.action || req.body?.type || "update"}`;
      if (processedWebhooks.has(webhookKey)) {
        console.log(`[WEBHOOK DUPLICADO IGNORADO] ${webhookKey}`);
        return res.status(200).send("Already processed");
      }
      processedWebhooks.add(webhookKey);

      // Consulta oficial do pagamento na API do Mercado Pago antes de confiar
      const payment = await getPaymentStatus(paymentId);
      if (!payment) {
        console.warn(`[WEBHOOK MP] Não foi possível consultar pagamento ${paymentId} na API do MP.`);
        return res.status(200).send("Payment not found");
      }

      console.log(`[WEBHOOK STATUS MP] Pagamento ${paymentId} está com status: ${payment.status}`);

      // Encontra a transação local correspondente
      let matchedTransaction: PaymentTransaction | undefined;
      for (const t of transactionsDb.values()) {
        if (t.mpPaymentId === String(paymentId)) {
          matchedTransaction = t;
          break;
        }
      }

      if (payment.status === "approved") {
        if (matchedTransaction) {
          matchedTransaction.status = "approved";
          matchedTransaction.accessGranted = true;
          transactionsDb.set(matchedTransaction.id, matchedTransaction);

          await liberarAcesso(matchedTransaction.customer.email, matchedTransaction.customer.name);

          // Dispara Purchase via CAPI no Webhook
          await sendMetaPurchaseConversion({
            eventId: matchedTransaction.eventId,
            email: matchedTransaction.customer.email,
            phone: matchedTransaction.customer.phone,
            firstName: matchedTransaction.customer.name,
            fbp: matchedTransaction.tracking?._fbp,
            fbc: matchedTransaction.tracking?._fbc,
            value: OFFER_DETAILS.price,
            currency: "BRL",
          });
        }
      } else if (payment.status === "refunded" || payment.status === "charged_back" || payment.status === "cancelled") {
        if (matchedTransaction) {
          matchedTransaction.status = "rejected";
          transactionsDb.set(matchedTransaction.id, matchedTransaction);
          await revogarAcesso(matchedTransaction.customer.email);
        }
      }

      return res.status(200).json({ status: "ok" });
    } catch (err) {
      console.error("[WEBHOOK EXCEPTION]", err);
      // Sempre retorna 200 para evitar re-tentativas infinitas de payloads corrompidos
      return res.status(200).send("Webhook caught with error");
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
