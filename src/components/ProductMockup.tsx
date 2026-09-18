import React, { useState } from "react";
import { Shield, Sparkles, Smartphone, BookOpen, CheckCircle2, Lock, Eye, Layers } from "lucide-react";

export const ProductMockup: React.FC = () => {
  const [viewMode, setViewMode] = useState<"combo" | "cover">("combo");

  return (
    <div className="relative w-full max-w-[360px] sm:max-w-[440px] mx-auto pt-1 pb-3 select-none">
      {/* Botões reais de alternância de visualização */}
      <div className="flex items-center justify-center gap-2 mb-3">
        <button
          type="button"
          id="btn-view-combo"
          onClick={() => setViewMode("combo")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
            viewMode === "combo"
              ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20"
              : "bg-slate-900/90 text-slate-300 border-slate-700 hover:border-slate-500"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Combo 3D (App + Livro)</span>
        </button>

        <button
          type="button"
          id="btn-view-cover"
          onClick={() => setViewMode("cover")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
            viewMode === "cover"
              ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20"
              : "bg-slate-900/90 text-slate-300 border-slate-700 hover:border-slate-500"
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Ver Capa em Alta Resolução</span>
        </button>
      </div>

      {/* ========================================================
          MODO 1: COMBO 3D (Livro Tático + Smartphone)
          ======================================================== */}
      {viewMode === "combo" && (
        <div className="relative flex items-center justify-center py-2 animate-fade-in">
          {/* Luz de fundo de estúdio */}
          <div className="absolute -top-4 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* 1. O LIVRO TÉCNICO 3D */}
          <div className="relative z-10 w-[205px] sm:w-[235px] h-[300px] sm:h-[340px] transform rotate-[3deg] hover:rotate-0 transition-transform duration-500 group">
            {/* Sombra realista projetada */}
            <div className="absolute -bottom-4 left-4 right-1 h-6 bg-black/85 blur-md rounded-full transform rotate-[-2deg]" />

            {/* Lombada lateral grossa (simulando 380 páginas) */}
            <div className="absolute top-1 -left-3.5 w-4 h-[294px] sm:h-[334px] bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/90 rounded-l-sm border-l border-y border-amber-500/40 transform skew-y-[6deg] flex flex-col justify-between py-4 items-center">
              <span className="text-[7px] text-amber-400 font-mono tracking-widest font-black uppercase [writing-mode:vertical-rl] rotate-180 opacity-90">
                MANUAL DE SOBREVIVÊNCIA
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="text-[6px] text-slate-400 font-mono [writing-mode:vertical-rl] rotate-180">
                WAGNER GÓIS
              </span>
            </div>

            {/* Páginas internas visíveis (corte de papel texturizado) */}
            <div className="absolute top-2 -right-2 w-2.5 h-[292px] sm:h-[332px] bg-gradient-to-l from-[#e2e8f0] via-[#cbd5e1] to-[#94a3b8] rounded-r-xs border-r border-slate-600/80 shadow-inner flex flex-col justify-around py-1 opacity-90">
              <div className="w-full h-full bg-[repeating-linear-gradient(to_bottom,#cbd5e1_0px,#cbd5e1_1px,#e2e8f0_1px,#e2e8f0_2px)] opacity-60" />
            </div>
            <div className="absolute -bottom-2 left-1 right-0 h-2.5 bg-gradient-to-t from-[#cbd5e1] to-[#94a3b8] rounded-b-xs border-b border-slate-600/70" />

            {/* Capa frontal do livro */}
            <div className="relative w-full h-full rounded-r-md rounded-l-xs bg-[#090d16] border border-amber-500/50 shadow-2xl overflow-hidden flex flex-col justify-between p-3.5 sm:p-4 text-center">
              {/* Textura tática em micro-grade */}
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:8px_8px] opacity-30 pointer-events-none" />
              
              {/* Faixas de alerta táticas no topo e rodapé */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-[repeating-linear-gradient(45deg,#f59e0b,#f59e0b_10px,#020617_10px,#020617_20px)]" />

              {/* Reflexo de luz na capa */}
              <div className="absolute top-1 left-0 right-0 h-32 bg-gradient-to-b from-white/10 via-white/5 to-transparent pointer-events-none" />

              {/* Cabeçalho */}
              <div className="relative z-10 space-y-1 pt-1">
                <div className="inline-flex items-center gap-1 bg-amber-500/20 border border-amber-500/50 px-2 py-0.5 rounded text-[7px] sm:text-[8px] font-black tracking-widest text-amber-300 uppercase">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>EDIÇÃO OFICIAL 2025</span>
                </div>
                
                <div className="pt-1">
                  <span className="block text-[8px] sm:text-[9px] font-extrabold text-slate-300 tracking-[0.2em] uppercase font-mono">
                    GUIA TÁTICO FAMILIAR
                  </span>
                  <h3 className="text-xs sm:text-[14px] font-black text-white tracking-tight leading-tight uppercase font-sans drop-shadow-md">
                    MANUAL COMPLETO DE
                  </h3>
                  <div className="mt-0.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 font-black text-[10px] sm:text-[12px] px-1.5 py-0.5 rounded tracking-tighter uppercase shadow-sm">
                    SOBREVIVÊNCIA APOCALÍPTICA
                  </div>
                </div>
              </div>

              {/* Brasão Tático Central */}
              <div className="relative z-10 my-auto py-1 flex flex-col items-center justify-center">
                <div className="relative w-16 sm:w-20 h-16 sm:h-20 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border border-amber-500/40 border-dashed animate-[spin_40s_linear_infinite]" />
                  <div className="absolute inset-1.5 rounded-full border border-amber-500/30" />
                  <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-full bg-gradient-to-br from-amber-950/70 to-slate-950 border border-amber-500/70 flex flex-col items-center justify-center shadow-lg">
                    <Shield className="w-6 sm:w-7 h-6 sm:h-7 text-amber-400 drop-shadow" />
                    <span className="text-[6px] text-amber-300 font-mono font-bold tracking-tighter">5P DEFESA</span>
                  </div>
                </div>

                <span className="text-[7px] sm:text-[8px] text-slate-300 font-medium tracking-wide block mt-1 max-w-[170px] leading-tight">
                  Protocolos de Autossuficiência, Reserva Hídrica e Defesa Familiar
                </span>
              </div>

              {/* Rodapé da Capa: Autor e ISBN */}
              <div className="relative z-10 pt-2 border-t border-slate-800/80 flex items-center justify-between text-left">
                <div>
                  <span className="text-[6px] sm:text-[7px] text-slate-400 block font-mono uppercase">Autor & Especialista</span>
                  <span className="text-[8px] sm:text-[9px] font-black text-white tracking-wider uppercase block">
                    Wagner Góis
                  </span>
                </div>

                <div className="flex flex-col items-end">
                  <div className="flex gap-0.5">
                    <div className="w-0.5 h-3 bg-amber-400" />
                    <div className="w-1 h-3 bg-white" />
                    <div className="w-0.5 h-3 bg-white" />
                    <div className="w-1.5 h-3 bg-amber-400" />
                    <div className="w-0.5 h-3 bg-white" />
                  </div>
                  <span className="text-[5px] text-slate-400 font-mono">ISBN 978-65-5P</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. O SMARTPHONE RETINA (Workbook 5P Interativo) */}
          <div className="relative -ml-16 sm:-ml-20 z-20 w-[140px] sm:w-[160px] bg-slate-950 rounded-[28px] p-2 border-2 border-slate-700 shadow-2xl shadow-black rotate-[-6deg] hover:rotate-0 transition-transform duration-500">
            {/* Notch superior */}
            <div className="w-12 h-2.5 bg-slate-900 rounded-full mx-auto mb-1 flex items-center justify-center">
              <div className="w-2 h-0.5 bg-slate-700 rounded-full" />
            </div>

            {/* Interface do Workbook */}
            <div className="bg-[#030712] rounded-[20px] p-2 text-slate-100 text-[8px] space-y-1.5 border border-slate-800">
              {/* Header do App */}
              <div className="flex items-center justify-between pb-1 border-b border-slate-800/80">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-black text-amber-400 tracking-wider text-[8px]">MÉTODO 5P</span>
                </div>
                <span className="text-[6px] bg-amber-500/20 text-amber-300 px-1 py-0.2 rounded font-mono font-bold">
                  PRO
                </span>
              </div>

              {/* Medidor de Prontidão Familiar */}
              <div className="bg-slate-900/90 rounded-lg p-1.5 border border-slate-800 space-y-1">
                <div className="flex justify-between text-[7px] text-slate-400">
                  <span>Prontidão Familiar</span>
                  <span className="text-emerald-400 font-black">94% PRONTO</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full w-[94%] rounded-full" />
                </div>
              </div>

              {/* Calculadoras Ativas */}
              <div className="grid grid-cols-2 gap-1 text-[7px]">
                <div className="bg-slate-900/90 p-1 rounded border border-slate-800 text-center">
                  <span className="text-slate-400 block text-[6px]">Água Reserva</span>
                  <span className="font-bold text-sky-400">1.200 Litros</span>
                </div>
                <div className="bg-slate-900/90 p-1 rounded border border-slate-800 text-center">
                  <span className="text-slate-400 block text-[6px]">Comida Estocada</span>
                  <span className="font-bold text-emerald-400">45 Dias</span>
                </div>
              </div>

              {/* Checklists */}
              <div className="space-y-0.5 pt-0.5">
                <div className="flex items-center gap-1 text-[7px] text-slate-300">
                  <CheckCircle2 className="w-2 h-2 text-emerald-400 shrink-0" />
                  <span className="truncate">Mapa de Riscos da Casa</span>
                </div>
                <div className="flex items-center gap-1 text-[7px] text-slate-300">
                  <CheckCircle2 className="w-2 h-2 text-emerald-400 shrink-0" />
                  <span className="truncate">Checklist de Crise 72h</span>
                </div>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 rounded p-1 text-center">
                <span className="text-[7px] font-bold text-amber-300 block">Workbook 100% Interativo</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODO 2: CAPA EXPANDIDA EM ALTA RESOLUÇÃO (Frontal)
          ======================================================== */}
      {viewMode === "cover" && (
        <div className="relative w-full max-w-[290px] sm:max-w-[320px] mx-auto bg-[#070b14] border-2 border-amber-500/60 rounded-xl p-5 shadow-2xl text-center space-y-3.5 animate-fade-in">
          {/* Tarja de advertência militar no topo */}
          <div className="h-1.5 w-full bg-[repeating-linear-gradient(45deg,#f59e0b,#f59e0b_10px,#020617_10px,#020617_20px)] rounded-t" />

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1 bg-amber-500/20 border border-amber-500/50 px-2.5 py-0.5 rounded text-[8px] font-black tracking-widest text-amber-300 uppercase">
              <Shield className="w-3 h-3" />
              <span>DOCUMENTO TÁTICO EXCLUSIVO</span>
            </div>
            
            <p className="text-[9px] font-bold text-slate-400 tracking-[0.2em] uppercase font-mono">
              PLANO DE RESILIÊNCIA FAMILIAR
            </p>

            <h2 className="text-base sm:text-lg font-black text-white leading-tight uppercase tracking-tight">
              MANUAL COMPLETO DE
            </h2>

            <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 font-black text-xs sm:text-sm px-2 py-1 rounded tracking-tight uppercase shadow-md">
              SOBREVIVÊNCIA APOCALÍPTICA
            </div>
          </div>

          {/* Emblema Tático Ampliado */}
          <div className="relative py-2 flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-950/80 to-slate-950 border-2 border-amber-500/80 flex flex-col items-center justify-center shadow-xl">
              <Shield className="w-10 h-10 text-amber-400" />
              <span className="text-[7px] text-amber-300 font-mono font-bold">5 PILARES</span>
            </div>

            {/* Os 5 Pilares discriminados na capa */}
            <div className="mt-3 grid grid-cols-1 gap-1 w-full text-left text-[9px] bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-200">
                <span className="text-amber-400 font-mono font-bold">01.</span>
                <span>Armazenamento de Água (3L/dia por pessoa)</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-200">
                <span className="text-amber-400 font-mono font-bold">02.</span>
                <span>Estoque de Alimentos Não Perecíveis (1 ano)</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-200">
                <span className="text-amber-400 font-mono font-bold">03.</span>
                <span>Mapa de Vulnerabilidades e Fortificação</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-200">
                <span className="text-amber-400 font-mono font-bold">04.</span>
                <span>Protocolos de Crise para as Primeiras 72h</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-200">
                <span className="text-amber-400 font-mono font-bold">05.</span>
                <span>Comunicação em Blecaute Geral</span>
              </div>
            </div>
          </div>

          {/* Assinatura do Autor */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-left">
            <div>
              <span className="text-[7px] text-slate-400 block font-mono uppercase">Elaborado por</span>
              <span className="text-[10px] font-black text-white tracking-wider uppercase block">
                Wagner Góis
              </span>
              <span className="text-[7px] text-amber-400 block">3ª Edição Revisada • Formato PDF</span>
            </div>

            <div className="text-right">
              <span className="text-[7px] text-emerald-400 font-mono font-bold block">✓ BÔNUS INCLUSO</span>
              <span className="text-[8px] text-slate-300 font-mono">380 Páginas</span>
            </div>
          </div>
        </div>
      )}

      {/* Selos de Formato e Entrega no Rodapé do Mockup */}
      <div className="mt-3 flex items-center justify-center gap-2 sm:gap-3 text-[10px] text-slate-300 flex-wrap">
        <div className="flex items-center gap-1 bg-slate-950/80 border border-slate-800 px-2.5 py-1 rounded-full">
          <BookOpen className="w-3 h-3 text-amber-400" />
          <span>Manual em PDF (Download imediato)</span>
        </div>
        <div className="flex items-center gap-1 bg-slate-950/80 border border-slate-800 px-2.5 py-1 rounded-full">
          <Smartphone className="w-3 h-3 text-emerald-400" />
          <span>App / Workbook Interativo</span>
        </div>
        <div className="flex items-center gap-1 bg-slate-950/80 border border-slate-800 px-2.5 py-1 rounded-full">
          <Lock className="w-3 h-3 text-slate-400" />
          <span>Acesso Imediato</span>
        </div>
      </div>
    </div>
  );
};
