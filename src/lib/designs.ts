export type Category = "minimalista" | "colorido" | "divertido" | "corporativo";

export type LayoutId =
  | "clean-center"
  | "top-banner"
  | "side-split"
  | "bottom-strip"
  | "circle-badge"
  | "ticket-notch"
  | "bold-frame"
  | "playful-shapes"
  | "dark-premium"
  | "receipt";

export interface Design {
  id: string;
  name: string;
  category: Category;
  layout: LayoutId;
  /** fundo da placa */
  bg: string;
  /** superfície do cartão do QR */
  surface: string;
  /** cor principal do texto */
  ink: string;
  /** texto secundário */
  sub: string;
  /** cor de destaque (editável) */
  accent: string;
  /** destaque secundário / faixa */
  accent2: string;
  /** fundo do QR (manter claro p/ leitura) */
  qrBg: string;
  qrFg: string;
}

export interface PlateData {
  pixKey: string;
  name: string;
  city: string;
  message: string;
  amountMode: "livre" | "fixo";
  amount: string;
  logoUrl: string | null;
  /** largura / altura da logo, medida no upload; null = tratar como quadrada */
  logoRatio: number | null;
  accentOverride: string | null;
  showMessage: boolean;
  showLogo: boolean;
}

export const DEFAULT_PLATE: PlateData = {
  pixKey: "",
  name: "Cantina Central",
  city: "São Paulo",
  message: "Escaneie o código para pagar.",
  amountMode: "livre",
  amount: "",
  logoUrl: null,
  logoRatio: null,
  accentOverride: null,
  showMessage: true,
  showLogo: true,
};

export const CATEGORY_LABEL: Record<Category, string> = {
  minimalista: "Minimalista",
  colorido: "Colorido",
  divertido: "Divertido",
  corporativo: "Corporativo",
};

