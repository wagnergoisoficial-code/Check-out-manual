import React, { useState } from "react";
import { 
  ShieldAlert, 
  ShieldCheck, 
  BookOpen, 
  Compass, 
  MapPin, 
  MessageSquare, 
  Lock, 
  CheckCircle2, 
  Flame, 
  Radio
} from "lucide-react";

export const VisualBundleHero: React.FC = () => {
  // Caminhos onde a imagem enviada pode ser encontrada
  const imageSources = [
    "/images/capa-checkout.png",
    "/4A8B5148-1C64-4B56-8AC5-40FA956851AE.png",
    "/images/4A8B5148-1C64-4B56-8AC5-40FA956851AE.png",
    "/assets/4A8B5148-1C64-4B56-8AC5-40FA956851AE.png",
  ];

  const [currentSrcIndex, setCurrentSrcIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleImageError = () => {
    if (currentSrcIndex < imageSources.length - 1) {
      setCurrentSrcIndex((prev) => prev + 1);
    } else {
      setHasError(true);
    }
  };

  return (
    <div className="relative w-full rounded-2xl bg-gradient-to-b from-slate-950 via-[#0a0f1d] to-black border border-amber-500/40 p-3 sm:p-5 shadow-2xl overflow-hidden text-center select-none space-y-4">
      {/* Background glow & sutil grade tática */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:12px_12px] opacity-20 pointer-events-none" />

      {/* TENTATIVA 1: RENDERIZAÇÃO DIRETA DA IMAGEM OFICIAL ENVIADA */}
      {!hasError && (
        <div className="relative z-10 w-full overflow-hidden rounded-xl border border-amber-500/30 shadow-2xl bg-black">
          <img
            src={imageSources[currentSrcIndex]}
            alt="Plataforma + Ebook: Manual Completo de Sobrevivência Apocalíptica - Wagner Góis"
            className={`w-full h-auto object-cover max-h-[580px] sm:max-h-[640px] mx-auto transition-opacity duration-300 ${
              imageLoaded ? "opacity-100" : "opacity-0 absolute inset-0"
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={handleImageError}
            loading="eager"
          />
        </div>
      )}

      {/* TENTATIVA 2: COMPOSIÇÃO VETORIAL RETINA IDÊNTICA AO PÔSTER (FALLBACK ELEGANTE) */}
      {(hasError || !imageLoaded) && (
        <div className="relative z-10 space-y-4">
          {/* Escudo no topo */}
          <div className="flex justify-center pt-1">
            <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/40 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
            </div>
          </div>

          {/* Título Principal: PLATAFORMA + EBOOK */}
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight font-sans drop-shadow-md">
              PLATAFORMA
            </h1>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl sm:text-3xl font-black text-amber-400">+</span>
              <span className="text-3xl sm:text-4xl font-black text-amber-400 uppercase tracking-tight drop-shadow-md">
                EBOOK
              </span>
            </div>
            <p className="text-[10px] sm:text-xs font-bold text-slate-300 tracking-wider uppercase max-w-sm mx-auto pt-1 leading-snug font-mono">
              TODO O CONHECIMENTO E AS FERRAMENTAS QUE SUA FAMÍLIA PRECISA PARA{" "}
              <span className="text-amber-400 font-black">SOBREVIVER E PROSPERAR</span>.
            </p>
          </div>

          {/* COMPOSIÇÃO 3D REALISTA: SMARTPHONE (ESQUERDA) + LIVRO (DIREITA) */}
          <div className="relative flex items-center justify-center pt-2 pb-2">
            <div className="relative flex items-center justify-center w-full max-w-[340px] sm:max-w-[420px]">
              
              {/* SMARTPHONE RETINA (PLATAFORMA SOFTER / MÉTODO 5P) */}
              <div className="relative z-20 w-[145px] sm:w-[170px] bg-slate-950 rounded-[28px] p-2 border-2 border-slate-700 shadow-2xl shadow-black rotate-[-3deg] hover:rotate-0 transition-transform duration-500">
                <div className="w-12 h-2.5 bg-slate-900 rounded-full mx-auto mb-1 flex items-center justify-center">
                  <div className="w-2 h-0.5 bg-slate-700 rounded-full" />
                </div>

                <div className="bg-[#030712] rounded-[20px] p-2 text-slate-100 text-[8px] space-y-1.5 border border-slate-800 text-left">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-800/80">
                    <div className="flex items-center gap-1">
                      <ShieldAlert className="w-2.5 h-2.5 text-amber-400" />
                      <span className="font-mono text-[7px] text-slate-300">MÉTODO 5P • WAGNER GÓIS</span>
                    </div>
                    <span className="text-[6px] text-slate-400 font-mono">9:41</span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[6px] uppercase tracking-wider text-slate-400 block">BEM-VINDO À</span>
                    <span className="text-[10px] font-black text-amber-400 block tracking-tight leading-none">
                      PLATAFORMA SOFTER
                    </span>
                  </div>

                  <div className="bg-slate-900/90 rounded-lg p-1.5 border border-slate-800 space-y-1">
                    <div className="text-[6px] text-amber-400 font-bold uppercase tracking-tight">
                      SEGUNDA EDIÇÃO • REVISADA E AMPLIADA
                    </div>
                    <div className="text-[8px] font-black text-white leading-tight uppercase">
                      MANUAL COMPLETO DE SOBREVIVÊNCIA APOCALÍPTICA
                    </div>
                    <p className="text-[6px] text-slate-400 leading-tight">
                      Acesse todas as ferramentas do Método 5P para proteger sua família quando tudo falhar.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-1 text-[6px] text-center font-bold">
                    <div className="bg-slate-900/80 p-1 rounded border border-slate-800/80 flex flex-col items-center justify-center">
                      <Compass className="w-2.5 h-2.5 text-amber-400 mb-0.5" />
                      <span className="text-slate-300 leading-tight">GUIA PRÁTICO</span>
                    </div>
                    <div className="bg-slate-900/80 p-1 rounded border border-slate-800/80 flex flex-col items-center justify-center">
                      <CheckCircle2 className="w-2.5 h-2.5 text-amber-400 mb-0.5" />
                      <span className="text-slate-300 leading-tight">ESTRATÉGIAS</span>
                    </div>
                    <div className="bg-slate-900/80 p-1 rounded border border-slate-800/80 flex flex-col items-center justify-center">
                      <ShieldCheck className="w-2.5 h-2.5 text-amber-400 mb-0.5" />
                      <span className="text-slate-300 leading-tight">FERRAMENTAS</span>
                    </div>
                    <div className="bg-slate-900/80 p-1 rounded border border-slate-800/80 flex flex-col items-center justify-center">
                      <Flame className="w-2.5 h-2.5 text-amber-400 mb-0.5" />
                      <span className="text-slate-300 leading-tight">EMERGÊNCIA</span>
                    </div>
                    <div className="bg-slate-900/80 p-1 rounded border border-slate-800/80 flex flex-col items-center justify-center">
                      <MapPin className="w-2.5 h-2.5 text-amber-400 mb-0.5" />
                      <span className="text-slate-300 leading-tight">MAPA RISCOS</span>
                    </div>
                    <div className="bg-slate-900/80 p-1 rounded border border-slate-800/80 flex flex-col items-center justify-center">
                      <Radio className="w-2.5 h-2.5 text-amber-400 mb-0.5" />
                      <span className="text-slate-300 leading-tight">COMUNICAÇÃO</span>
                    </div>
                  </div>

                  <div className="w-full bg-amber-500 rounded py-1 text-center flex items-center justify-center gap-1 font-black text-[7px] text-slate-950 uppercase tracking-wide">
                    <Lock className="w-2 h-2 text-slate-950" />
                    <span>ACESSO SEGURO E VITALÍCIO</span>
                  </div>
                </div>
              </div>

              {/* O LIVRO FÍSICO 3D (MANUAL DE SOBREVIVÊNCIA) */}
              <div className="relative -ml-6 sm:-ml-8 z-10 w-[180px] sm:w-[215px] h-[270px] sm:h-[310px] transform rotate-[3deg] hover:rotate-0 transition-transform duration-500">
                <div className="absolute -bottom-3 left-4 right-0 h-5 bg-black/90 blur-md rounded-full" />

                <div className="absolute top-1 -left-3.5 w-4 h-[264px] sm:h-[304px] bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/90 rounded-l-sm border-l border-y border-amber-500/40 transform skew-y-[6deg] flex flex-col justify-between py-3 items-center">
                  <span className="text-[6px] text-amber-400 font-mono tracking-widest font-black uppercase [writing-mode:vertical-rl] rotate-180 opacity-90">
                    MANUAL DE SOBREVIVÊNCIA
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span className="text-[5px] text-slate-400 font-mono [writing-mode:vertical-rl] rotate-180">
                    WAGNER GÓIS
                  </span>
                </div>

                <div className="absolute top-2 -right-2 w-2 h-[262px] sm:h-[302px] bg-gradient-to-l from-[#e2e8f0] via-[#cbd5e1] to-[#94a3b8] rounded-r-xs border-r border-slate-600/80 shadow-inner" />
                <div className="absolute -bottom-2 left-1 right-0 h-2 bg-gradient-to-t from-[#cbd5e1] to-[#94a3b8] rounded-b-xs border-b border-slate-600/70" />

                <div className="relative w-full h-full rounded-r-md rounded-l-xs bg-[#090d16] border border-amber-500/50 shadow-2xl overflow-hidden flex flex-col justify-between p-3 sm:p-4 text-center">
                  <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-[#18120c] to-black opacity-90 pointer-events-none" />
                  <div className="absolute bottom-10 left-0 right-0 h-24 bg-gradient-to-t from-amber-600/20 via-amber-500/10 to-transparent pointer-events-none" />

                  <div className="relative z-10 space-y-0.5">
                    <div className="inline-block bg-amber-500/20 border border-amber-500/40 px-1.5 py-0.2 rounded text-[6px] sm:text-[7px] font-bold text-amber-300 uppercase tracking-wider">
                      SEGUNDA EDIÇÃO • REVISADA E AMPLIADA
                    </div>
                    <div className="pt-1">
                      <span className="block text-[8px] font-bold text-slate-300 uppercase tracking-widest font-mono">
                        MANUAL COMPLETO DE
                      </span>
                      <div className="text-[11px] sm:text-[13px] font-black text-amber-400 leading-tight uppercase font-sans tracking-tight drop-shadow">
                        SOBREVIVÊNCIA APOCALÍPTICA
                      </div>
                    </div>
                    <p className="text-[6px] text-slate-300 leading-tight pt-0.5 font-medium">
                      ESTRATÉGIAS REAIS PARA PROTEGER SUA FAMÍLIA QUANDO TUDO FALHAR
                    </p>
                  </div>

                  <div className="relative z-10 my-auto py-1 flex flex-col items-center justify-center">
                    <div className="relative w-16 h-16 rounded-full bg-gradient-to-t from-amber-500/30 to-slate-900 border border-amber-500/40 flex items-center justify-center overflow-hidden">
                      <div className="absolute bottom-0 w-8 h-10 bg-slate-950 rounded-t-full border border-amber-500/40 flex flex-col items-center pt-1">
                        <div className="w-3 h-3 rounded-full bg-slate-800" />
                        <div className="w-5 h-5 bg-amber-950/80 rounded mt-0.5" />
                      </div>
                      <div className="absolute bottom-2 right-3 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
                    </div>

                    <div className="mt-1 bg-black/80 border border-amber-500/50 rounded-full px-2 py-0.5 text-[6px] text-amber-300 font-bold tracking-tight">
                      ★ GUIA PRÁTICO PASSO A PASSO ★
                    </div>
                  </div>

                  <div className="relative z-10 pt-1.5 border-t border-slate-800 flex items-center justify-between text-left">
                    <div>
                      <span className="text-[6px] text-slate-400 block font-mono uppercase">AUTOR</span>
                      <span className="text-[9px] font-black text-white uppercase tracking-wider block">
                        WAGNER GÓIS
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[6px] text-emerald-400 font-bold block">✓ BÔNUS INCLUSO</span>
                      <span className="text-[6px] text-slate-400 font-mono">380 PÁGINAS</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BARRA DE 6 ÍCONES DE BENEFÍCIOS */}
          <div className="pt-2 border-t border-slate-800/80">
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-[9px]">
              <div className="flex flex-col items-center gap-1 p-1 bg-slate-950/60 rounded-lg border border-slate-800/60">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-bold text-slate-200 uppercase leading-tight text-[8px]">
                  ESTRATÉGIAS COMPROVADAS
                </span>
              </div>

              <div className="flex flex-col items-center gap-1 p-1 bg-slate-950/60 rounded-lg border border-slate-800/60">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-bold text-slate-200 uppercase leading-tight text-[8px]">
                  CONTEÚDO COMPLETO
                </span>
              </div>

              <div className="flex flex-col items-center gap-1 p-1 bg-slate-950/60 rounded-lg border border-slate-800/60">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-bold text-slate-200 uppercase leading-tight text-[8px]">
                  FERRAMENTAS ESSENCIAIS
                </span>
              </div>

              <div className="flex flex-col items-center gap-1 p-1 bg-slate-950/60 rounded-lg border border-slate-800/60">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-bold text-slate-200 uppercase leading-tight text-[8px]">
                  MAPEAMENTO DE RISCOS
                </span>
              </div>

              <div className="flex flex-col items-center gap-1 p-1 bg-slate-950/60 rounded-lg border border-slate-800/60">
                <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-bold text-slate-200 uppercase leading-tight text-[8px]">
                  COMUNICAÇÃO EFICIENTE
                </span>
              </div>

              <div className="flex flex-col items-center gap-1 p-1 bg-slate-950/60 rounded-lg border border-slate-800/60">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-bold text-slate-200 uppercase leading-tight text-[8px]">
                  ACESSO VITALÍCIO
                </span>
              </div>
            </div>

            <p className="pt-3 text-[10px] sm:text-[11px] font-black tracking-widest text-slate-300 uppercase font-mono">
              PREPARE-SE HOJE. <span className="text-amber-400">PROTEJA QUEM VOCÊ AMA.</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
