import React, { useState, useEffect } from "react";
import { Copy, Check, QrCode, Clock, ShieldCheck, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { PaymentTransaction } from "../types";

interface PixScreenProps {
  transaction: PaymentTransaction;
  onSimulateApprove?: () => Promise<void>;
  onCancel?: () => void;
}

export const PixScreen: React.FC<PixScreenProps> = ({
  transaction,
  onSimulateApprove,
  onCancel,
}) => {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(1800); // 30 minutos em segundos
  const [isApproving, setIsApproving] = useState(false);

  // Contagem regressiva da validade real do Pix
  useEffect(() => {
    if (transaction.expirationDate) {
      const expTime = new Date(transaction.expirationDate).getTime();
      const now = Date.now();
      const diffSeconds = Math.max(0, Math.floor((expTime - now) / 1000));
      setTimeLeft(diffSeconds > 0 ? diffSeconds : 1800);
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [transaction.expirationDate]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const copyPixCode = () => {
    if (transaction.qrCode) {
      navigator.clipboard.writeText(transaction.qrCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleSimulate = async () => {
    if (onSimulateApprove) {
      setIsApproving(true);
      try {
        await onSimulateApprove();
      } finally {
        setIsApproving(false);
      }
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 shadow-2xl">
      {/* Topo do Pix */}
      <div className="text-center space-y-1.5 border-b border-slate-800 pb-4">
        <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full text-emerald-400 text-xs font-semibold">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Aguardando transferência Pix</span>
        </div>
        <h3 className="text-xl font-black text-white">
          Pix Gerado — R$ 39,90
        </h3>
        <p className="text-xs text-slate-300">
          Acesso à Plataforma Método 5P + Manual de Sobrevivência
        </p>

        {/* Timer de Validade */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-amber-400 font-mono font-medium pt-1">
          <Clock className="w-3.5 h-3.5" />
          <span>Código válido por: {formatTimer(timeLeft)}</span>
        </div>
      </div>

      {/* Regra de Ouro Mobile First: No celular o botão COPIAR CÓDIGO PIX fica ACIMA do QR Code */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={copyPixCode}
          className="w-full py-4 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-base sm:text-lg flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.99] transition-all cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-5 h-5 text-slate-950 stroke-[3]" />
              <span>Código Pix Copiado!</span>
            </>
          ) : (
            <>
              <Copy className="w-5 h-5 text-slate-950" />
              <span>Copiar código Pix</span>
            </>
          )}
        </button>

        {copied && (
          <p className="text-center text-xs text-emerald-400 font-medium animate-fade-in">
            Código copiado! Abra o aplicativo do seu banco e escolha "Pix Copia e Cola".
          </p>
        )}
      </div>

      {/* Exibição do QR Code para quem estiver no computador ou tablet */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-3">
        <div className="bg-white p-3 rounded-lg shadow-inner">
          {transaction.qrCodeBase64 ? (
            <img
              src={`data:image/png;base64,${transaction.qrCodeBase64}`}
              alt="QR Code Pix Mercado Pago"
              className="w-48 h-48 sm:w-52 sm:h-52 object-contain"
            />
          ) : (
            <div className="w-48 h-48 flex flex-col items-center justify-center bg-slate-100 rounded text-slate-800 text-xs p-2">
              <QrCode className="w-24 h-24 text-slate-800 mb-2" />
              <span className="font-mono text-[10px] break-all max-h-12 overflow-hidden">
                {transaction.qrCode ? transaction.qrCode.slice(0, 40) + "..." : "Carregando QR Code..."}
              </span>
            </div>
          )}
        </div>
        <span className="text-[11px] text-slate-400">
          Se estiver no computador, escaneie o QR Code acima com o app do seu banco.
        </span>
      </div>

      {/* Passo a Passo em 3 Linhas Exatas */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-2.5 text-xs text-slate-300">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          Como pagar em 3 passos simples:
        </span>
        <div className="flex items-start gap-2.5">
          <div className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
            1
          </div>
          <span>Abra o app do seu banco e escolha a opção <strong>Pix Copia e Cola</strong>.</span>
        </div>
        <div className="flex items-start gap-2.5">
          <div className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
            2
          </div>
          <span>Cole o código copiado acima e confirme o pagamento de <strong>R$ 39,90</strong>.</span>
        </div>
        <div className="flex items-start gap-2.5">
          <div className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
            3
          </div>
          <span>Aguarde nesta tela: o sistema identifica o pagamento sozinho em poucos segundos.</span>
        </div>
      </div>

      {/* Status da Detecção Automática */}
      <div className="flex items-center justify-center gap-2 text-xs text-slate-400 bg-slate-950/50 py-2 rounded-lg border border-slate-800/60">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span>Identificando transferência do Pix automaticamente...</span>
      </div>

      {/* Botão de teste para desenvolvimento/demonstração funcional */}
      {onSimulateApprove && (
        <div className="pt-2 border-t border-slate-800/80">
          <button
            type="button"
            onClick={handleSimulate}
            disabled={isApproving}
            className="w-full py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            {isApproving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span>Simular aprovação imediata do Pix (Ambiente de Teste)</span>
          </button>
        </div>
      )}

      {onCancel && (
        <div className="text-center">
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-slate-400 hover:text-slate-200 underline cursor-pointer"
          >
            Voltar e alterar forma de pagamento
          </button>
        </div>
      )}
    </div>
  );
};
