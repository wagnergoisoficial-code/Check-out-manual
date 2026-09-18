import React from "react";
import { X, Shield, FileText } from "lucide-react";

interface LegalModalsProps {
  modalType: "terms" | "privacy" | null;
  onClose: () => void;
}

export const LegalModals: React.FC<LegalModalsProps> = ({ modalType, onClose }) => {
  if (!modalType) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-fade-in">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {modalType === "terms" ? (
              <FileText className="w-5 h-5 text-amber-400" />
            ) : (
              <Shield className="w-5 h-5 text-amber-400" />
            )}
            <h3 className="text-sm sm:text-base font-bold text-white">
              {modalType === "terms" ? "Termos de Uso e Adesão" : "Política de Privacidade (LGPD)"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed">
          {modalType === "terms" ? (
            <>
              <p>
                <strong>1. Objeto:</strong> O presente termo regula a contratação da licença de uso da
                Plataforma Método 5P (workbook interativo de preparação familiar) e o bônus do Manual
                Completo de Sobrevivência Apocalíptica em formato digital (PDF).
              </p>
              <p>
                <strong>2. Forma de Pagamento e Acesso:</strong> O valor da licença única é de R$ 39,90.
                A liberação do acesso é imediata após a confirmação do pagamento via Pix ou Cartão de
                Crédito pelo Mercado Pago, sendo as credenciais enviadas para o e-mail informado no
                cadastro.
              </p>
              <p>
                <strong>3. Direito de Arrependimento e Garantia:</strong> Conforme o Art. 49 do Código de
                Defesa do Consumidor e Decreto 7.962/2013, o contratante poderá solicitar o reembolso
                integral dentro do prazo incondicional de 7 (sete) dias corridos a partir da compra,
                através do e-mail oficial: suporte@appmanualcompleto.com.
              </p>
              <p>
                <strong>4. Propriedade Intelectual:</strong> O conteúdo técnico, checklists, calculadoras
                e manuais são de autoria e titularidade do autor, sendo vedada a reprodução ou
                redistribuição comercial não autorizada.
              </p>
            </>
          ) : (
            <>
              <p>
                <strong>1. Conformidade com a LGPD:</strong> Em estrito cumprimento à Lei Geral de Proteção
                de Dados (Lei nº 13.709/2018), seus dados pessoais (nome, e-mail, telefone e CPF) são
                coletados com a finalidade exclusiva de:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Emissão das credenciais de acesso e nota fiscal;</li>
                <li>Processamento seguro do pagamento junto ao Mercado Pago;</li>
                <li>Prestar suporte ao cliente via WhatsApp ou e-mail caso solicitado;</li>
                <li>Garantir a segurança contra fraudes bancárias.</li>
              </ul>
              <p>
                <strong>2. Segurança e Não Compartilhamento:</strong> Seus dados jamais serão vendidos ou
                compartilhados com terceiros alheios à operação do pagamento. Todas as conexões utilizam
                criptografia SSL/TLS de 256 bits.
              </p>
              <p>
                <strong>3. Seus Direitos:</strong> Você pode a qualquer momento solicitar a confirmação,
                atualização ou exclusão definitiva de seus dados cadastrais enviando solicitação para
                suporte@appmanualcompleto.com.
              </p>
            </>
          )}
        </div>

        <div className="p-3 border-t border-slate-800 text-center bg-slate-950">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
