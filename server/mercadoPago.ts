import crypto from "crypto";

export interface CreatePixParams {
  amount: number;
  description: string;
  payer: {
    email: string;
    firstName: string;
    phone: string;
    identification: {
      type: "CPF";
      number: string;
    };
  };
  eventId: string;
  metadata?: Record<string, unknown>;
}

export interface CreateCardParams {
  token: string;
  amount: number;
  description: string;
  installments: number;
  paymentMethodId: string;
  issuerId?: string;
  payer: {
    email: string;
    firstName: string;
    identification: {
      type: "CPF";
      number: string;
    };
  };
  eventId: string;
  metadata?: Record<string, unknown>;
}

export interface MercadoPagoPaymentResponse {
  id: string | number;
  status: "approved" | "pending" | "in_process" | "rejected" | "cancelled" | "refunded" | "charged_back";
  statusDetail?: string;
  paymentMethodId: string;
  paymentTypeId: string;
  qrCode?: string;
  qrCodeBase64?: string;
  ticketUrl?: string;
  dateOfExpiration?: string;
  rejectionMessage?: string;
}

/**
 * Traduz detalhes técnicos de recusa de cartão do Mercado Pago para mensagens claras em português
 */
export function translateCardRejection(statusDetail?: string): string {
  switch (statusDetail) {
    case "cc_rejected_insufficient_amount":
      return "Saldo insuficiente no cartão. Você pode tentar outro cartão ou pagar via Pix com aprovação imediata.";
    case "cc_rejected_bad_filled_security_code":
      return "Código de segurança (CVV) inválido. Verifique os 3 ou 4 dígitos do verso do cartão.";
    case "cc_rejected_bad_filled_date":
      return "Data de validade incorreta ou cartão expirado.";
    case "cc_rejected_bad_filled_other":
      return "Dados do cartão incorretos. Verifique o número e nome gravado no cartão.";
    case "cc_rejected_call_for_authorize":
      return "Pagamento não autorizado pelo seu banco. Ligue para o emissor do cartão ou pague via Pix instantâneo.";
    case "cc_rejected_high_risk":
      return "Pagamento recusado por segurança da operadora. Recomendamos efetuar o pagamento com Pix para liberação imediata.";
    default:
      return "Cartão recusado pelo emissor. Recomendamos pagar com Pix para ter acesso liberado na hora.";
  }
}

/**
 * Cria pagamento via PIX no Mercado Pago
 */
