import { useEffect, useState, type CSSProperties } from "react";
import QRCode from "qrcode";
import type { Design, PlateData } from "@/lib/designs";
import { amountNumber, formatBRL, DEFAULT_PLATE } from "@/lib/designs";
import { buildPixPayload } from "@/lib/pix";

export const PLATE_W = 600;
export const PLATE_H = 800;

/** QR de exemplo (usado na galeria e enquanto a chave não é válida). */
export const DEMO_PAYLOAD = buildPixPayload({
  key: "contato@pixplaca.com.br",
  name: "PixPlaca",
  city: "Sao Paulo",
});

export function useQrSvg(payload: string, fg: string, bg = "#FFFFFF") {
  const [svg, setSvg] = useState("");
  useEffect(() => {
    let alive = true;
    QRCode.toString(payload, {
      type: "svg",
      margin: 0,
      errorCorrectionLevel: "M",
      color: { dark: fg, light: bg },
    })
      .then((s) => alive && setSvg(s))
      .catch(() => alive && setSvg(""));
    return () => {
      alive = false;
    };
  }, [payload, fg, bg]);
  return svg;
}

interface CanvasProps {
  design: Design;
  data: PlateData;
  qr: string;
}

function Qr({ svg, size }: { svg: string; size: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: svg }}
      aria-label="QR Code Pix"
    />
  );
}

function PixMark({ color, size = 26 }: { color: string; size?: number }) {
  return (
    <span
      style={{
        color,
        fontSize: size,
        fontWeight: 800,
        letterSpacing: "-0.04em",
        lineHeight: 1,
        fontFamily: "Poppins, sans-serif",
      }}
    >
      pix
    </span>
  );
}

/**
 * Forma da logo conforme a proporção (largura/altura), medida no upload.
 * Quase quadrada = círculo + cover (corte nas bordas); larga/alta = chip
 * arredondado + contain, para a imagem inteira caber. A caixa é sempre
 * size×size para não deslocar nenhum dos 10 layouts.
 * ponytail: rotação EXIF pode inverter a proporção; corrigir com
 * createImageBitmap({ imageOrientation: "from-image" }) se aparecer na prática.
 */
export function logoFit(ratio: number | null, size: number) {
  const square = ratio == null || (ratio >= 0.85 && ratio <= 1.2);
  return square
    ? { borderRadius: 999, objectFit: "cover" as const, padding: 0 }
    : { borderRadius: Math.round(size * 0.22), objectFit: "contain" as const, padding: Math.round(size * 0.1) };
}

function Logo({ data, design, size }: { data: PlateData; design: Design; size: number }) {
  if (!data.showLogo || !data.logoUrl) return null;
  const { borderRadius, objectFit, padding } = logoFit(data.logoRatio, size);
  return (
    <img
      src={data.logoUrl}
      alt="Logo"
      style={{
        width: size,
        height: size,
        borderRadius,
        objectFit,
        padding,
        border: `3px solid ${design.surface}`,
        boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
        background: "#fff",
      }}
    />
  );
}

