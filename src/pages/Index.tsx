import { ArrowDown, BadgeCheck, Check, QrCode, Scissors, ShieldCheck, Wand2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Studio from "@/components/Studio";
import { DonateDialog } from "@/components/DonateDialog";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PlatePreview, useQrSvg, DEMO_PAYLOAD } from "@/components/PlateCanvas";
import { DEFAULT_PLATE, DESIGNS } from "@/lib/designs";
import { usePlateCount } from "@/lib/usePlateCount";

const HERO_DESIGN = DESIGNS.find((d) => d.id === "turquesa-pop") ?? DESIGNS[0];

const STEPS = [
  { icon: QrCode, title: "Informe sua chave Pix", text: "CPF, CNPJ, e-mail, telefone ou chave aleatória — a chave fica só no seu navegador." },
  { icon: Wand2, title: "Escolha um dos 30 designs", text: "Minimalista, colorido, divertido ou corporativo. Toque para trocar na hora." },
  { icon: Scissors, title: "Personalize", text: "Nome, mensagem, valor fixo ou livre, logo do negócio e cor de destaque." },
  { icon: Zap, title: "Baixe e imprima", text: "PNG em alta resolução ou PDF A4 pronto para imprimir e colocar no balcão." },
];

const PERKS = ["30 designs prontos", "Sem cadastro", "Gratuito", "PNG + PDF", "Padrão BR Code"];

