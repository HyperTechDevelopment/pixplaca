import { useEffect, useMemo, useRef, useState, type ElementType, type ReactNode } from "react";
import { toast } from "sonner";
import {
  Briefcase,
  Check,
  Copy,
  Download,
  FileText,
  Image as ImageIcon,
  Loader2,
  Palette,
  PartyPopper,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import PlateCanvas, { DEMO_PAYLOAD, PlatePreview, PLATE_H, PLATE_W, logoFit, useQrSvg } from "@/components/PlateCanvas";
import {
  CATEGORY_LABEL,
  DEFAULT_PLATE,
  DESIGNS,
  amountNumber,
  designById,
  type Category,
  type PlateData,
} from "@/lib/designs";
import { buildPixPayload, validatePixKey } from "@/lib/pix";
import { bumpPlaca } from "@/lib/usePlateCount";
import { exportPdf, exportPng } from "@/lib/export";
import { cn } from "@/lib/utils";

const LOGO_TYPES = ["image/png", "image/jpeg", "image/webp"];

const CATEGORY_ICON: Record<Category, ElementType> = {
  minimalista: Sparkles,
  colorido: Palette,
  divertido: PartyPopper,
  corporativo: Briefcase,
};

const ACCENTS = ["#12A594", "#F97316", "#7C3AED", "#EC4899", "#0EA5E9", "#16A34A", "#DC2626", "#B45309"];

function useElementWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(360);
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);
  return { ref, width };
}

function Step({ n, title, hint }: { n: number; title: string; hint?: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
        {n}
      </span>
      <div>
        <h3 className="font-display text-base font-bold leading-tight text-foreground">{title}</h3>
        {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
      </div>
    </div>
  );
}

function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section
      className={cn(
        "rounded-3xl border border-border/70 bg-card p-5 shadow-[0_2px_20px_-8px_rgba(13,80,72,0.18)] sm:p-6",
        className,
      )}
    >
      {children}
    </section>
  );
}

