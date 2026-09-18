import React, { useState } from "react";
import { ChevronDown, HelpCircle, Mail, ShieldCheck, MessageCircle } from "lucide-react";

interface FaqItem {
  id: string;
  question: string;
  icon: React.ReactNode;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: "faq-acesso",
    question: "Como recebo meu acesso?",
    icon: <Mail className="w-4 h-4 text-amber-400 shrink-0" />,
    answer:
      "Imediatamente após a confirmação do pagamento, você recebe um e-mail com o link de acesso à plataforma interativa (Workbook Método 5P) e o link para download direto do Manual de Sobrevivência em PDF (380 páginas). Compras via Pix liberam o acesso em menos de 1 minuto.",
  },
  {
    id: "faq-garantia",
    question: "A garantia de 7 dias é incondicional?",
    icon: <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />,
    answer:
      "Sim, 100% incondicional. Você tem 7 dias corridos para explorar todo o workbook, testar as calculadoras de água e comida e ler o manual. Se por qualquer motivo achar que não valeu a pena, basta nos enviar um e-mail ou WhatsApp solicitando o reembolso e devolvemos 100% do seu dinheiro, sem burocracia.",
  },
  {
    id: "faq-suporte",
    question: "Posso pedir suporte no WhatsApp?",
    icon: <MessageCircle className="w-4 h-4 text-sky-400 shrink-0" />,
    answer:
      "Sim. Temos canal exclusivo de suporte via WhatsApp para alunos e compradores. Caso tenha qualquer dúvida sobre o acesso, uso das calculadoras ou protocolos familiares, nossa equipe de suporte está à disposição em dias úteis das 09h às 18h.",
  },
];

export const CheckoutFaq: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800/90 rounded-2xl p-4 sm:p-5 space-y-3.5 mt-4">
      <div className="flex items-center gap-2 pb-1 border-b border-slate-800/80">
        <HelpCircle className="w-4 h-4 text-amber-400" />
        <h3 className="text-xs sm:text-sm font-black text-slate-200 uppercase tracking-wide">
          Dúvidas Frequentes
        </h3>
      </div>

      <div className="space-y-2">
        {FAQ_ITEMS.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div
              key={item.id}
              className="bg-slate-950/70 border border-slate-800/80 rounded-xl overflow-hidden transition-colors"
            >
              <button
                type="button"
                id={`btn-${item.id}`}
                onClick={() => toggleItem(item.id)}
                aria-expanded={isOpen}
                className="w-full py-3 px-3.5 text-left flex items-center justify-between gap-2.5 hover:bg-slate-900/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span className="text-xs sm:text-[13px] font-bold text-slate-200 leading-snug">
                    {item.question}
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-amber-400" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-3.5 pb-3.5 pt-1 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 animate-fade-in">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
