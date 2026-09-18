import React, { useState } from "react";
import { User, Mail, Phone, CreditCard, AlertCircle, Sparkles } from "lucide-react";
import { CustomerData, TrackingData } from "../types";

interface CustomerFormProps {
  data: CustomerData;
  onChange: (field: keyof CustomerData, value: string) => void;
  errors: Partial<Record<keyof CustomerData, string>>;
  onOpenPrivacy: () => void;
  tracking: TrackingData;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({
  data,
  onChange,
  errors,
  onOpenPrivacy,
  tracking,
}) => {
  const [emailSuggestion, setEmailSuggestion] = useState<string | null>(null);

  // Máscara para WhatsApp
  const formatPhone = (val: string) => {
    const raw = val.replace(/\D/g, "").slice(0, 11);
    if (raw.length <= 2) return raw;
    if (raw.length <= 7) return `(${raw.slice(0, 2)}) ${raw.slice(2)}`;
    return `(${raw.slice(0, 2)}) ${raw.slice(2, 7)}-${raw.slice(7)}`;
  };

  // Máscara para CPF
  const formatCpf = (val: string) => {
    const raw = val.replace(/\D/g, "").slice(0, 11);
    if (raw.length <= 3) return raw;
    if (raw.length <= 6) return `${raw.slice(0, 3)}.${raw.slice(3)}`;
    if (raw.length <= 9) return `${raw.slice(0, 3)}.${raw.slice(3, 6)}.${raw.slice(6)}`;
    return `${raw.slice(0, 3)}.${raw.slice(3, 6)}.${raw.slice(6, 9)}-${raw.slice(9)}`;
  };

  // Verificação de erro de digitação comum em domínios de e-mail
  const checkEmailTypo = (emailVal: string) => {
    const email = emailVal.trim().toLowerCase();
    const parts = email.split("@");
    if (parts.length !== 2) {
      setEmailSuggestion(null);
      return;
    }

    const [user, domain] = parts;
    const commonTypos: Record<string, string> = {
      "gmial.com": "gmail.com",
      "gmai.com": "gmail.com",
      "gamil.com": "gmail.com",
      "gmail.com.br": "gmail.com",
      "hotmial.com": "hotmail.com",
      "hotmai.com": "hotmail.com",
      "hotmil.com": "hotmail.com",
      "outlok.com": "outlook.com",
      "outloo.com": "outlook.com",
      "yaho.com": "yahoo.com",
      "yahoo.com.br": "yahoo.com.br",
    };

    if (commonTypos[domain]) {
      setEmailSuggestion(`${user}@${commonTypos[domain]}`);
    } else {
      setEmailSuggestion(null);
    }
  };

  // Salvar lead abandonado ao sair de qualquer campo (onBlur)
  const handleBlurField = async () => {
    if (data.email || data.phone || data.name) {
      try {
        await fetch("/api/lead/abandoned", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            phone: data.phone,
            document: data.document,
            tracking,
          }),
        });
      } catch (err) {
        // silencioso
      }
    }
  };

  const applyEmailSuggestion = () => {
    if (emailSuggestion) {
      onChange("email", emailSuggestion);
      setEmailSuggestion(null);
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
      <div className="border-b border-slate-800/80 pb-2">
        <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center">
            1
          </span>
          Dados para Acesso e Envio
        </h2>
        <p className="text-[11px] text-slate-400 mt-0.5">
          O acesso ao workbook e ao manual será enviado para o e-mail informado abaixo.
        </p>
      </div>

      <div className="space-y-3.5">
        {/* Nome Completo */}
        <div>
          <label htmlFor="customer-name" className="block text-xs font-semibold text-slate-300 mb-1">
            Nome Completo
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <User className="w-4 h-4" />
            </div>
            <input
              id="customer-name"
              type="text"
              name="name"
              autoComplete="name"
              placeholder="Ex: Carlos Silva"
              value={data.name}
              onChange={(e) => onChange("name", e.target.value)}
              onBlur={handleBlurField}
              className={`w-full pl-9 pr-3 py-2.5 bg-slate-950/80 border rounded-xl text-white placeholder-slate-500 text-[16px] focus:outline-none focus:ring-2 transition-all ${
                errors.name
                  ? "border-rose-500/80 focus:ring-rose-500/30"
                  : "border-slate-800 focus:border-amber-500/60 focus:ring-amber-500/20"
              }`}
            />
          </div>
          {errors.name && (
            <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3 h-3" /> {errors.name}
            </p>
          )}
        </div>

        {/* E-mail */}
        <div>
          <label htmlFor="customer-email" className="block text-xs font-semibold text-slate-300 mb-1">
            Seu Melhor E-mail (para envio do acesso imediato)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="customer-email"
              type="email"
              name="email"
              inputMode="email"
              autoComplete="email"
              placeholder="Ex: carlos@gmail.com"
              value={data.email}
              onChange={(e) => {
                onChange("email", e.target.value);
                checkEmailTypo(e.target.value);
              }}
              onBlur={() => {
                checkEmailTypo(data.email);
                handleBlurField();
              }}
              className={`w-full pl-9 pr-3 py-2.5 bg-slate-950/80 border rounded-xl text-white placeholder-slate-500 text-[16px] focus:outline-none focus:ring-2 transition-all ${
                errors.email
                  ? "border-rose-500/80 focus:ring-rose-500/30"
                  : "border-slate-800 focus:border-amber-500/60 focus:ring-amber-500/20"
              }`}
            />
          </div>

          {/* Sugestão de correção em caso de erro comum */}
          {emailSuggestion && (
            <button
              type="button"
              onClick={applyEmailSuggestion}
              className="mt-1.5 inline-flex items-center gap-1.5 text-xs bg-amber-500/10 border border-amber-500/30 text-amber-300 px-2.5 py-1 rounded-lg hover:bg-amber-500/20 transition-colors text-left"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>
                Você quis dizer <strong className="underline">{emailSuggestion}</strong>? Clique para corrigir.
              </span>
            </button>
          )}

          {errors.email && (
            <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3 h-3" /> {errors.email}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* WhatsApp para suporte */}
          <div>
            <label htmlFor="customer-phone" className="block text-xs font-semibold text-slate-300 mb-1">
              WhatsApp (para suporte imediato)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Phone className="w-4 h-4" />
              </div>
              <input
                id="customer-phone"
                type="tel"
                name="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="(11) 99999-9999"
                value={data.phone}
                onChange={(e) => onChange("phone", formatPhone(e.target.value))}
                onBlur={handleBlurField}
                className={`w-full pl-9 pr-3 py-2.5 bg-slate-950/80 border rounded-xl text-white placeholder-slate-500 text-[16px] focus:outline-none focus:ring-2 transition-all ${
                  errors.phone
                    ? "border-rose-500/80 focus:ring-rose-500/30"
                    : "border-slate-800 focus:border-amber-500/60 focus:ring-amber-500/20"
                }`}
              />
            </div>
            {errors.phone && (
              <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3" /> {errors.phone}
              </p>
            )}
          </div>

          {/* CPF (Necessário para emissão do PIX e Cartão no Mercado Pago) */}
          <div>
            <label htmlFor="customer-cpf" className="block text-xs font-semibold text-slate-300 mb-1">
              CPF (exigência do Banco Central para emissão do Pix)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <CreditCard className="w-4 h-4" />
              </div>
              <input
                id="customer-cpf"
                type="text"
                name="cpf"
                inputMode="numeric"
                autoComplete="off"
                placeholder="000.000.000-00"
                value={data.document}
                onChange={(e) => onChange("document", formatCpf(e.target.value))}
                onBlur={handleBlurField}
                className={`w-full pl-9 pr-3 py-2.5 bg-slate-950/80 border rounded-xl text-white placeholder-slate-500 text-[16px] focus:outline-none focus:ring-2 transition-all ${
                  errors.document
                    ? "border-rose-500/80 focus:ring-rose-500/30"
                    : "border-slate-800 focus:border-amber-500/60 focus:ring-amber-500/20"
                }`}
              />
            </div>
            {errors.document && (
              <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3" /> {errors.document}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Aviso LGPD sem link de saída externo */}
      <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
        <span>Seus dados estão protegidos sob a LGPD (Lei 13.709/2018).</span>
        <button
          type="button"
          onClick={onOpenPrivacy}
          className="text-amber-400/90 hover:text-amber-300 underline font-medium cursor-pointer"
        >
          Ver Política
        </button>
      </div>
    </div>
  );
};