function AmountChip({
  data,
  design,
  tone = "accent",
}: {
  data: PlateData;
  design: Design;
  tone?: "accent" | "soft";
}) {
  const amount = amountNumber(data);
  const bg = tone === "accent" ? design.accent : design.accent2;
  const color = tone === "accent" ? "#fff" : design.ink;
  return (
    <div
      style={{
        background: bg,
        color,
        borderRadius: 999,
        padding: "10px 24px",
        fontWeight: 800,
        fontSize: amount ? 26 : 20,
        letterSpacing: amount ? "-0.02em" : "0.01em",
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      {amount ? (
        <>Pagar {formatBRL(amount)}</>
      ) : (
        <>
          <span style={{ opacity: 0.85 }}>Valor livre</span>
        </>
      )}
    </div>
  );
}

function Message({ data, design, size = 19 }: { data: PlateData; design: Design; size?: number }) {
  if (!data.showMessage || !data.message.trim()) return null;
  return (
    <p
      style={{
        margin: 0,
        color: design.sub,
        fontSize: size,
        lineHeight: 1.45,
        fontWeight: 600,
        maxWidth: 440,
        textAlign: "center",
        display: "-webkit-box",
        WebkitLineClamp: 3,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
      }}
    >
      {data.message}
    </p>
  );
}

export default function PlateCanvas({ design, data, qr }: CanvasProps) {
  const accent = data.accentOverride ?? design.accent;
  const c = { ...design, accent };
  const name = data.name.trim() || "Seu Nome Aqui";
  const amount = amountNumber(data);
  const base: CSSProperties = {
    width: PLATE_W,
    height: PLATE_H,
    background: c.bg,
    position: "relative",
    overflow: "hidden",
    fontFamily: "Nunito, sans-serif",
    color: c.ink,
    display: "flex",
  };

  switch (c.layout) {
    case "clean-center":
      return (
        <div style={{ ...base, flexDirection: "column", alignItems: "center", padding: 56 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
            <PixMark color={c.accent} />
            {data.showLogo && data.logoUrl && <Logo data={data} design={c} size={46} />}
          </div>
          <h1
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 44,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              margin: "0 0 6px",
              textAlign: "center",
              color: c.ink,
              lineHeight: 1.1,
            }}
          >
            {name}
          </h1>
          <div style={{ width: 54, height: 6, borderRadius: 9, background: c.accent, marginBottom: 26 }} />
          <div
            style={{
              background: c.qrBg,
              borderRadius: 32,
              padding: 24,
              boxShadow: "0 18px 40px rgba(15,32,29,0.12)",
              border: `2px solid ${c.accent2}`,
            }}
          >
            <Qr svg={qr} size={300} />
          </div>
          <div style={{ marginTop: 26, marginBottom: 18 }}>
            <AmountChip data={data} design={c} />
          </div>
          <Message data={data} design={c} />
          <div style={{ marginTop: "auto", fontSize: 15, color: c.sub, fontWeight: 700, letterSpacing: "0.08em" }}>
            PAGUE COM PIX
          </div>
        </div>
      );

    case "top-banner":
      return (
        <div style={{ ...base, flexDirection: "column" }}>
          <div
            style={{
              background: c.accent,
              padding: "42px 40px 74px",
              textAlign: "center",
              position: "relative",
            }}
          >
            <PixMark color="#fff" size={30} />
            <h1
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 38,
                fontWeight: 800,
                color: "#fff",
                margin: "10px 0 0",
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
              }}
            >
              {name}
            </h1>
          </div>
          <div style={{ position: "absolute", top: 176, left: 0, right: 0, textAlign: "center" }}>
            {data.showLogo && data.logoUrl && <Logo data={data} design={c} size={72} />}
          </div>
          <div
            style={{
              margin: "-34px auto 0",
              background: c.qrBg,
              borderRadius: 30,
              padding: 24,
              boxShadow: "0 22px 44px rgba(15,32,29,0.18)",
              position: "relative",
              zIndex: 2,
            }}
          >
            <Qr svg={qr} size={286} />
          </div>
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
              padding: "26px 40px 40px",
              textAlign: "center",
            }}
          >
            <AmountChip data={data} design={c} />
            <Message data={data} design={c} />
            <div style={{ marginTop: "auto", fontSize: 15, fontWeight: 800, color: c.accent, letterSpacing: "0.12em" }}>
              APONTE A CÂMERA E PAGUE
            </div>
          </div>
        </div>
      );

    case "side-split":
      return (
        <div style={{ ...base, flexDirection: "row" }}>
          <div
            style={{
              width: 196,
              background: c.accent,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "40px 18px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
              <PixMark color="#fff" size={30} />
              {data.showLogo && data.logoUrl && <Logo data={data} design={c} size={62} />}
            </div>
            <h1
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 30,
                fontWeight: 700,
                color: "#fff",
                margin: 0,
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
                letterSpacing: "-0.01em",
                maxHeight: 440,
                overflow: "hidden",
                textAlign: "center",
              }}
            >
              {name}
            </h1>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", fontWeight: 800, letterSpacing: "0.14em" }}>
              PIX
            </div>
          </div>
          <div
            style={{
              flex: 1,
              background: c.surface,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 22,
              padding: 34,
            }}
          >
            <div
              style={{
                background: c.qrBg,
                borderRadius: 26,
                padding: 20,
                boxShadow: "0 14px 34px rgba(15,32,29,0.12)",
              }}
            >
              <Qr svg={qr} size={250} />
            </div>
            <AmountChip data={data} design={c} />
            <Message data={data} design={c} size={17} />
            {data.pixKey && (
              <div
                style={{
                  fontSize: 13,
                  color: c.sub,
                  fontWeight: 700,
                  wordBreak: "break-all",
                  textAlign: "center",
                  maxWidth: 280,
                }}
              >
                {data.pixKey}
              </div>
            )}
          </div>
        </div>
      );

    case "bottom-strip":
      return (
        <div style={{ ...base, flexDirection: "column", padding: "34px 40px 0" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
            <PixMark color={c.accent} />
            {data.showLogo && data.logoUrl && <Logo data={data} design={c} size={44} />}
          </div>
          <h1
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 34,
              fontWeight: 800,
              textAlign: "center",
              margin: "12px 0 20px",
              letterSpacing: "-0.025em",
              color: c.ink,
            }}
          >
            {name}
          </h1>
          <div
            style={{
              alignSelf: "center",
              background: c.qrBg,
              borderRadius: 30,
              padding: 20,
              boxShadow: "0 16px 38px rgba(15,32,29,0.14)",
              border: `3px solid ${c.accent2}`,
            }}
          >
            <Qr svg={qr} size={292} />
          </div>
          <div
            style={{
              marginTop: "auto",
              marginLeft: -40,
              marginRight: -40,
              background: c.accent,
              padding: "28px 34px 30px",
              textAlign: "center",
              color: "#fff",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: "-0.01em" }}>
              {amount ? formatBRL(amount) : "Valor livre"}
            </div>
            {data.showMessage && data.message.trim() && (
              <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "rgba(255,255,255,0.92)" }}>{data.message}</p>
            )}
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.2em", opacity: 0.85 }}>
              ESCANEIE E PAGUE COM PIX
            </div>
          </div>
        </div>
      );

    case "circle-badge":
      return (
        <div style={{ ...base, flexDirection: "column", alignItems: "center", padding: "44px 40px" }}>
          <div
            style={{
              position: "absolute",
              width: 470,
              height: 470,
              borderRadius: "999px",
              background: c.accent2,
              top: 165,
              left: "50%",
              transform: "translateX(-50%)",
            }}
          />
          <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 12 }}>
            <PixMark color={c.accent} />
            {data.showLogo && data.logoUrl && <Logo data={data} design={c} size={44} />}
          </div>
          <h1
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 36,
              fontWeight: 800,
              textAlign: "center",
              margin: "12px 0 0",
              letterSpacing: "-0.025em",
              position: "relative",
              color: c.ink,
            }}
          >
            {name}
          </h1>
          <div
            style={{
              position: "relative",
              marginTop: 34,
              background: c.qrBg,
              borderRadius: 38,
              padding: 26,
              boxShadow: "0 24px 46px rgba(15,32,29,0.2)",
              transform: "rotate(-2.5deg)",
            }}
          >
            <Qr svg={qr} size={272} />
          </div>
          <div style={{ position: "relative", marginTop: 34 }}>
            <AmountChip data={data} design={c} />
          </div>
          <div style={{ position: "relative", marginTop: 16 }}>
            <Message data={data} design={c} size={17} />
          </div>
          <div
            style={{
              marginTop: "auto",
              position: "relative",
              fontSize: 14,
              fontWeight: 800,
              color: c.sub,
              letterSpacing: "0.1em",
            }}
          >
            ESCANEIE E PAGUE
          </div>
        </div>
      );

    case "ticket-notch":
      return (
        <div style={{ ...base, background: c.bg, alignItems: "center", justifyContent: "center", padding: 32 }}>
          <div
            style={{
              background: c.surface,
              borderRadius: 26,
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "34px 30px",
              position: "relative",
              boxShadow: "0 20px 44px rgba(0,0,0,0.16)",
            }}
          >
            {[
              { top: "31%", left: -19 },
              { top: "31%", right: -19 },
            ].map((pos, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  width: 38,
                  height: 38,
                  borderRadius: "999px",
                  background: c.bg,
                  ...pos,
                }}
              />
            ))}
            <div style={{ display: "flex", alignItems: "center", gap: 12, color: c.accent }}>
              <PixMark color={c.accent} size={28} />
              {data.showLogo && data.logoUrl && <Logo data={data} design={c} size={40} />}
            </div>
            <h1
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 32,
                fontWeight: 800,
                margin: "10px 0 4px",
                textAlign: "center",
                color: c.ink,
                letterSpacing: "-0.02em",
              }}
            >
              {name}
            </h1>
            <div style={{ fontSize: 13, fontWeight: 800, color: c.sub, letterSpacing: "0.18em" }}>PAGAMENTO VIA PIX</div>
            <div style={{ display: "flex", alignItems: "center", width: "100%", margin: "22px 0 20px", gap: 10 }}>
              <div style={{ flex: 1, height: 0, borderTop: `2px dashed ${c.accent2}` }} />
            </div>
            <div style={{ background: c.qrBg, padding: 12, borderRadius: 16, border: `2px solid ${c.accent2}` }}>
              <Qr svg={qr} size={268} />
            </div>
            <div style={{ display: "flex", alignItems: "center", width: "100%", margin: "22px 0 16px", gap: 10 }}>
              <div style={{ flex: 1, height: 0, borderTop: `2px dashed ${c.accent2}` }} />
            </div>
            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: c.sub, letterSpacing: "0.12em" }}>VALOR</span>
              <span style={{ fontSize: 26, fontWeight: 900, color: c.ink }}>
                {amount ? formatBRL(amount) : "LIVRE"}
              </span>
            </div>
            <div style={{ marginTop: 12 }}>
              <Message data={data} design={c} size={16} />
            </div>
            <div style={{ marginTop: "auto", fontSize: 12, fontWeight: 800, color: c.sub, letterSpacing: "0.16em" }}>
              PAGAMENTO SEGURO VIA PIX
            </div>
          </div>
        </div>
      );

    case "bold-frame":
      return (
        <div style={{ ...base, padding: 26, background: c.bg }}>
          <div
            style={{
              flex: 1,
              background: c.surface,
              borderRadius: 22,
              border: `10px solid ${c.accent}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "40px 34px 30px",
              position: "relative",
            }}
          >
            <div
              style={{
                background: c.accent,
                color: "#fff",
                padding: "8px 22px",
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 900,
                letterSpacing: "0.2em",
                marginTop: -8,
              }}
            >
              PAGUE COM PIX
            </div>
            <h1
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 36,
                fontWeight: 800,
                margin: "18px 0 4px",
                textAlign: "center",
                letterSpacing: "-0.03em",
                color: c.ink,
                maxWidth: 420,
              }}
            >
              {name}
            </h1>
            {data.showLogo && data.logoUrl ? (
              <div style={{ marginTop: 12 }}>
                <Logo data={data} design={c} size={64} />
              </div>
            ) : null}
            <div style={{ background: c.qrBg, borderRadius: 20, padding: 16, marginTop: 24 }}>
              <Qr svg={qr} size={264} />
            </div>
            <div style={{ marginTop: 24 }}>
              <AmountChip data={data} design={c} tone="soft" />
            </div>
            <div style={{ marginTop: 14 }}>
              <Message data={data} design={c} size={16} />
            </div>
            <div
              style={{
                marginTop: "auto",
                fontSize: 12,
                fontWeight: 800,
                color: c.sub,
                letterSpacing: "0.14em",
                paddingTop: 12,
              }}
            >
              QR CODE GERADO NO APP PIXPLACA
            </div>
          </div>
        </div>
      );

    case "playful-shapes":
      return (
        <div style={{ ...base, flexDirection: "column", alignItems: "center", padding: "44px 40px" }}>
          <div
            style={{
              position: "absolute",
              width: 250,
              height: 250,
              borderRadius: "42% 58% 63% 37% / 41% 44% 56% 59%",
              background: c.accent2,
              top: -80,
              right: -70,
              opacity: 0.9,
            }}
          />
          <div
            style={{
              position: "absolute",
              width: 150,
              height: 150,
              borderRadius: "58% 42% 38% 62% / 52% 57% 43% 48%",
              background: c.accent,
              opacity: 0.18,
              bottom: 60,
              left: -50,
            }}
          />
          {[
            { top: 120, left: 42, size: 18 },
            { top: 300, right: 34, size: 26 },
            { bottom: 190, right: 60, size: 16 },
            { top: 420, left: 30, size: 12 },
          ].map((p, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                borderRadius: "999px",
                background: c.accent,
                opacity: 0.55,
                width: p.size,
                height: p.size,
                ...p,
              }}
            />
          ))}
          <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 12 }}>
            <PixMark color={c.accent} size={30} />
            {data.showLogo && data.logoUrl && <Logo data={data} design={c} size={46} />}
          </div>
          <h1
            style={{
              position: "relative",
              fontFamily: "Poppins, sans-serif",
              fontSize: 40,
              fontWeight: 800,
              textAlign: "center",
              margin: "10px 0 0",
              letterSpacing: "-0.035em",
              lineHeight: 1.05,
              color: c.ink,
            }}
          >
            {name}
          </h1>
          <div
            style={{
              position: "relative",
              marginTop: 30,
              background: c.qrBg,
              borderRadius: 34,
              padding: 22,
              border: `6px solid ${c.accent}`,
              boxShadow: "0 18px 0 rgba(0,0,0,0.12)",
              transform: "rotate(2.5deg)",
            }}
          >
            <Qr svg={qr} size={268} />
          </div>
          <div style={{ position: "relative", marginTop: 34 }}>
            <AmountChip data={data} design={c} />
          </div>
          <div style={{ position: "relative", marginTop: 16 }}>
            <Message data={data} design={c} />
          </div>
          <div
            style={{
              marginTop: "auto",
              position: "relative",
              fontSize: 13,
              fontWeight: 900,
              color: c.accent,
              letterSpacing: "0.14em",
            }}
          >
            PAGUE PELO APP DO SEU BANCO
          </div>
        </div>
      );

    case "dark-premium":
      return (
        <div
          style={{
            ...base,
            background: c.bg,
            flexDirection: "column",
            alignItems: "center",
            padding: "44px 40px",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 520,
              height: 520,
              borderRadius: "999px",
              background: c.accent,
              opacity: 0.16,
              filter: "blur(60px)",
              top: 60,
              left: "50%",
              transform: "translateX(-50%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 22,
              border: `1px solid ${c.accent}55`,
              borderRadius: 18,
              pointerEvents: "none",
            }}
          />
          <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 14 }}>
            <PixMark color={c.accent} size={32} />
            {data.showLogo && data.logoUrl && <Logo data={data} design={c} size={48} />}
          </div>
          <h1
            style={{
              position: "relative",
              fontFamily: "Poppins, sans-serif",
              fontSize: 34,
              fontWeight: 700,
              textAlign: "center",
              margin: "16px 0 6px",
              letterSpacing: "0.01em",
              color: c.ink,
              maxWidth: 420,
            }}
          >
            {name}
          </h1>
          <div
            style={{
              position: "relative",
              width: 60,
              height: 2,
              background: c.accent,
              marginBottom: 30,
            }}
          />
          <div
            style={{
              position: "relative",
              background: c.qrBg,
              borderRadius: 24,
              padding: 22,
              boxShadow: `0 0 0 1px ${c.accent}44, 0 24px 50px rgba(0,0,0,0.45)`,
            }}
          >
            <Qr svg={qr} size={268} />
          </div>
          <div
            style={{
              position: "relative",
              marginTop: 32,
              fontSize: amount ? 34 : 22,
              fontWeight: 800,
              letterSpacing: amount ? "-0.02em" : "0.14em",
              color: c.accent,
            }}
          >
            {amount ? formatBRL(amount) : "VALOR LIVRE"}
          </div>
          <div style={{ position: "relative", marginTop: 16 }}>
            <Message data={data} design={c} size={17} />
          </div>
          <div
            style={{
              marginTop: "auto",
              position: "relative",
              fontSize: 12,
              fontWeight: 700,
              color: c.sub,
              letterSpacing: "0.22em",
            }}
          >
            PAGAMENTO INSTANTÂNEO • PIX
          </div>
        </div>
      );

    case "receipt":
    default: {
      const zigzag = Array.from({ length: 26 });
      return (
        <div style={{ ...base, background: c.bg, alignItems: "center", justifyContent: "center", padding: 30 }}>
          <div
            style={{
              background: c.surface,
              width: "100%",
              height: "100%",
              padding: "38px 34px 22px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "relative",
              boxShadow: "0 18px 40px rgba(0,0,0,0.14)",
              borderRadius: "18px 18px 0 0",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <PixMark color={c.accent} size={26} />
              {data.showLogo && data.logoUrl && <Logo data={data} design={c} size={40} />}
            </div>
            <h1
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 30,
                fontWeight: 800,
                margin: "12px 0 2px",
                textAlign: "center",
                color: c.ink,
                letterSpacing: "-0.015em",
              }}
            >
              {name}
            </h1>
            <div style={{ fontSize: 12, fontWeight: 800, color: c.sub, letterSpacing: "0.22em" }}>PAGUE COM PIX</div>
            <div style={{ width: "100%", height: 0, borderTop: `2px dashed ${c.accent2}`, margin: "18px 0" }} />
            <div style={{ background: c.qrBg, padding: 14, borderRadius: 10 }}>
              <Qr svg={qr} size={256} />
            </div>
            <div style={{ width: "100%", height: 0, borderTop: `2px dashed ${c.accent2}`, margin: "18px 0" }} />
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, color: c.sub, fontWeight: 700 }}>
                <span>PAGAMENTO</span>
                <span>PIX</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: 15, color: c.sub, fontWeight: 700 }}>TOTAL</span>
                <span style={{ fontSize: 28, fontWeight: 900, color: c.ink }}>
                  {amount ? formatBRL(amount) : "A COMBINAR"}
                </span>
              </div>
            </div>
            <div style={{ marginTop: 14 }}>
              <Message data={data} design={c} size={15} />
            </div>
            <div style={{ marginTop: "auto", fontSize: 12, fontWeight: 800, color: c.sub, letterSpacing: "0.1em" }}>
              PIXPLACA • {new Date().getFullYear()}
            </div>
            <div style={{ position: "absolute", bottom: -14, left: 0, right: 0, display: "flex" }}>
              {zigzag.map((_, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: 14,
                    background: c.surface,
                    clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      );
    }
  }
}

/** Wrapper que escala a placa para o tamanho do container. */
export function PlatePreview({
  design,
  data,
  qr,
  width,
}: {
  design: Design;
  data: PlateData;
  qr: string;
  width: number;
}) {
  return (
    <div
      style={{
        width,
        height: (width * PLATE_H) / PLATE_W,
        position: "relative",
        overflow: "hidden",
        borderRadius: 16,
      }}
    >
      <div
        style={{
          width: PLATE_W,
          height: PLATE_H,
          transform: `scale(${width / PLATE_W})`,
          transformOrigin: "top left",
        }}
      >
        <PlateCanvas design={design} data={data} qr={qr} />
      </div>
    </div>
  );
}
