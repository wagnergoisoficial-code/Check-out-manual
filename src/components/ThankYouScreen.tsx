import React, { useEffect } from "react";
import { CheckCircle2, Mail, ExternalLink, MessageCircle, ShieldCheck, Download, Key } from "lucide-react";
import { PaymentTransaction } from "../types";
import { trackBrowserPurchase } from "../lib/tracking";

interface ThankYouScreenProps {
  transaction: PaymentTransaction;
  onReset?: () => void;
}

export const ThankYouScreen: React.FC<ThankYouScreenProps> = ({ transaction, onReset }) => {
  // Dispara o evento Purchase no navegador com o MESMO event_id para desduplicação no Meta CAPI
  useEffect(() => {
    if (transaction?.eventId) {
      trackBrowserPurchase(transaction.eventId, transaction.total || 39.9, "BRL");
    }
  }, [transaction?.eventId, transaction?.total]);

  const customerEmail = transaction.customer?.email || "seu e-mail informado";
  const customerName = transaction.customer?.name || "Cliente";

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
      {/* Box de Confirmação de Sucesso */}
      <div className="bg-slate-900/90 border border-emerald-500/40 rounded-2xl p-6 text-center space-y-3 shadow-2xl">
        <div className="w-16 h-16 bg-emerald-500/10 border-2 border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400 animate-bounce-short">
          <CheckCircle2 className="w-9 h-9 text-emerald-400 stroke-[2.5]" />
        </div>

        <div className="inline-flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs px-3 py-1 rounded-full font-bold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Pagamento 100% Aprovado</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Acesso Liberado com Sucesso!
        </h1>

        <p className="text-sm text-slate-300">
          Parabéns, <strong>{customerName}</strong>! Seu pedido para a{" "}
          <strong className="text-amber-400">Plataforma Método 5P + Manual em PDF</strong> foi
          confirmado.
        </p>

        <div className="text-xs text-slate-400 font-mono bg-slate-950 p-2 rounded-lg border border-slate-800 inline-block">
          Pedido: #{transaction.id} • Valor: R$ 39,90
        </div>
      </div>

      {/* Próximos Passos Obrigatórios */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
          <Mail className="w-4 h-4 text-amber-400" />
          Próximos passos para acessar agora:
        </h2>

        <div className="space-y-3 text-xs text-slate-300">
          <div className="flex items-start gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800/80">
            <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              1
            </div>
            <div>
              <strong className="text-white block">Abra o seu aplicativo de e-mail</strong>
              <span className="text-slate-400">
                Enviamos os dados de ativação e link direto para:{" "}
                <span className="text-amber-300 font-medium">{customerEmail}</span>
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800/80">
            <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              2
            </div>
            <div>
              <strong className="text-white block">Confira a caixa de entrada e spam</strong>
              <span className="text-slate-400">
                Caso não encontre na caixa principal em até 2 minutos, confira a pasta de "Spam" ou
                "Lixo Eletrônico".
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800/80">
            <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              3
            </div>
            <div>
              <strong className="text-white block">Acesse o workbook e baixe o PDF</strong>
              <span className="text-slate-400">
                Clique no botão abaixo para entrar direto na área de membros do Método 5P.
              </span>
            </div>
          </div>
        </div>

        {/* Botão de Acesso Direto ao Workbook */}
        <a
          href="https://appmanualcompleto.com/workbook"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-4 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-base flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 transition-all cursor-pointer block text-center"
        >
          <span>Acessar Plataforma Método 5P Agora</span>
          <ExternalLink className="w-5 h-5 text-slate-950" />
        </a>
      </div>

      {/* Contato de Suporte Claro */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center space-y-2 text-xs">
        <span className="text-slate-400 block font-medium">Precisa de ajuda ou não recebeu seu e-mail?</span>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
          <a
            href="mailto:suporte@appmanualcompleto.com"
            className="text-amber-400 hover:text-amber-300 flex items-center gap-1.5 underline font-medium"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>suporte@appmanualcompleto.com</span>
          </a>
          {transaction.customer?.phone && (
            <a
              href={`https://wa.me/55${transaction.customer.phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 font-medium"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Suporte via WhatsApp</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
