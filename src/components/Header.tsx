import React from "react";
import { Lock, ShieldCheck } from "lucide-react";

export const Header: React.FC = () => {
  return (
    <header className="w-full bg-[#020617] border-b border-slate-800/80 sticky top-0 z-30 backdrop-blur-md">
      <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Identificação do Produto */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-black text-sm">
            5P
          </div>
          <div>
            <span className="font-extrabold text-sm tracking-wide text-white block leading-none">
              MÉTODO 5P
            </span>
            <span className="text-[10px] text-slate-400 font-medium block">
              Preparação Familiar
            </span>
          </div>
        </div>

        {/* Indicador de Pagamento Seguro (Sem nenhum link de saída) */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 border border-emerald-900/60 text-emerald-400 px-2.5 py-1 rounded-full text-xs font-semibold select-none">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span>Pagamento seguro</span>
        </div>
      </div>
    </header>
  );
};
