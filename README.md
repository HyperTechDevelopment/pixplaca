# PixPlaca

Gerador de placas de QR Code Pix com **30 designs** prontos. Escolha um modelo, personalize e baixe em **PNG** (1500×2000px) ou **PDF A4** pronto para imprimir.

## O que faz

- **QR Code Pix oficial** — payload BR Code (EMV) com CRC16 válido, gerado no navegador
- **30 designs** em 4 estilos: minimalista (8), colorido (8), divertido (7), corporativo (7)
- **Personalização** — chave, nome, cidade, mensagem, valor fixo ou livre, logo e cor de destaque
- **Validação real** — CPF/CNPJ com dígito verificador (evita QR apontando para outra pessoa)
- **Ajuste automático de logo** — quadrada vira círculo; larga/alta vira chip com a imagem inteira
- **Modo escuro** — botão manual + preferência do sistema
- **Contador local** de placas geradas neste navegador
- **Privacidade** — nenhum dado sai do navegador: sem backend, sem contas, sem requisições

## Stack

React 19 + TypeScript + Vite, Tailwind CSS e shadcn/ui. QR via `qrcode`, exportação via `html-to-image` e `jspdf`.

## Rodando localmente

```bash
pnpm install
pnpm dev
```

Build de produção: `pnpm build`

## Estrutura

| Caminho | Responsabilidade |
| --- | --- |
| `src/lib/pix.ts` | Payload BR Code, CRC16, validação de chave (CPF/CNPJ) |
| `src/lib/designs.ts` | Catálogo dos 30 designs e tipos da placa |
| `src/components/PlateCanvas.tsx` | Renderização dos 10 layouts de placa |
| `src/components/Studio.tsx` | Editor: dados, galeria de designs, personalização e download |
| `src/lib/export.ts` | Exportação PNG e PDF A4 |
| `src/lib/usePlateCount.ts` | Contador local de placas geradas |

## Segurança

Cabeçalhos em `vercel.json` (CSP em `Report-Only`, `frame-ancestors 'none'`, HSTS, `nosniff`). Upload de logo restrito a PNG/JPEG/WebP.

> Antes de publicar em produção, revise o CSP em `vercel.json` e troque `Content-Security-Policy-Report-Only` por `Content-Security-Policy` após conferir o console.
