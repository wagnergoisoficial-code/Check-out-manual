import { TrackingData } from "../types";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Lê o valor de um cookie pelo nome
 */
function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return undefined;
}

/**
 * Coleta os parâmetros de rastreamento UTM, FBCLID e cookies _fbp e _fbc
 */
export function getTrackingParams(): TrackingData {
  if (typeof window === "undefined") return {};

  const urlParams = new URLSearchParams(window.location.search);
  const utm_source = urlParams.get("utm_source") || undefined;
  const utm_medium = urlParams.get("utm_medium") || undefined;
  const utm_campaign = urlParams.get("utm_campaign") || undefined;
  const utm_content = urlParams.get("utm_content") || undefined;
  const utm_term = urlParams.get("utm_term") || undefined;
  const fbclid = urlParams.get("fbclid") || undefined;

  const _fbp = getCookie("_fbp");
  const _fbc = getCookie("_fbc") || (fbclid ? `fb.1.${Date.now()}.${fbclid}` : undefined);

  return {
    utm_source,
    utm_medium,
    utm_campaign,
    utm_content,
    utm_term,
    fbclid,
    _fbp,
    _fbc,
  };
}

/**
 * Dispara evento InitiateCheckout do Meta Pixel
 */
export function trackInitiateCheckout(value: number = 39.9, currency: string = "BRL") {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", "InitiateCheckout", {
      value,
      currency,
      content_name: "Plataforma Método 5P + Manual de Sobrevivência (PDF)",
      content_category: "Educação / Preparação",
    });
    console.log("[PIXEL META] Evento InitiateCheckout disparado");
  }
}

/**
 * Dispara evento AddPaymentInfo do Meta Pixel
 */
export function trackAddPaymentInfo(paymentMethod: "pix" | "credit_card", value: number = 39.9) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", "AddPaymentInfo", {
      value,
      currency: "BRL",
      content_name: "Plataforma Método 5P + Manual de Sobrevivência (PDF)",
      payment_type: paymentMethod === "pix" ? "Pix" : "Cartão de Crédito",
    });
    console.log(`[PIXEL META] Evento AddPaymentInfo (${paymentMethod}) disparado`);
  }
}

/**
 * Dispara evento Purchase no navegador com o MESMO event_id para desduplicação no Meta CAPI
 */
export function trackBrowserPurchase(eventId: string, value: number = 39.9, currency: string = "BRL") {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq(
      "track",
      "Purchase",
      {
        value,
        currency,
        content_name: "Plataforma Método 5P + Manual de Sobrevivência (PDF)",
        content_type: "product",
      },
      { eventID: eventId }
    );
    console.log(`[PIXEL META] Evento Purchase disparado no navegador com eventID: ${eventId}`);
  }
}
