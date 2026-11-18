# PixPlaca

[![Sponsor](https://img.shields.io/badge/Sponsor-❤-ea4aaa?logo=githubsponsors&logoColor=white)](https://github.com/sponsors/HyperTechDevelopment)

[English version](README.en.md)

Crie placas de QR Code Pix com 30 designs. Personalize e baixe em PNG ou PDF.

**Demo:** https://hypertechdevelopment.github.io/pixplaca/

![Tela inicial do PixPlaca com uma placa de exemplo](./docs/screenshots/hero.png)

## O que faz

- QR Code Pix no padrão BR Code
- 30 designs em 4 estilos: minimalista, colorido, divertido e corporativo
- Nome, cidade, mensagem, valor fixo ou livre, logo e cor de destaque
- Logos largas ou altas se ajustam sozinhas ao espaço da placa
- Validação de CPF e CNPJ com dígito verificador
- Download em PNG (1500×2000px) ou PDF A4
- Modo escuro com botão e preferência do sistema
- Nenhum dado sai do navegador

## Como rodar

```bash
pnpm install
pnpm dev
```

Build de produção:

```bash
pnpm build
```

## Onde fica o quê

| Arquivo | Responsabilidade |
| --- | --- |
| `src/lib/pix.ts` | Payload BR Code, CRC16 e validação de chave |
| `src/lib/designs.ts` | Catálogo dos 30 designs |
| `src/components/PlateCanvas.tsx` | Os 10 layouts de placa |
| `src/components/Studio.tsx` | Editor, galeria e download |
| `src/lib/export.ts` | Exportação PNG e PDF A4 |
| `src/lib/usePlateCount.ts` | Contador local de placas geradas |

## Segurança

Tudo roda no navegador: a chave, a geração do QR e o download. Nenhum servidor recebe os dados. Upload de logo aceita só PNG, JPG e WebP, com limite de 2 MB. A política de segurança (CSP) vai direto no `index.html`, pois o GitHub Pages não envia cabeçalhos de servidor.

## Licença

MIT — veja o arquivo [LICENSE](LICENSE).
