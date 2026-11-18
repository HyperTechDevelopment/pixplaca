import { useMemo, useState } from "react";
import { Copy, Heart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQrSvg } from "@/components/PlateCanvas";
import { buildPixPayload } from "@/lib/pix";

// Chave aleatória (EVP) de doações: não expõe contato, como CPF ou e-mail fariam.
const DONATE = {
  key: "5fee82bd-82de-42ba-ac7f-2773258a8392",
  name: "Marcos Gabriel M Silva",
  city: "Manaus",
};

const AMOUNTS = [5, 10, 25];

export function DonateDialog() {
  const [amount, setAmount] = useState(AMOUNTS[0]);
  const [copied, setCopied] = useState(false);
  const payload = useMemo(() => buildPixPayload({ ...DONATE, amount }), [amount]);
  const qr = useQrSvg(payload, "#0E2420");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(payload);
      setCopied(true);
      toast.success("Código Pix copiado");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Não foi possível copiar.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 px-4 py-2 text-xs font-bold transition-colors hover:bg-primary-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/70">
        <Heart className="h-3.5 w-3.5" />
        Apoie o PixPlaca
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display text-lg font-extrabold">Apoie o PixPlaca</DialogTitle>
          <DialogDescription>
            O app é gratuito e não pede cadastro. Se ele resolveu sua placa, escolha um valor e pague pelo QR abaixo.
          </DialogDescription>
        </DialogHeader>

        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">Valor da doação</p>
          <div className="grid grid-cols-3 gap-2">
            {AMOUNTS.map((value) => (
              <button
                key={value}
                onClick={() => setAmount(value)}
                aria-pressed={amount === value}
                className={
                  "h-10 rounded-xl border text-sm font-extrabold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
                  (amount === value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:bg-muted")
                }
              >
                R$ {value}
              </button>
            ))}
          </div>
        </div>

        <div className="mx-auto w-full max-w-[200px] rounded-2xl bg-white p-3 ring-1 ring-black/10">
          {qr ? (
            <div
              className="[&>svg]:h-full [&>svg]:w-full"
              style={{ aspectRatio: "1 / 1" }}
              dangerouslySetInnerHTML={{ __html: qr }}
              aria-label={`QR Code Pix de R$ ${amount} para doação`}
            />
          ) : (
            <div className="flex aspect-square items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>

        <p className="text-center text-xs font-semibold text-muted-foreground">
          Aponte a câmera do app do seu banco. O QR já vem com o valor escolhido.
        </p>

        <button
          onClick={copy}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-extrabold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {copied ? <Heart className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copiado!" : "Copiar código Pix"}
        </button>

        <p className="text-center text-[11px] text-muted-foreground">
          Recebedor: Marcos Gabriel M Silva · Manaus
          <br />
          <a
            href="https://github.com/sponsors/HyperTechDevelopment"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 hover:text-foreground"
          >
            Prefere patrocinar pelo GitHub?
          </a>
        </p>
      </DialogContent>
    </Dialog>
  );
}