export async function createPixPayment(params: CreatePixParams): Promise<MercadoPagoPaymentResponse> {
  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  const cleanCpf = params.payer.identification.number.replace(/\D/g, "");

  // Se o usuário já configurou o token real no ambiente
  if (accessToken && accessToken.trim() !== "") {
    try {
      const response = await fetch("https://api.mercadopago.com/v1/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken.trim()}`,
          "X-Idempotency-Key": params.eventId,
        },
        body: JSON.stringify({
          transaction_amount: params.amount,
          description: params.description,
          payment_method_id: "pix",
          payer: {
            email: params.payer.email,
            first_name: params.payer.firstName,
            identification: {
              type: "CPF",
              number: cleanCpf,
            },
          },
          metadata: params.metadata,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("[MERCADO PAGO PIX ERRO]", data);
        throw new Error(data.message || "Erro ao gerar cobrança PIX no Mercado Pago.");
      }

      const pointOfInteraction = data.point_of_interaction?.transaction_data;
      return {
        id: String(data.id),
        status: data.status,
        statusDetail: data.status_detail,
        paymentMethodId: "pix",
        paymentTypeId: "bank_transfer",
        qrCode: pointOfInteraction?.qr_code || "",
        qrCodeBase64: pointOfInteraction?.qr_code_base64 || "",
        ticketUrl: pointOfInteraction?.ticket_url,
        dateOfExpiration: data.date_of_expiration,
      };
    } catch (err) {
      console.error("[MERCADO PAGO EXCEPTION]", err);
      throw err;
    }
  }

  // MODO TESTE / SANDBOX INTEGRADO
  // Gera payload compatível com padrão BRCode para testes funcionais transparentes
  const testPixId = `MP-TEST-PIX-${Date.now()}`;
  const brCodeSample = `00020126580014BR.GOV.BCB.PIX0136metodo5p-pix@bunker.com52040000530398654039.905802BR5916PLATAFORMA_5P6009SAO_PAULO62070503***6304${Math.floor(1000 + Math.random() * 9000)}`;
  const expiration = new Date(Date.now() + 30 * 60 * 1000).toISOString();

  return {
    id: testPixId,
    status: "pending",
    statusDetail: "pending_waiting_transfer",
    paymentMethodId: "pix",
    paymentTypeId: "bank_transfer",
    qrCode: brCodeSample,
    qrCodeBase64: "", // O front-end usará renderizador visual com fallback
    dateOfExpiration: expiration,
  };
}

/**
 * Cria pagamento via Cartão no Mercado Pago
 */
export async function createCardPayment(params: CreateCardParams): Promise<MercadoPagoPaymentResponse> {
  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  const cleanCpf = params.payer.identification.number.replace(/\D/g, "");

  if (accessToken && accessToken.trim() !== "") {
    try {
      const response = await fetch("https://api.mercadopago.com/v1/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken.trim()}`,
          "X-Idempotency-Key": params.eventId,
        },
        body: JSON.stringify({
          token: params.token,
          transaction_amount: params.amount,
          description: params.description,
          installments: params.installments || 1,
          payment_method_id: params.paymentMethodId,
          issuer_id: params.issuerId,
          payer: {
            email: params.payer.email,
            first_name: params.payer.firstName,
            identification: {
              type: "CPF",
              number: cleanCpf,
            },
          },
          metadata: params.metadata,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("[MERCADO PAGO CARTAO ERRO]", data);
        const rejectionMsg = translateCardRejection(data.status_detail || data.cause?.[0]?.code);
        return {
          id: String(data.id || Date.now()),
          status: "rejected",
          statusDetail: data.status_detail,
          paymentMethodId: params.paymentMethodId,
          paymentTypeId: "credit_card",
          rejectionMessage: rejectionMsg,
        };
      }

      return {
        id: String(data.id),
        status: data.status,
        statusDetail: data.status_detail,
        paymentMethodId: data.payment_method_id,
        paymentTypeId: data.payment_type_id,
        rejectionMessage: data.status === "rejected" ? translateCardRejection(data.status_detail) : undefined,
      };
    } catch (err) {
      console.error("[MERCADO PAGO CARTAO EXCEPTION]", err);
      throw err;
    }
  }

  // MODO TESTE / DEMO DO CARTÃO (quando em ambiente local sem Access Token configurado)
  // Simula aprovação de teste
  const testCardId = `MP-TEST-CARD-${Date.now()}`;
  return {
    id: testCardId,
    status: "approved",
    statusDetail: "accredited",
    paymentMethodId: params.paymentMethodId || "visa",
    paymentTypeId: "credit_card",
  };
}

/**
 * Consulta status atualizado de um pagamento na API do Mercado Pago
 */
export async function getPaymentStatus(paymentId: string | number): Promise<MercadoPagoPaymentResponse | null> {
  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  if (!accessToken || accessToken.trim() === "") {
    return null;
  }

  try {
    const res = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${accessToken.trim()}`,
      },
    });

    if (!res.ok) return null;
    const data = await res.json();
    return {
      id: String(data.id),
      status: data.status,
      statusDetail: data.status_detail,
      paymentMethodId: data.payment_method_id,
      paymentTypeId: data.payment_type_id,
      rejectionMessage: data.status === "rejected" ? translateCardRejection(data.status_detail) : undefined,
    };
  } catch (err) {
    console.error(`[MERCADO PAGO GET PAYMENT ERRO ${paymentId}]`, err);
    return null;
  }
}

/**
 * Valida a assinatura de notificação webhook (x-signature) do Mercado Pago
 */
export function verifyWebhookSignature(
  xSignatureHeader: string | undefined,
  paymentDataId: string
): boolean {
  const secret = process.env.MERCADO_PAGO_WEBHOOK_SECRET;
  if (!secret) {
    // Se o segredo não estiver configurado, permite em modo de desenvolvimento com log de aviso
    console.warn("[WEBHOOK MP] MERCADO_PAGO_WEBHOOK_SECRET não configurado. Ignorando validação HMAC.");
    return true;
  }

  if (!xSignatureHeader) return false;

  // x-signature vem no formato: ts=123456789,v1=hash...
  const parts = xSignatureHeader.split(",");
  let ts = "";
  let v1 = "";

  for (const part of parts) {
    const [key, val] = part.split("=");
    if (key.trim() === "ts") ts = val.trim();
    if (key.trim() === "v1") v1 = val.trim();
  }

  if (!ts || !v1) return false;

  const manifest = `id:${paymentDataId};request-id:;ts:${ts};`;
  const computedHash = crypto.createHmac("sha256", secret).update(manifest).digest("hex");

  return computedHash === v1;
}
