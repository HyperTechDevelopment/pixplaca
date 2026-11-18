# PixPlaca

[Versão em português](README.md)

Create Pix QR Code signs with 30 designs. Customize and download as PNG or PDF.

**Demo:** https://hypertechdevelopment.github.io/pixplaca/

![PixPlaca home screen with a sample sign](./docs/screenshots/hero.png)

## What it does

- Pix QR Code in the BR Code format
- 30 designs in 4 styles: minimal, colorful, playful and corporate
- Name, city, message, fixed or open amount, logo and accent color
- Wide or tall logos adjust to the sign space on their own
- CPF and CNPJ validation with check digits
- Download as PNG (1500×2000px) or A4 PDF
- Dark mode with toggle and system preference
- No data leaves the browser

## Run it

```bash
pnpm install
pnpm dev
```

Production build:

```bash
pnpm build
```

## Where things live

| File | Responsibility |
| --- | --- |
| `src/lib/pix.ts` | BR Code payload, CRC16 and key validation |
| `src/lib/designs.ts` | The 30-design catalog |
| `src/components/PlateCanvas.tsx` | The 10 sign layouts |
| `src/components/Studio.tsx` | Editor, gallery and download |
| `src/lib/export.ts` | PNG and A4 PDF export |
| `src/lib/usePlateCount.ts` | Local counter of generated signs |

## Security

Everything runs in the browser: the key, the QR generation and the download. No server receives the data. Logo upload accepts PNG, JPG and WebP only, capped at 2 MB. The security policy (CSP) ships in `index.html` itself, since GitHub Pages doesn't send server headers.

## License

MIT — see the [LICENSE](LICENSE) file.