export default function Index() {
  const heroQr = useQrSvg(DEMO_PAYLOAD, HERO_DESIGN.qrFg, HERO_DESIGN.qrBg);
  const placas = usePlateCount();

  // HashRouter trata "#studio" como rota "/studio" (→ 404). Por isso o scroll
  // é feito na mão, sem mudar o hash.
  const scrollToId = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen">
      {/* ——— Topo ——— */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <div className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary shadow-[0_8px_20px_-8px_hsl(var(--primary)/0.9)]">
            <QrCode className="h-5 w-5 text-primary-foreground" />
          </span>
          <span className="font-display text-xl font-extrabold tracking-tight text-foreground">
            Pix<span className="text-primary">Placa</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            onClick={() => scrollToId("studio")}
            className="h-10 rounded-2xl bg-primary px-5 text-sm font-bold text-primary-foreground shadow-[0_10px_24px_-10px_hsl(var(--primary)/0.8)] hover:bg-primary/90"
          >
            Criar minha placa
          </Button>
        </div>
      </header>

      {/* ——— Hero ——— */}
      <section className="relative overflow-hidden">
        <div className="dot-grid pointer-events-none absolute inset-0" aria-hidden />
        <div
          className="pointer-events-none absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full bg-primary/15 blur-3xl dark:opacity-60"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-40 top-64 h-[380px] w-[380px] rounded-full bg-accent/15 blur-3xl dark:opacity-60"
          aria-hidden
        />

        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 pb-14 pt-8 sm:px-6 lg:grid-cols-2 lg:pb-20 lg:pt-12">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider text-primary">
              <ShieldCheck className="h-3.5 w-3.5" />
              Gerador de placas Pix
            </p>
            <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-[3.4rem]">
              Sua placa de <span className="text-primary">QR Code Pix</span>, pronta para imprimir.
            </h1>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-muted-foreground">
              <strong className="text-foreground">30 designs</strong> para balcão, mesa ou vitrine. Adicione nome, logo e
              valor, e baixe em <strong className="text-foreground">PNG ou PDF</strong>.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <Button
                onClick={() => scrollToId("studio")}
                className="h-12 rounded-2xl bg-primary px-7 text-base font-extrabold text-primary-foreground shadow-[0_14px_30px_-12px_hsl(var(--primary)/0.9)] hover:bg-primary/90"
              >
                Começar agora
                <ArrowDown className="ml-2 h-4 w-4" />
              </Button>
              <Button
                onClick={() => scrollToId("como-funciona")}
                variant="outline"
                className="h-12 rounded-2xl border-2 px-6 text-base font-bold"
              >
                Ver como funciona
              </Button>
            </div>
            <ul className="mt-7 flex flex-wrap gap-x-4 gap-y-2">
              {PERKS.map((p) => (
                <li key={p} className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                  <Check className="h-3.5 w-3.5 text-primary" />
                  {p}
                </li>
              ))}
            </ul>

            <div className="mt-5 inline-flex items-center gap-2 rounded-2xl border border-border/70 bg-card px-3.5 py-2">
              <BadgeCheck className="h-4 w-4 shrink-0 text-primary" />
              {placas > 0 ? (
                <p className="text-xs font-semibold text-muted-foreground">
                  <span
                    key={placas}
                    className="font-display text-sm font-extrabold text-foreground motion-safe:animate-[countPop_0.4s_ease-out]"
                  >
                    {placas}
                  </span>{" "}
                  {placas === 1 ? "placa criada" : "placas criadas"} neste navegador
                </p>
              ) : (
                <p className="text-xs font-semibold text-muted-foreground">Seja a primeira placa criada aqui</p>
              )}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[360px]">
            <div className="absolute inset-0 -z-10 translate-x-6 translate-y-6 rounded-[24px] bg-accent/25 blur-md" aria-hidden />
            <div className="rotate-2 overflow-hidden rounded-[24px] shadow-[0_30px_60px_-24px_rgba(13,80,72,0.5)] ring-1 ring-black/5 transition-transform duration-500 hover:rotate-0 dark:ring-white/10">
              <PlatePreview design={HERO_DESIGN} data={DEFAULT_PLATE} qr={heroQr} width={360} />
            </div>
            <div className="absolute -bottom-4 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-foreground px-4 py-2 text-xs font-bold text-background shadow-lg">
              <Check className="h-3.5 w-3.5" />
              Exemplo de placa impressa
            </div>
          </div>
        </div>
      </section>

      {/* ——— Estúdio ——— */}
      <main id="studio" className="mx-auto max-w-6xl scroll-mt-6 px-4 pb-16 sm:px-6">
        <div className="mb-6 text-center">
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Crie sua placa
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">A prévia mostra o resultado final.</p>
        </div>
        <Studio />
      </main>

      {/* ——— Como funciona ——— */}
      <section id="como-funciona" className="border-t border-border/60 bg-card/60 py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-8 text-center">
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Como funciona
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">Quatro passos, sem cadastro.</p>
          </div>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <li
                key={s.title}
                className="relative rounded-3xl border border-border/70 bg-card p-5 shadow-[0_2px_20px_-10px_rgba(13,80,72,0.25)]"
              >
                <span className="absolute -top-3 left-5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary font-display text-sm font-extrabold text-primary-foreground">
                  {i + 1}
                </span>
                <s.icon className="mb-3 mt-1 h-7 w-7 text-primary" />
                <h3 className="font-display text-sm font-bold text-foreground">{s.title}</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ——— Rodapé ——— */}
      <footer className="bg-primary py-10 text-primary-foreground">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 text-center sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-foreground/20">
              <QrCode className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-extrabold tracking-tight">
              Pix<span className="opacity-80">Placa</span>
            </span>
          </div>
          <p className="max-w-md text-sm leading-relaxed opacity-90">
            Placas de QR Code Pix no padrão BR Code. O código é gerado no seu navegador; nada é enviado para servidores.
          </p>
          <p className="text-xs opacity-70">© {new Date().getFullYear()} PixPlaca · Seus dados ficam no seu navegador.</p>
          <DonateDialog />
          {placas > 0 && (
            <p className="text-xs font-semibold opacity-80">
              {placas} {placas === 1 ? "placa gerada" : "placas geradas"} neste navegador
            </p>
          )}
        </div>
      </footer>
    </div>
  );
}
