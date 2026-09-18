import crypto from "crypto";

export interface UserAccess {
  email: string;
  name: string;
  status: "active" | "revoked";
  licenseKey: string;
  portalUrl: string;
  grantedAt: string;
  revokedAt?: string;
}

export interface AbandonedLead {
  name: string;
  email: string;
  phone: string;
  document: string;
  tracking: Record<string, unknown>;
  createdAt: string;
  recovered: boolean;
}

// Em produção, esses dados são gravados no Firestore / banco de dados relacional
const accessDb = new Map<string, UserAccess>();
const abandonedLeadsDb: AbandonedLead[] = [];

/**
 * Libera o acesso do aluno na Plataforma Método 5P
 * Cria credenciais, gera licença de acesso e simula envio do e-mail oficial
 */
export async function liberarAcesso(email: string, name: string): Promise<UserAccess> {
  const normalizedEmail = email.trim().toLowerCase();
  const licenseKey = `5P-${crypto.randomBytes(4).toString("hex").toUpperCase()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
  const portalUrl = "https://appmanualcompleto.com/workbook";

  const access: UserAccess = {
    email: normalizedEmail,
    name: name.trim(),
    status: "active",
    licenseKey,
    portalUrl,
    grantedAt: new Date().toISOString(),
  };

  accessDb.set(normalizedEmail, access);

  console.log(`[ACESSO LIBERADO] Aluno: ${name} <${normalizedEmail}> | Licença: ${licenseKey} | Portal: ${portalUrl}`);
  
  // Envio de e-mail transacional (SendGrid / Resend / Firebase Trigger Email)
  // Exemplo de payload enviado ao usuário:
  // "Assunto: Seu acesso à Plataforma Método 5P + Manual de Sobrevivência chegou!"
  // "Link: https://appmanualcompleto.com/workbook"
  // "Chave de ativação: " + licenseKey

  return access;
}

/**
 * Revoga o acesso em caso de estorno (refund) ou chargeback
 */
export async function revogarAcesso(email: string): Promise<boolean> {
  const normalizedEmail = email.trim().toLowerCase();
  const access = accessDb.get(normalizedEmail);
  if (access) {
    access.status = "revoked";
    access.revokedAt = new Date().toISOString();
    accessDb.set(normalizedEmail, access);
    console.warn(`[ACESSO REVOGADO] Aluno: <${normalizedEmail}> teve seu acesso cancelado por estorno/chargeback.`);
    return true;
  }
  console.warn(`[ACESSO REVOGADO] E-mail <${normalizedEmail}> não encontrado no cadastro.`);
  return false;
}

/**
 * Salva o lead em caso de abandono de carrinho (quando preenche dados e sai dos campos)
 */
export async function salvarLeadAbandonado(lead: {
  name: string;
  email: string;
  phone: string;
  document: string;
  tracking: Record<string, unknown>;
}): Promise<void> {
  if (!lead.email && !lead.phone) return;

  const existingIdx = abandonedLeadsDb.findIndex(
    (l) => l.email.toLowerCase() === lead.email.toLowerCase() && l.email !== ""
  );

  const newEntry: AbandonedLead = {
    name: lead.name || "",
    email: (lead.email || "").trim().toLowerCase(),
    phone: lead.phone || "",
    document: lead.document || "",
    tracking: lead.tracking || {},
    createdAt: new Date().toISOString(),
    recovered: false,
  };

  if (existingIdx >= 0) {
    abandonedLeadsDb[existingIdx] = newEntry;
  } else {
    abandonedLeadsDb.push(newEntry);
  }

  console.log(`[LEAD CAPTURADO PARA RECUPERAÇÃO] ${newEntry.name} - ${newEntry.email} - ${newEntry.phone}`);
}

export function getAccessByEmail(email: string): UserAccess | undefined {
  return accessDb.get(email.trim().toLowerCase());
}
