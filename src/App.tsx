import React, { useState, useEffect, useRef } from "react";
import { Header } from "./components/Header";
import { ProductSummary } from "./components/ProductSummary";
import { VisualBundleHero } from "./components/VisualBundleHero";
import { CustomerForm } from "./components/CustomerForm";
import { PaymentSection } from "./components/PaymentSection";
import { CheckoutFaq } from "./components/CheckoutFaq";
import { PixScreen } from "./components/PixScreen";
import { ThankYouScreen } from "./components/ThankYouScreen";
import { Footer } from "./components/Footer";
import { LegalModals } from "./components/LegalModals";
import { CustomerData, PaymentTransaction, TrackingData } from "./types";
import { getTrackingParams, trackInitiateCheckout, trackAddPaymentInfo } from "./lib/tracking";

function isValidCpf(cpf: string): boolean {
  const clean = cpf.replace(/\D/g, "");
  if (clean.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(clean)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(clean.charAt(i), 10) * (10 - i);
  let rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(clean.charAt(9), 10)) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(clean.charAt(i), 10) * (11 - i);
  rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  return rev === parseInt(clean.charAt(10), 10);
}

export function App() {
  const [customer, setCustomer] = useState<CustomerData>({
    name: "",
    email: "",
    phone: "",
    document: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CustomerData, string>>>({});
  const [tracking, setTracking] = useState<TrackingData>({});
  const [publicKey, setPublicKey] = useState<string>("");
  const [activeTransaction, setActiveTransaction] = useState<PaymentTransaction | null>(null);
  const [step, setStep] = useState<"checkout" | "pix_screen" | "thank_you">("checkout");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [legalModal, setLegalModal] = useState<"terms" | "privacy" | null>(null);

  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Inicialização: rastreamento UTM, Meta Pixel e verificação de rota
  useEffect(() => {
    const params = getTrackingParams();
    setTracking(params);

    // Dispara InitiateCheckout no carregamento do checkout
    trackInitiateCheckout(39.9, "BRL");

    // Busca a Public Key configurada para o Mercado Pago
    fetch("/api/config/mp-public-key")
      .then((res) => res.json())
      .then((data) => {
        if (data?.publicKey) setPublicKey(data.publicKey);
      })
      .catch(() => {});

    // Se a URL direta for /obrigado
    if (window.location.pathname === "/obrigado") {
      const saved = localStorage.getItem("last_5p_transaction");
      if (saved) {
        try {
          setActiveTransaction(JSON.parse(saved));
          setStep("thank_you");
        } catch {
          // segue normal
        }
      }
    }
  }, []);

  // Polling automático da tela do Pix (percebe o pagamento sozinho)
  useEffect(() => {
    if (step === "pix_screen" && activeTransaction?.id) {
      pollingRef.current = setInterval(async () => {
        try {
          const res = await fetch(`/api/payment/status/${activeTransaction.id}`);
          if (res.ok) {
            const data = await res.json();
            if (data?.transaction?.status === "approved") {
              if (pollingRef.current) clearInterval(pollingRef.current);
              setActiveTransaction(data.transaction);
              localStorage.setItem("last_5p_transaction", JSON.stringify(data.transaction));
              setStep("thank_you");
              window.history.pushState({}, "", "/obrigado");
            }
          }
        } catch {
          // segue o polling silencioso
        }
      }, 3000);
    }

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [step, activeTransaction?.id]);

  const handleCustomerChange = (field: keyof CustomerData, value: string) => {
    setCustomer((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CustomerData, string>> = {};

    if (!customer.name || customer.name.trim().length < 3) {
      newErrors.name = "Informe seu nome completo.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!customer.email || !emailRegex.test(customer.email.trim())) {
      newErrors.email = "Informe um e-mail válido para receber o acesso.";
    }

    const cleanPhone = customer.phone.replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length < 10) {
      newErrors.phone = "Informe um WhatsApp válido com DDD (ex: 11 99999-9999).";
    }

    const cleanCpf = customer.document.replace(/\D/g, "");
    if (!cleanCpf || cleanCpf.length !== 11) {
      newErrors.document = "Informe os 11 números do seu CPF.";
    } else if (!isValidCpf(customer.document)) {
      newErrors.document = "CPF inválido. Confira os números digitados.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Gerar cobrança PIX
  const handleGeneratePix = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);
    try {
      trackAddPaymentInfo("pix", 39.9);

      const res = await fetch("/api/payment/pix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer,
          tracking,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data?.message || "Não foi possível gerar a cobrança Pix. Tente novamente.");
        return;
      }

      setActiveTransaction(data.transaction);
      localStorage.setItem("last_5p_transaction", JSON.stringify(data.transaction));
      setStep("pix_screen");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      alert("Erro ao conectar com o servidor para emissão do Pix. Tente novamente.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Processar pagamento com Cartão
  const handleCardPayment = async (cardFormData: any): Promise<PaymentTransaction | null> => {
    if (!validateForm()) return null;

    trackAddPaymentInfo("credit_card", 39.9);

    const res = await fetch("/api/payment/card", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: cardFormData.token,
        issuerId: cardFormData.issuer_id,
        paymentMethodId: cardFormData.payment_method_id,
        installments: cardFormData.installments,
        customer,
        tracking,
      }),
    });

    const data = await res.json();
    const trx: PaymentTransaction = data.transaction;

    if (trx?.status === "approved") {
      setActiveTransaction(trx);
      localStorage.setItem("last_5p_transaction", JSON.stringify(trx));
      setStep("thank_you");
      window.history.pushState({}, "", "/obrigado");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    return trx;
  };

  // Simular aprovação imediata do Pix em ambiente de teste
  const handleSimulateApprove = async () => {
    if (!activeTransaction?.id) return;
    try {
      const res = await fetch("/api/payment/simulate-approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId: activeTransaction.id }),
      });

      const data = await res.json();
      if (data.success) {
        setActiveTransaction(data.transaction);
        localStorage.setItem("last_5p_transaction", JSON.stringify(data.transaction));
        setStep("thank_you");
        window.history.pushState({}, "", "/obrigado");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* a) Topo sem menu ou links de saída */}
      <Header />

      <main className="flex-1 w-full max-w-xl mx-auto px-4 py-5 sm:py-6">
        {step === "checkout" && (
          <div className="space-y-5 animate-fade-in">
            {/* Primeiro contêiner acima da página de checkout: Poster Visual Oficial do Bundle */}
            <VisualBundleHero />

            {/* b) Resumo Compacto da Oferta */}
            <ProductSummary price={39.9} />

            {/* c) Formulário com dados essenciais */}
            <CustomerForm
              data={customer}
              onChange={handleCustomerChange}
              errors={errors}
              onOpenPrivacy={() => setLegalModal("privacy")}
              tracking={tracking}
            />

            {/* d) Pagamento em 2 abas (PIX e CARTÃO), selos de segurança e garantia */}
            <PaymentSection
              customer={customer}
              amount={39.9}
              publicKey={publicKey}
              onGeneratePix={handleGeneratePix}
              onSubmitCardPayment={handleCardPayment}
              isProcessing={isProcessing}
              onValidateForm={validateForm}
            />

            {/* e) FAQ curto (acordeão) para sanar as principais dúvidas */}
            <CheckoutFaq />
          </div>
        )}

        {step === "pix_screen" && activeTransaction && (
          <div className="animate-fade-in">
            <PixScreen
              transaction={activeTransaction}
              onSimulateApprove={handleSimulateApprove}
              onCancel={() => setStep("checkout")}
            />
          </div>
        )}

        {step === "thank_you" && activeTransaction && (
          <div className="animate-fade-in">
            <ThankYouScreen transaction={activeTransaction} />
          </div>
        )}
      </main>

      {/* f) Rodapé legal (Decreto 7.962/2013) */}
      <Footer
        onOpenTerms={() => setLegalModal("terms")}
        onOpenPrivacy={() => setLegalModal("privacy")}
      />

      {/* Modais Legais in-page (sem tirar da página) */}
      <LegalModals modalType={legalModal} onClose={() => setLegalModal(null)} />
    </div>
  );
}

export default App;
