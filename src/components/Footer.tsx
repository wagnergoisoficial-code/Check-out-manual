import React from "react";
import { ShieldCheck, Mail, MapPin, HelpCircle } from "lucide-react";

interface FooterProps {
  onOpenTerms: () => void;
  onOpenPrivacy: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenTerms, onOpenPrivacy }) => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/90 text-slate-400 text-xs mt-8 py-8">
      <div className="max-w-xl mx-auto px-4 space-y-5">
        {/* Como pedir reembolso */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
          <div className="flex items-center gap-1.5 text-slate-200 font-semibold text-xs">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>Como solicitar o reembolso de 7 dias?</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Se por qualquer motivo você não ficar satisfeito nos primeiros 7 dias após a compra, basta
            enviar um e-mail para <strong className="text-slate-300">suporte@appmanualcompleto.com</strong>.
            Devolvemos 100% do valor pago, sem burocracia ou questionamentos.
          </p>
        </div>

        {/* Dados da Empresa / Vendedor (Decreto 7.962/2013) */}
        <div className="space-y-1 text-[11px] text-slate-400 leading-relaxed">
          <div className="font-semibold text-slate-300">
            Wagner Góis — Treinamentos e Publicações Digitais
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>CNPJ: 45.210.892/0001-34</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-500" />
              Av. Paulista, 1106, Bela Vista — São Paulo / SP — CEP 01310-100
            </span>
          </div>
          <div className="flex items-center gap-1 text-slate-400 pt-0.5">
            <Mail className="w-3 h-3 text-slate-500" />
            <span>Contato de Suporte: suporte@appmanualcompleto.com</span>
          </div>
        </div>

        {/* Links Legais (Abrem modal in-page, sem tirar da página) */}
        <div className="pt-3 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-3 text-[11px]">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onOpenTerms}
              className="text-slate-400 hover:text-amber-400 underline transition-colors cursor-pointer"
            >
              Termos de Uso
            </button>
            <button
              type="button"
              onClick={onOpenPrivacy}
              className="text-slate-400 hover:text-amber-400 underline transition-colors cursor-pointer"
            >
              Política de Privacidade
            </button>
          </div>
          <div className="text-[10px] text-slate-400">
            © {new Date().getFullYear()} Método 5P. Todos os direitos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
};
