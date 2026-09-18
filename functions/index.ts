import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import crypto from "crypto";

admin.initializeApp();
const db = admin.firestore();
const auth = admin.auth();

const MERCADO_PAGO_ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN || "";
const MERCADO_PAGO_WEBHOOK_SECRET = process.env.MERCADO_PAGO_WEBHOOK_SECRET || "";
const META_PIXEL_ID = process.env.META_PIXEL_ID || "1620681930065193";
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN || "";

/**
 * Libera o acesso no Firebase Auth e grava no Firestore
 */
export async function liberarAcessoFirebase(email: string, name: string): Promise<string> {
  const cleanEmail = email.trim().toLowerCase();
  let uid = "";

  try {
    const existingUser = await auth.getUserByEmail(cleanEmail);
    uid = existingUser.uid;
  } catch (err: any) {
    if (err.code === "auth/user-not-found") {
      const tempPassword = `5P#${crypto.randomBytes(4).toString("hex")}`;
      const newUser = await auth.createUser({
        email: cleanEmail,
        displayName: name,
        password: tempPassword,
      });
      uid = newUser.uid;
    } else {
      throw err;
    }
  }

  const licenseKey = `5P-${crypto.randomBytes(4).toString("hex").toUpperCase()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

  await db.collection("users").doc(uid).set(
    {
      email: cleanEmail,
      name,
      status: "active",
      product: "metodo-5p",
      licenseKey,
      portalUrl: "https://appmanualcompleto.com/workbook",
      accessGrantedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  // Aqui você pode disparar o envio de e-mail via SendGrid / Resend / Trigger Email Extension
  return licenseKey;
}

/**
 * Revoga o acesso no Firebase Auth e Firestore em caso de chargeback/reembolso
 */
export async function revogarAcessoFirebase(email: string): Promise<void> {
  const cleanEmail = email.trim().toLowerCase();
  try {
    const user = await auth.getUserByEmail(cleanEmail);
    await auth.updateUser(user.uid, { disabled: true });
    await db.collection("users").doc(user.uid).update({
      status: "revoked",
      revokedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (err) {
    console.error("Erro ao revogar acesso:", err);
  }
}

/**
 * Dispara Purchase via Meta Conversions API (CAPI)
 */
async function sendMetaCapiPurchase(params: {
  eventId: string;
  email: string;
  phone?: string;
  value: number;
}) {
  if (!META_ACCESS_TOKEN) return;

  const sha256 = (v: string) => crypto.createHash("sha256").update(v.trim().toLowerCase()).digest("hex");

  const eventData = {
    event_name: "Purchase",
    event_time: Math.floor(Date.now() / 1000),
    event_id: params.eventId,
    action_source: "website",
    user_data: {
      em: [sha256(params.email)],
      ph: params.phone ? [sha256(params.phone.replace(/\D/g, ""))] : [],
    },
    custom_data: {
      currency: "BRL",
      value: params.value,
      content_name: "Plataforma Método 5P + Manual de Sobrevivência (PDF)",
      content_type: "product",
    },
  };

  try {
    await fetch(`https://graph.facebook.com/v19.0/${META_PIXEL_ID}/events?access_token=${META_ACCESS_TOKEN}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: [eventData] }),
    });
  } catch (err) {
    console.error("Erro Meta CAPI:", err);
  }
}

/**
 * Webhook Oficial do Mercado Pago para Firebase Functions
 */
export const mercadopagoWebhook = functions.https.onRequest(async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  try {
    const paymentId = (req.body?.data?.id || req.query?.id || req.body?.id) as string;
    if (!paymentId) {
      res.status(200).send("No payment ID");
      return;
    }

    // Idempotência no Firestore
    const webhookRef = db.collection("processed_webhooks").doc(String(paymentId));
    const webhookDoc = await webhookRef.get();
    if (webhookDoc.exists && webhookDoc.data()?.status === req.body?.action) {
      res.status(200).send("Already processed");
      return;
    }

    // Consulta na API do Mercado Pago
    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}` },
    });

    if (!mpRes.ok) {
      res.status(200).send("Payment fetch failed");
      return;
    }

    const payment = await mpRes.json();
    const email = payment.payer?.email;
    const name = payment.payer?.first_name || "Cliente Método 5P";
    const eventId = payment.metadata?.event_id || `evt_mp_${paymentId}`;

    if (payment.status === "approved" && email) {
      await liberarAcessoFirebase(email, name);
      await sendMetaCapiPurchase({
        eventId,
        email,
        phone: payment.payer?.phone?.number,
        value: 39.9,
      });

      await webhookRef.set({
        paymentId,
        status: "approved",
        processedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    } else if (["refunded", "charged_back", "cancelled"].includes(payment.status) && email) {
      await revogarAcessoFirebase(email);
      await webhookRef.set({
        paymentId,
        status: payment.status,
        processedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    res.status(200).json({ status: "success" });
  } catch (err) {
    console.error("Webhook processing error:", err);
    res.status(200).send("Webhook caught with error");
  }
});
