// Gera o payload "copia e cola" Pix no padrão BR Code (EMV) + CRC16-CCITT.
// ponytail: valida apenas formato da chave (regex/tamanho); verificação real
// da titularidade só existe via API do banco — upgrade quando houver backend.

export type PixKeyType = "cpf" | "cnpj" | "email" | "telefone" | "aleatoria" | "desconhecida";

export function detectPixKeyType(raw: string): PixKeyType {
  const key = raw.trim();
  const digits = key.replace(/\D/g, "");
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(key)) return "aleatoria";
  if (/^\+?55\d{10,11}$/.test(key) || /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/.test(key)) return "telefone";
  if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(key)) return "email";
  if (digits.length === 11 && /^\d+$/.test(digits)) return "cpf";
  if (digits.length === 14 && /^\d+$/.test(digits)) return "cnpj";
  return "desconhecida";
}

/** Dígito verificador de CPF (módulo 11). Pega ~99% dos erros de digitação. */
export function cpfOk(digits: string): boolean {
  if (!/^\d{11}$/.test(digits) || /^(\d)\1{10}$/.test(digits)) return false;
  const n = digits.split("").map(Number);
  const check = (len: number) =>
    ((n.slice(0, len).reduce((sum, v, i) => sum + v * (len + 1 - i), 0) * 10) % 11) % 10 === n[len];
  return check(9) && check(10);
}

// ponytail: só CNPJ numérico; CNPJ alfanumérico (2026) quando houver demanda.
/** Dígito verificador de CNPJ numérico (módulo 11, pesos 5–2 e 6–2). */
export function cnpjOk(digits: string): boolean {
  if (!/^\d{14}$/.test(digits) || /^(\d)\1{13}$/.test(digits)) return false;
  const n = digits.split("").map(Number);
  const check = (len: number) => {
    let weight = len - 7; // 5 para o 1º dígito, 6 para o 2º
    const sum = n.slice(0, len).reduce((acc, v) => {
      acc += v * weight;
      weight = weight === 2 ? 9 : weight - 1;
      return acc;
    }, 0);
    const rest = sum % 11;
    return (rest < 2 ? 0 : 11 - rest) === n[len];
  };
  return check(12) && check(13);
}

export function validatePixKey(raw: string): string | null {
  const key = raw.trim();
  if (!key) return "Informe sua chave Pix.";
  const type = detectPixKeyType(key);
  if (type === "desconhecida")
    return "Chave inválida. Use CPF, CNPJ, e-mail, telefone com DDD ou chave aleatória.";
  if (type === "cpf" && !cpfOk(key.replace(/\D/g, ""))) return "CPF inválido — confira os 11 dígitos.";
  if (type === "cnpj" && !cnpjOk(key.replace(/\D/g, ""))) return "CNPJ inválido — confira os 14 dígitos.";
  if (type === "email" && key.length > 77) return "E-mail muito longo para o Pix (máx. 77 caracteres).";
  return null;
}

export function normalizePixKey(raw: string): string {
  const key = raw.trim();
  const type = detectPixKeyType(key);
  if (type === "telefone") {
    let digits = key.replace(/\D/g, "");
    if (!digits.startsWith("55")) digits = `55${digits}`;
    return `+${digits}`;
  }
  return key;
}

// Comprimento em BYTES, como o padrão EMV exige (não caracteres).
function tlv(id: string, value: string): string {
  return `${id}${String(new TextEncoder().encode(value).length).padStart(2, "0")}${value}`;
}

/** CRC16-CCITT-FALSE (init 0xFFFF, poli 0x1021) — exigido pelo padrão BR Code. */
export function crc16(str: string): string {
  let crc = 0xffff;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
    }
  }
  return (crc & 0xffff).toString(16).toUpperCase().padStart(4, "0");
}

export interface PixPayloadInput {
  key: string;
  name: string;
  city: string;
  amount?: number;
  txid?: string;
}

export function buildPixPayload({ key, name, city, amount, txid }: PixPayloadInput): string {
  const gui = tlv("00", "br.gov.bcb.pix") + tlv("01", normalizePixKey(key));
  const clean = (s: string) =>
    s
      .normalize("NFD")
      .replace(/[^\x00-\x7F]/g, "")
      .replace(/[^A-Za-z0-9 .'-]/g, "")
      .trim() || "RECEBEDOR";
  const base =
    tlv("00", "01") +
    tlv("26", gui) +
    tlv("52", "0000") +
    tlv("53", "986") +
    (amount && amount > 0 ? tlv("54", amount.toFixed(2)) : "") +
    tlv("58", "BR") +
    tlv("59", clean(name).toUpperCase().slice(0, 25)) +
    tlv("60", clean(city).toUpperCase().slice(0, 15)) +
    tlv("62", tlv("05", (txid ?? "PIXPLACA").replace(/[^A-Za-z0-9]/g, "").slice(0, 25) || "PIXPLACA")) +
    "6304";
  return base + crc16(base);
}

/** Self-check executável da lib (vetores canônicos). Nunca foi executado em produção. */
export function pixSelfCheck(): boolean {
  return (
    crc16("123456789") === "29B1" &&
    cpfOk("52998224725") &&
    cpfOk("11144477735") &&
    !cpfOk("11111111111") &&
    !cpfOk("52998224724") &&
    cnpjOk("11222333000181") &&
    cnpjOk("33000167000101") &&
    !cnpjOk("33000167000102") &&
    !cnpjOk("11111111111111")
  );
}

if (import.meta.env.DEV) {
  console.assert(pixSelfCheck(), "[pix] self-check da lib falhou");
}
