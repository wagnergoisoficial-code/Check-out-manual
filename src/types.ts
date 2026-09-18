export interface OfferInfo {
  id: string;
  name: string;
  bonus: string;
  items: string[];
  price: number;
  paymentType: string;
  guaranteeDays: number;
  deliveryText: string;
}

export interface CustomerData {
  name: string;
  email: string;
  phone: string;
  document: string; // CPF
}

export interface TrackingData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  fbclid?: string;
  _fbp?: string;
  _fbc?: string;
  eventId?: string;
}

export interface PaymentTransaction {
  id: string;
  mpPaymentId?: string;
  status: "approved" | "pending" | "rejected" | "in_process";
  paymentMethod: "pix" | "credit_card";
  total: number;
  customer: CustomerData;
  tracking: TrackingData;
  eventId: string;
  qrCode?: string;
  qrCodeBase64?: string;
  expirationDate?: string;
  ticketUrl?: string;
  rejectionMessage?: string;
  createdAt: string;
  accessGranted?: boolean;
}