export const DESIGNS: Design[] = [
  // ——— MINIMALISTA (8) ———
  { id: "branco-puro", name: "Branco Puro", category: "minimalista", layout: "clean-center", bg: "#F7F8F7", surface: "#FFFFFF", ink: "#1E2A28", sub: "#6B7B78", accent: "#12A594", accent2: "#E4F2EF", qrBg: "#FFFFFF", qrFg: "#14201D" },
  { id: "areia-suave", name: "Areia Suave", category: "minimalista", layout: "top-banner", bg: "#FAF6EF", surface: "#FFFFFF", ink: "#2E2A24", sub: "#8A8175", accent: "#C2703D", accent2: "#F3E6D2", qrBg: "#FFFFFF", qrFg: "#221C14" },
  { id: "cinza-grafite", name: "Grafite Light", category: "minimalista", layout: "side-split", bg: "#F1F3F4", surface: "#FFFFFF", ink: "#232A2E", sub: "#75828A", accent: "#3D4B53", accent2: "#E2E8EB", qrBg: "#FFFFFF", qrFg: "#1B2226" },
  { id: "verde-clarinho", name: "Verde Clarinho", category: "minimalista", layout: "bottom-strip", bg: "#EFFAF6", surface: "#FFFFFF", ink: "#14332B", sub: "#5E7F76", accent: "#12A594", accent2: "#CBEBE2", qrBg: "#FFFFFF", qrFg: "#10241F" },
  { id: "nuvem", name: "Nuvem", category: "minimalista", layout: "circle-badge", bg: "#F4F7FB", surface: "#FFFFFF", ink: "#22303E", sub: "#718091", accent: "#3B82C4", accent2: "#DDEAF7", qrBg: "#FFFFFF", qrFg: "#16222E" },
  { id: "palha", name: "Papel Kraft", category: "minimalista", layout: "receipt", bg: "#F5EEDF", surface: "#FFFDF6", ink: "#3A3126", sub: "#97876E", accent: "#8A6D3B", accent2: "#EADFC6", qrBg: "#FFFFFF", qrFg: "#241D11" },
  { id: "oliva", name: "Oliva Calmo", category: "minimalista", layout: "bold-frame", bg: "#F2F4EA", surface: "#FFFFFF", ink: "#2C3324", sub: "#75806A", accent: "#6B8E3E", accent2: "#DEE7CC", qrBg: "#FFFFFF", qrFg: "#202614" },
  { id: "rose-nude", name: "Rosé Nude", category: "minimalista", layout: "clean-center", bg: "#FBF3F1", surface: "#FFFFFF", ink: "#3A2A28", sub: "#967973", accent: "#C46A5E", accent2: "#F5DCD6", qrBg: "#FFFFFF", qrFg: "#2A1D1B" },

  // ——— COLORIDO (8) ———
  { id: "turquesa-pop", name: "Turquesa Pop", category: "colorido", layout: "top-banner", bg: "#12A594", surface: "#FFFFFF", ink: "#10302A", sub: "#4E7A72", accent: "#F97316", accent2: "#0C7C6F", qrBg: "#FFFFFF", qrFg: "#0F2420" },
  { id: "laranja-vibrante", name: "Laranja Vibrante", category: "colorido", layout: "bold-frame", bg: "#F97316", surface: "#FFF7ED", ink: "#431407", sub: "#9A6B4F", accent: "#0E9F8A", accent2: "#FDBA74", qrBg: "#FFFFFF", qrFg: "#2A1503" },
  { id: "roxo-energia", name: "Roxo Energia", category: "colorido", layout: "playful-shapes", bg: "#7C3AED", surface: "#FFFFFF", ink: "#241B3D", sub: "#6F6390", accent: "#FACC15", accent2: "#A78BFA", qrBg: "#FFFFFF", qrFg: "#1D1430" },
  { id: "rosa-chiclete", name: "Rosa Chiclete", category: "colorido", layout: "circle-badge", bg: "#EC4899", surface: "#FFFFFF", ink: "#3D1026", sub: "#96607E", accent: "#0E9F8A", accent2: "#F9A8D4", qrBg: "#FFFFFF", qrFg: "#2E0B1D" },
  { id: "azul-piscina", name: "Azul Piscina", category: "colorido", layout: "side-split", bg: "#0EA5E9", surface: "#FFFFFF", ink: "#0B2A3D", sub: "#4E7A94", accent: "#F97316", accent2: "#7DD3FC", qrBg: "#FFFFFF", qrFg: "#0A2233" },
  { id: "lima-festa", name: "Lima Festa", category: "colorido", layout: "bottom-strip", bg: "#A3E635", surface: "#1A2E05", ink: "#F7FEE7", sub: "#B8CBA0", accent: "#1A2E05", accent2: "#65A30D", qrBg: "#FFFFFF", qrFg: "#162605" },
  { id: "melancia", name: "Melancia", category: "colorido", layout: "clean-center", bg: "#F43F5E", surface: "#FFF1F2", ink: "#4C0519", sub: "#A26372", accent: "#15803D", accent2: "#FECDD3", qrBg: "#FFFFFF", qrFg: "#37060F" },
  { id: "arco-iris", name: "Arco-Íris", category: "colorido", layout: "top-banner", bg: "#FDE68A", surface: "#FFFFFF", ink: "#422006", sub: "#967246", accent: "#7C3AED", accent2: "#F59E0B", qrBg: "#FFFFFF", qrFg: "#231303" },

  // ——— DIVERTIDO (7) ———
  { id: "festa-junina", name: "Festa Junina", category: "divertido", layout: "playful-shapes", bg: "#FFF7E0", surface: "#FFFFFF", ink: "#422006", sub: "#9A7B4F", accent: "#DC2626", accent2: "#FBBF24", qrBg: "#FFFFFF", qrFg: "#2B1A05" },
  { id: "doceria", name: "Doceria", category: "divertido", layout: "circle-badge", bg: "#FCE7F3", surface: "#FFFFFF", ink: "#500F28", sub: "#A06E87", accent: "#DB2777", accent2: "#F9A8D4", qrBg: "#FFFFFF", qrFg: "#3A0A1D" },
  { id: "praia", name: "Praia", category: "divertido", layout: "bottom-strip", bg: "#CFFAFE", surface: "#FFFFFF", ink: "#164E63", sub: "#5B8A99", accent: "#F97316", accent2: "#67E8F9", qrBg: "#FFFFFF", qrFg: "#0C2E3A" },
  { id: "pipoca", name: "Cinema Pipoca", category: "divertido", layout: "ticket-notch", bg: "#DC2626", surface: "#FFF7E0", ink: "#450A0A", sub: "#A06A5A", accent: "#1E293B", accent2: "#FBBF24", qrBg: "#FFFFFF", qrFg: "#2B0808" },
  { id: "espaco-kids", name: "Espaço Kids", category: "divertido", layout: "playful-shapes", bg: "#E0F2FE", surface: "#FFFFFF", ink: "#0C4A6E", sub: "#5E8AA3", accent: "#F472B6", accent2: "#A5F3FC", qrBg: "#FFFFFF", qrFg: "#0A2F45" },
  { id: "petshop", name: "Pet Shop", category: "divertido", layout: "clean-center", bg: "#FEF3C7", surface: "#FFFFFF", ink: "#451A03", sub: "#A07B54", accent: "#EA580C", accent2: "#FDBA74", qrBg: "#FFFFFF", qrFg: "#2E1102" },
  { id: "acai", name: "Açaí Roxinho", category: "divertido", layout: "bold-frame", bg: "#4C1D95", surface: "#FAF5FF", ink: "#2E1065", sub: "#7E6AA3", accent: "#FACC15", accent2: "#8B5CF6", qrBg: "#FFFFFF", qrFg: "#220C46" },

  // ——— CORPORATIVO (7) ———
  { id: "executivo-marinho", name: "Executivo Marinho", category: "corporativo", layout: "side-split", bg: "#0F2A43", surface: "#FFFFFF", ink: "#102A43", sub: "#5B7186", accent: "#0E9F8A", accent2: "#1E4A6E", qrBg: "#FFFFFF", qrFg: "#0B1F31" },
  { id: "advocacia-ouro", name: "Advocacia Ouro", category: "corporativo", layout: "bold-frame", bg: "#1C1917", surface: "#FAFAF9", ink: "#1C1917", sub: "#78716C", accent: "#B45309", accent2: "#44403C", qrBg: "#FFFFFF", qrFg: "#141210" },
  { id: "clinica", name: "Clínica Clean", category: "corporativo", layout: "top-banner", bg: "#F8FAFC", surface: "#FFFFFF", ink: "#0F172A", sub: "#64748B", accent: "#0284C7", accent2: "#E0F2FE", qrBg: "#FFFFFF", qrFg: "#0A1428" },
  { id: "imobiliaria", name: "Imobiliária Prime", category: "corporativo", layout: "bottom-strip", bg: "#111827", surface: "#F9FAFB", ink: "#111827", sub: "#6B7280", accent: "#059669", accent2: "#374151", qrBg: "#FFFFFF", qrFg: "#0D131F" },
  { id: "contabil", name: "Contábil Sóbrio", category: "corporativo", layout: "receipt", bg: "#E8EDF1", surface: "#FFFFFF", ink: "#1F2937", sub: "#6B7C93", accent: "#1D4ED8", accent2: "#CBD5E1", qrBg: "#FFFFFF", qrFg: "#141B26" },
  { id: "dark-premium", name: "Dark Premium", category: "corporativo", layout: "dark-premium", bg: "#101418", surface: "#1C2228", ink: "#F5F7F7", sub: "#93A1AD", accent: "#2DD4BF", accent2: "#2A343C", qrBg: "#FFFFFF", qrFg: "#0C1114" },
  { id: "cafe-bistro", name: "Café Bistrô", category: "corporativo", layout: "ticket-notch", bg: "#3B2A1E", surface: "#FFF8ED", ink: "#292018", sub: "#8A7560", accent: "#B45309", accent2: "#6B4E2E", qrBg: "#FFFFFF", qrFg: "#211710" },
];

export const designById = (id: string): Design =>
  DESIGNS.find((d) => d.id === id) ?? DESIGNS[0];

export function amountNumber(data: PlateData): number | undefined {
  if (data.amountMode !== "fixo") return undefined;
  // pt-BR: com vírgula, o ponto é milhar ("1.234,56" → 1234.56); sem vírgula,
  // o ponto é tratado como decimal ("1234.56" → 1234.56).
  const raw = data.amount.trim();
  const normalized = raw.includes(",") ? raw.replace(/\./g, "").replace(",", ".") : raw;
  const n = Number(normalized);
  return Number.isFinite(n) && n > 0 ? Math.round(n * 100) / 100 : undefined;
}

export function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
