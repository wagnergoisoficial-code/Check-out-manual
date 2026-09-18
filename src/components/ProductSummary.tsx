import React from "react";
import { Check, ShieldAlert, Sparkles, ShieldCheck } from "lucide-react";

interface ProductSummaryProps {
  price?: number;
}

export const ProductSummary: React.FC<ProductSummaryProps> = ({ price = 39.9 }) => {
  const items = [
    "calculadora de água e comida",
    "mapa de riscos da casa",
    "protocolos e checklists",
    "manual em PDF",
  ];

  return (
    <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full text-amber-400 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Acesso Imediato + Bônus Incluso</span>
        </div>

        <h1 className="text-base sm:text-lg font-bold text-white leading-snug">
          Plataforma Método 5P
          <span className="block text-xs sm:text-sm font-normal text-slate-300">
            workbook interativo de preparação familiar
          </span>
        </h1>

        <p className="text-xs text-amber-300 font-medium">
          + Bônus: Manual Completo de Sobrevivência Apocalíptica (PDF)
        </p>
      </div>

      {/* Os 4 itens exatos solicitados */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
          O que você recebe:
        </span>
        <ul className="space-y-1.5 text-xs text-slate-200">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-emerald-950 border border-emerald-700/60 flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5 text-emerald-400" />
              </div>
              <span className="capitalize">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Preço em destaque e Selo de Garantia */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
        <div>
          <span className="text-[11px] text-slate-400 block leading-tight">Valor total da oferta:</span>
          <div className="flex items-baseline gap-1">
            <span className="text-xs text-slate-400 font-bold">R$</span>
            <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">39,90</span>
            <span className="text-[11px] text-emerald-400 font-semibold ml-1">pagamento único</span>
          </div>
        </div>

        {/* Selo de Garantia 7 dias */}
        <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-700/60 px-3 py-2 rounded-xl text-right">
          <ShieldCheck className="w-6 h-6 text-amber-400 shrink-0" />
          <div className="text-left">
            <span className="text-[11px] font-bold text-white block leading-tight">Garantia de 7 dias</span>
            <span className="text-[9px] text-slate-400 block leading-tight">Reembolso integral</span>
          </div>
        </div>
      </div>
    </section>
  );
};
