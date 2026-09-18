import React, { useState, useEffect } from "react";
import { initMercadoPago, CardPayment } from "@mercadopago/sdk-react";
import { Zap, CreditCard, ShieldCheck, AlertCircle, ArrowRight, Loader2, Lock, Shield, KeyRound } from "lucide-react";
import { CustomerData, PaymentTransaction } from "../types";

interface PaymentSectionProps {
  customer: CustomerData;
  amount: number;
  publicKey: string;
  onGeneratePix: () => Promise<void>;
  onSubmitCardPayment: (cardFormData: any) => Promise<PaymentTransaction | null>;
  isProcessing: boolean;
  onValidateForm: () => boolean;
}

export const PaymentSection: React.FC<PaymentSectionProps> = ({
  customer,
  amount,
  publicKey,
  onGeneratePix,
  onSubmitCardPayment,
  isProcessing,
  onValidateForm,
}) => {
  const [activeTab, setActiveTab] = useState<"pix" | "card">("pix");
  const [cardRejection, setCardRejection] = useState<string | null>(null);
  const [mpInitialized, setMpInitialized] = useState(false);
  const [isSubmittingCard, setIsSubmittingCard] = useState(false);

  // Inicializa SDK do Mercado Pago no navegador se tiver chave pública
  useEffect(() => {
    if (publicKey && publicKey.trim() !== "") {
      try {
        initMercadoPago(publicKey.trim(), { locale: "pt-BR" });
        setMpInitialized(true);
      } catch (err) {
        console.warn("[MERCADO PAGO SDK INIT WARN]", err);
      }
    }
  }, [publicKey]);

  const handlePixClick = async () => {
    if (!onValidateForm()) return;
    await onGeneratePix();
  };

  const handleCardSubmit = async (param: any) => {
    if (!onValidateForm()) return;

    setCardRejection(null);
    setIsSubmittingCard(true);
    try {
      const result = await onSubmitCardPayment(param);
      if (result && result.status === "rejected") {
        setCardRejection(
          result.rejectionMessage || "Cartão recusado pelo emissor. Recomendamos efetuar o pagamento via Pix instantâneo."
        );
      }
    } catch (err: any) {
      setCardRejection(err?.message || "Ocorreu um erro ao processar seu cartão. Tente via Pix para aprovação imediata.");
    } finally {
      setIsSubmittingCard(false);
    }
  };

  const cleanCpf = (customer.document || "").replace(/\D/g, "");

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
      <div className="border-b border-slate-800/80 pb-2 flex items-center justify-between">
        <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center">
            2
          </span>
          Forma de Pagamento
        </h2>
        <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" /> Ambiente Seguro
        </span>
      </div>

      {/* Abas: PIX (já selecionada por padrão) e CARTÃO */}
      <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
        <button
          type="button"
          onClick={() => {
            setActiveTab("pix");
            setCardRejection(null);
          }}
          className={`py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === "pix"
              ? "bg-slate-800 text-amber-400 shadow-md border border-amber-500/40"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
          <span>PIX</span>
          <span className="hidden sm:inline-block text-[10px] bg-emerald-950/80 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-800">
            Aprovação Imediata
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("card")}
          className={`py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === "card"
              ? "bg-slate-800 text-amber-400 shadow-md border border-amber-500/40"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <CreditCard className="w-4 h-4 text-slate-300" />
          <span>CARTÃO</span>
        </button>
      </div>

      {/* CONTEÚDO DA ABA PIX */}
      {activeTab === "pix" && (
        <div className="space-y-4 pt-1">
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Zap className="w-4 h-4" />
              <span>Aprovado na hora • Acesso imediato ao workbook e PDF</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Ao clicar no botão abaixo, geramos o seu código Pix oficial com valor exato de <strong>R$ 39,90</strong>.
            </p>
          </div>

          {/* O ÚNICO BOTÃO COM COR FORTE: ÂMBAR */}
          <button
            type="button"
            onClick={handlePixClick}
            disabled={isProcessing}
            className="w-full py-4 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-base sm:text-lg tracking-wide flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
                <span>Gerando Pix Seguro...</span>
              </>
            ) : (
              <>
                <span>Gerar Pix — R$ 39,90</span>
                <ArrowRight className="w-5 h-5 text-slate-950 stroke-[3]" />
              </>
            )}
          </button>
        </div>
      )}

      {/* CONTEÚDO DA ABA CARTÃO */}
      {activeTab === "card" && (
        <div className="space-y-4 pt-1">
          {/* Mensagem em caso de Cartão Recusado */}
          {cardRejection && (
            <div className="bg-rose-950/40 border border-rose-800/80 rounded-xl p-3.5 text-xs space-y-2 text-rose-200 animate-fade-in">
              <div className="flex items-center gap-2 text-rose-300 font-bold">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{cardRejection}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCardRejection(null);
                  setActiveTab("pix");
                }}
                className="w-full mt-1 py-2.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>Pagar com Pix — Aprovação Imediata</span>
              </button>
            </div>
          )}

          {/* Brick Oficial do Mercado Pago ou Fallback Seguro de Teste */}
          {mpInitialized && publicKey ? (
            <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3 text-slate-200">
              <CardPayment
                initialization={{
                  amount: amount,
                  payer: {
                    email: customer.email || "cliente@exemplo.com",
                    identification: {
                      type: "CPF",
                      number: cleanCpf || "00000000000",
                    },
                  },
                }}
                customization={{
                  visual: {
                    style: {
                      theme: "dark",
                      customVariables: {
                        baseColor: "#f59e0b",
                      },
                    },
                  },
                  paymentMethods: {
                    maxInstallments: 6,
                  },
                }}
                onSubmit={handleCardSubmit}
                onError={(err) => {
                  console.error("[MERCADO PAGO BRICK ERROR]", err);
                  setCardRejection("Erro nos dados do cartão. Verifique as informações ou pague via Pix.");
                }}
              />
            </div>
          ) : (
            /* Modo de Teste / Configuração para o desenvolvedor */
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-semibold">
                <CreditCard className="w-4 h-4 text-amber-400" />
                <span>Modo de Teste / Card Brick Pronto</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Para processamento em produção com o Mercado Pago Card Brick, informe a variável{" "}
                <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-300">VITE_MERCADO_PAGO_PUBLIC_KEY</code> e{" "}
                <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-300">MERCADO_PAGO_ACCESS_TOKEN</code> no arquivo{" "}
                <code className="text-slate-200">.env</code>.
              </p>

              {/* Botão de Pagamento do Cartão em Modo Teste */}
              <button
                type="button"
                onClick={() =>
                  handleCardSubmit({
                    token: "test_token_card_simulation",
                    payment_method_id: "visa",
                    installments: 1,
                    issuer_id: "25",
                  })
                }
                disabled={isSubmittingCard}
                className="w-full py-4 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-base tracking-wide flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 active:scale-[0.99] transition-all cursor-pointer"
              >
                {isSubmittingCard ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
                    <span>Processando Cartão...</span>
                  </>
                ) : (
                  <>
                    <span>Pagar com Cartão — R$ 39,90</span>
                    <ArrowRight className="w-5 h-5 text-slate-950 stroke-[3]" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Seção visual de alta percepção de segurança */}
      <div className="pt-2 border-t border-slate-800/80 space-y-2.5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-2.5 flex items-center gap-2.5 sm:flex-col sm:text-center sm:gap-1.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-white block leading-tight">Ambiente Seguro</span>
              <span className="text-[9px] text-slate-400 block leading-tight">Certificado SSL 256-bit</span>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-2.5 flex items-center gap-2.5 sm:flex-col sm:text-center sm:gap-1.5">
            <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center shrink-0 text-sky-400">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-white block leading-tight">Criptografia de Ponta a Ponta</span>
              <span className="text-[9px] text-slate-400 block leading-tight">Dados 100% blindados</span>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-2.5 flex items-center gap-2.5 sm:flex-col sm:text-center sm:gap-1.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-white block leading-tight">Privacidade Garantida</span>
              <span className="text-[9px] text-slate-400 block leading-tight">Conforme a LGPD</span>
            </div>
          </div>
        </div>

        {/* Garantia incondicional de 7 dias */}
        <div className="text-center pt-1">
          <p className="text-xs text-slate-400 font-medium inline-flex items-center justify-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>Garantia incondicional de 7 dias • Reembolso integral sem burocracia</span>
          </p>
        </div>
      </div>
    </div>
  );
};