export default function Studio() {
  const [data, setData] = useState<PlateData>(DEFAULT_PLATE);
  const [designId, setDesignId] = useState(DESIGNS[0].id);
  const [filter, setFilter] = useState<Category | "todos">("todos");
  const [busy, setBusy] = useState<"png" | "pdf" | null>(null);

  const design = designById(designId);
  const keyError = validatePixKey(data.pixKey);
  const ready = !keyError;

  const payload = useMemo(() => {
    if (keyError) return DEMO_PAYLOAD;
    return buildPixPayload({
      key: data.pixKey,
      name: data.name || "Recebedor",
      city: data.city || "Brasil",
      amount: amountNumber(data),
    });
  }, [data.pixKey, data.name, data.city, data.amount, data.amountMode, keyError]);

  const qr = useQrSvg(payload, design.qrFg, design.qrBg);
  const thumbQr = useQrSvg(DEMO_PAYLOAD, "#152622");
  const preview = useElementWidth<HTMLDivElement>();
  const exportRef = useRef<HTMLDivElement>(null);

  const set = <K extends keyof PlateData>(key: K, value: PlateData[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const visible = filter === "todos" ? DESIGNS : DESIGNS.filter((d) => d.category === filter);
  const previewWidth = Math.min(preview.width || 360, 440);
  const thumbFit = logoFit(data.logoRatio, 56);

  // ponytail: SVG não é aceito (referências externas vazam no export);
  // rasterizar em <canvas> vira PNG se o caso de uso aparecer.
  const onLogo = (file?: File) => {
    if (!file) return;
    if (!LOGO_TYPES.includes(file.type)) {
      toast.error("Use PNG, JPG ou WebP.");
      return;
    }
    if (file.size > 2_000_000) {
      toast.error("Imagem muito grande (máx. 2 MB).");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const url = String(reader.result);
      // Mede a proporção aqui (uma vez) para o render não precisar carregar a imagem.
      const img = new Image();
      img.onload = () => {
        const ratio = img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : null;
        setData((d) => ({ ...d, logoUrl: url, logoRatio: ratio, showLogo: true }));
        toast.success("Logo adicionado");
      };
      img.onerror = () => {
        // Sem medida, cai no ramo quadrado (mesmo visual de antes).
        setData((d) => ({ ...d, logoUrl: url, logoRatio: null, showLogo: true }));
      };
      img.src = url;
    };
    reader.readAsDataURL(file);
  };

  const run = async (kind: "png" | "pdf") => {
    if (!exportRef.current) return;
    if (!ready) {
      toast.error("Informe uma chave Pix válida para baixar.");
      return;
    }
    setBusy(kind);
    try {
      const name = `pix-${design.id}-${data.name}`;
      if (kind === "png") await exportPng(exportRef.current, name);
      else await exportPdf(exportRef.current, name);
      bumpPlaca();
      toast.success(kind === "png" ? "PNG baixado" : "PDF pronto para imprimir");
    } catch {
      toast.error("Não foi possível gerar o arquivo. Tente novamente.");
    } finally {
      setBusy(null);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(payload);
      toast.success("Código Pix copiado");
    } catch {
      toast.error("Não foi possível copiar.");
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px] xl:grid-cols-[minmax(0,1fr)_440px]">
      {/* ——— Painel de prévia (sticky no desktop, primeiro no mobile) ——— */}
      <div className="order-1 lg:order-2">
        <div className="lg:sticky lg:top-6 space-y-4">
          <div className="rounded-[28px] border border-border/70 bg-card p-4 shadow-[0_18px_50px_-24px_rgba(13,80,72,0.4)] sm:p-5">
            <div className="mb-3 flex items-baseline justify-between gap-2">
              <p className="font-display text-sm font-bold text-foreground">Prévia</p>
              <p className="text-xs font-semibold text-muted-foreground">
                {design.name} · {CATEGORY_LABEL[design.category]}
              </p>
            </div>

            <div
              ref={preview.ref}
              className="mx-auto w-full max-w-[440px] overflow-hidden rounded-2xl ring-1 ring-black/5 dark:ring-white/10"
            >
              <PlatePreview design={design} data={data} qr={qr} width={previewWidth} />
            </div>

            {!ready && (
              <p className="mt-3 rounded-2xl bg-accent/10 px-3 py-2 text-xs font-semibold text-foreground/80">
                <span className="text-accent">Prévia de exemplo.</span> Informe uma chave Pix válida para gerar a placa
                real.
              </p>
            )}

            <div className="mt-4 grid grid-cols-2 gap-2.5">
              <Button
                onClick={() => run("png")}
                disabled={busy !== null}
                className="h-11 rounded-2xl bg-primary text-sm font-bold text-primary-foreground hover:bg-primary/90"
              >
                {busy === "png" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ImageIcon className="mr-2 h-4 w-4" />}
                PNG
              </Button>
              <Button
                onClick={() => run("pdf")}
                disabled={busy !== null}
                variant="outline"
                className="h-11 rounded-2xl border-2 border-primary/25 text-sm font-bold text-primary hover:bg-primary/5"
              >
                {busy === "pdf" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
                PDF A4
              </Button>
            </div>

            <Button
              onClick={copy}
              variant="ghost"
              className="mt-2 h-10 w-full rounded-2xl text-xs font-bold text-muted-foreground hover:text-foreground"
            >
              <Copy className="mr-2 h-3.5 w-3.5" />
              Copiar código Pix (copia e cola)
            </Button>
          </div>

          <p className="px-2 text-center text-xs leading-relaxed text-muted-foreground">
            <Download className="mr-1 inline h-3 w-3" />
            PNG em 1500×2000px · PDF em A4 pronto para imprimir
          </p>
        </div>
      </div>

      {/* ——— Controles ——— */}
      <div className="order-2 lg:order-1 space-y-5">
        <Card className="space-y-4">
          <Step n={1} title="Dados do Pix" hint="Aparecem na placa e dentro do QR Code." />
          <div className="space-y-3.5">
            <div className="space-y-1.5">
              <Label htmlFor="pixKey" className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Chave Pix
              </Label>
              <Input
                id="pixKey"
                value={data.pixKey}
                onChange={(e) => set("pixKey", e.target.value)}
                placeholder="CPF, CNPJ, e-mail, telefone ou chave aleatória"
                className={cn(
                  "h-11 rounded-xl border-2 bg-background",
                  data.pixKey && keyError ? "border-destructive/50" : "border-border focus-visible:border-primary",
                )}
                autoComplete="off"
              />
              <p className={cn("text-xs", data.pixKey && keyError ? "font-semibold text-destructive" : "text-muted-foreground")}>
                {data.pixKey && keyError ? keyError : "Sua chave fica só neste navegador."}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Nome do recebedor
                </Label>
                <Input
                  id="name"
                  value={data.name}
                  maxLength={25}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Ex.: Cantina da Marta"
                  className="h-11 rounded-xl border-2 border-border bg-background focus-visible:border-primary"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="city" className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Cidade
                </Label>
                <Input
                  id="city"
                  value={data.city}
                  maxLength={15}
                  onChange={(e) => set("city", e.target.value)}
                  placeholder="Ex.: São Paulo"
                  className="h-11 rounded-xl border-2 border-border bg-background focus-visible:border-primary"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="message" className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Mensagem da placa
              </Label>
              <Textarea
                id="message"
                value={data.message}
                maxLength={140}
                onChange={(e) => set("message", e.target.value)}
                rows={2}
                className="resize-none rounded-xl border-2 border-border bg-background text-sm focus-visible:border-primary"
                placeholder="Ex.: Escaneie o código e pague."
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Valor</Label>
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex rounded-full bg-muted p-1">
                  {(["livre", "fixo"] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => set("amountMode", mode)}
                      className={cn(
                        "rounded-full px-4 py-1.5 text-xs font-bold transition",
                        data.amountMode === mode
                          ? "bg-card text-primary shadow-sm"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {mode === "livre" ? "Valor livre" : "Valor fixo"}
                    </button>
                  ))}
                </div>
                {data.amountMode === "fixo" && (
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
                      R$
                    </span>
                    <Input
                      value={data.amount}
                      onChange={(e) => set("amount", e.target.value.replace(/[^\d.,]/g, ""))}
                      inputMode="decimal"
                      placeholder="0,00"
                      className="h-10 w-32 rounded-xl border-2 border-border bg-background pl-9 font-bold focus-visible:border-primary"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        <Card className="space-y-4">
          <Step n={2} title="Escolha o design" hint="30 placas em 4 estilos. Toque para aplicar." />

          <div className="flex flex-wrap gap-1.5">
            {(["todos", ...(Object.keys(CATEGORY_LABEL) as Category[])] as const).map((cat) => {
              const active = filter === cat;
              const Icon = cat === "todos" ? Sparkles : CATEGORY_ICON[cat];
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilter(cat)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition",
                    active
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-primary",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {cat === "todos" ? "Todos" : CATEGORY_LABEL[cat]}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {visible.map((d) => {
              const active = d.id === designId;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDesignId(d.id)}
                  className={cn(
                    "group relative overflow-hidden rounded-2xl border-2 bg-background p-1.5 text-left transition",
                    active
                      ? "border-primary shadow-[0_0_0_4px_hsl(var(--primary)/0.12)]"
                      : "border-border hover:-translate-y-0.5 hover:border-primary/45 hover:shadow-md",
                  )}
                  aria-pressed={active}
                >
                  <div className="overflow-hidden rounded-xl">
                    <PlatePreview design={d} data={data} qr={thumbQr} width={140} />
                  </div>
                  <div className="flex items-center justify-between gap-1 px-1 pt-1.5">
                    <span className="truncate text-[11px] font-bold text-foreground">{d.name}</span>
                    {active && <Check className="h-3.5 w-3.5 shrink-0 text-primary" />}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        <Card className="space-y-4">
          <Step n={3} title="Personalize" hint="Logo, cor de destaque e detalhes finais." />

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Logo</Label>
            <div className="flex items-center gap-3">
              <label
                className={cn(
                  "flex h-14 w-14 shrink-0 cursor-pointer items-center justify-center overflow-hidden border-2 border-dashed transition",
                  data.logoUrl ? "border-primary/40 bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted",
                )}
                style={{ borderRadius: thumbFit.borderRadius }}
              >
                {data.logoUrl ? (
                  <img
                    src={data.logoUrl}
                    alt="Logo"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: thumbFit.objectFit,
                      padding: thumbFit.padding,
                    }}
                  />
                ) : (
                  <Upload className="h-5 w-5 text-muted-foreground" />
                )}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) => onLogo(e.target.files?.[0])}
                />
              </label>
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={data.showLogo}
                    disabled={!data.logoUrl}
                    onCheckedChange={(v) => set("showLogo", v)}
                  />
                  <span className="text-xs font-bold text-foreground">Exibir logo na placa</span>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={data.showMessage} onCheckedChange={(v) => set("showMessage", v)} />
                  <span className="text-xs font-bold text-foreground">Exibir mensagem</span>
                </div>
                {data.logoUrl && (
                  <button
                    type="button"
                    onClick={() => setData((d) => ({ ...d, logoUrl: null, logoRatio: null, showLogo: false }))}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-3 w-3" /> Remover logo
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Cor de destaque</Label>
            <div className="flex flex-wrap items-center gap-2">
              {ACCENTS.map((color) => {
                const active = (data.accentOverride ?? design.accent).toLowerCase() === color.toLowerCase();
                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => set("accentOverride", color)}
                    className={cn(
                      "h-8 w-8 rounded-full border-2 transition",
                      active ? "border-foreground scale-110" : "border-white/70 hover:scale-105",
                    )}
                    style={{ background: color }}
                    aria-label={`Cor ${color}`}
                  />
                );
              })}
              <label className="relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-border text-muted-foreground hover:border-primary">
                <Palette className="h-3.5 w-3.5" />
                <input
                  type="color"
                  value={data.accentOverride ?? design.accent}
                  onChange={(e) => set("accentOverride", e.target.value)}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
              </label>
              {data.accentOverride && (
                <button
                  type="button"
                  onClick={() => set("accentOverride", null)}
                  className="text-[11px] font-bold text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                >
                  usar cor do design
                </button>
              )}
            </div>
          </div>
        </Card>

        <Button
          onClick={() => run("png")}
          disabled={busy !== null || !ready}
          className="h-12 w-full rounded-2xl bg-primary py-4 text-base font-extrabold text-primary-foreground shadow-[0_12px_30px_-12px_hsl(var(--primary)/0.8)] hover:bg-primary/90 lg:hidden"
        >
          {busy ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Download className="mr-2 h-5 w-5" />}
          Baixar minha placa
        </Button>
      </div>

      {/* Nó de exportação em escala real, fora da tela */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          left: -10000,
          top: 0,
          width: PLATE_W,
          height: PLATE_H,
          pointerEvents: "none",
        }}
      >
        <div ref={exportRef} style={{ width: PLATE_W, height: PLATE_H }}>
          <PlateCanvas design={design} data={data} qr={qr} />
        </div>
      </div>
    </div>
  );
}
