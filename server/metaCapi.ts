import crypto from "crypto";

function sha256(value: string): string {
  return crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

export interface MetaPurchasePayload {
  eventId: string;
  email?: string;
  phone?: string;
  firstName?: string;
  clientIpAddress?: string;
  clientUserAgent?: string;
  fbp?: string;
  fbc?: string;
  value: number;
  currency: string;
}

/**
 * Dispara evento Purchase via Meta Conversions API (CAPI)
 * Usa o MESMO event_id disparado no navegador para desduplicação perfeita
 */
export async function sendMetaPurchaseConversion(payload: MetaPurchasePayload): Promise<{ success: boolean; data?: unknown; error?: string }> {
  const pixelId = process.env.META_PIXEL_ID || "1620681930065193";
  const accessToken = process.env.META_ACCESS_TOKEN;

  if (!accessToken) {
    console.log(`[META CAPI - MODO TESTE/LOCAL] Pixel ID: ${pixelId} | Event ID: ${payload.eventId} | Valor: R$ ${payload.value} (META_ACCESS_TOKEN não configurado)`);
    return { success: true, error: "META_ACCESS_TOKEN_NOT_SET" };
  }

  const userData: Record<string, unknown> = {};

  if (payload.email) {
    userData.em = [sha256(payload.email)];
  }

  if (payload.phone) {
    const rawPhone = payload.phone.replace(/\D/g, "");
    const formattedPhone = rawPhone.startsWith("55") ? rawPhone : `55${rawPhone}`;
    userData.ph = [sha256(formattedPhone)];
  }

  if (payload.firstName) {
    userData.fn = [sha256(payload.firstName.split(" ")[0])];
  }

  if (payload.clientIpAddress) {
    userData.client_ip_address = payload.clientIpAddress;
  }

  if (payload.clientUserAgent) {
    userData.client_user_agent = payload.clientUserAgent;
  }

  if (payload.fbp) {
    userData.fbp = payload.fbp;
  }

  if (payload.fbc) {
    userData.fbc = payload.fbc;
  }

  const eventData = {
    event_name: "Purchase",
    event_time: Math.floor(Date.now() / 1000),
    event_id: payload.eventId,
    action_source: "website",
    user_data: userData,
    custom_data: {
      currency: payload.currency || "BRL",
      value: payload.value,
      content_name: "Plataforma Método 5P + Manual de Sobrevivência (PDF)",
      content_type: "product",
      num_items: 1,
    },
  };

  try {
    const url = `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${encodeURIComponent(accessToken)}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: [eventData],
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      console.error("[META CAPI ERRO]", result);
      return { success: false, error: JSON.stringify(result) };
    }

    console.log(`[META CAPI SUCESSO] Purchase enviado com event_id: ${payload.eventId}`, result);
    return { success: true, data: result };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("[META CAPI FALHA DE REDE]", errorMsg);
    return { success: false, error: errorMsg };
  }
}
