<p align="center">
  <picture>
    <source srcset="./docs/assets/pixplaca-logo-static.png" media="(prefers-reduced-motion: reduce)" />
    <source srcset="./docs/assets/pixplaca-logo-animated.gif" type="image/gif" />
    <img src="./docs/assets/pixplaca-logo-static.png" alt="Logo PixPlaca" width="160" height="160" />
  </picture>
</p>

<p align="center">
  <img src="./assets/readme/hero.svg" width="100%" alt="PixPlaca — sua placa de QR Code Pix, pronta para imprimir" />
</p>

<p align="center">
  <a href="https://hypertechdevelopment.github.io/pixplaca/"><strong>Ver demo</strong></a>
  ·
  <a href="README.en.md">English version</a>
  <br />
  <a href="https://github.com/sponsors/HyperTechDevelopment"><img src="https://img.shields.io/badge/Sponsor-❤-ea4aaa?logo=githubsponsors&logoColor=white" alt="Sponsor" /></a>
  <img src="https://img.shields.io/badge/Pix-BR%20Code-12A594" alt="Pix BR Code" />
  <img src="https://img.shields.io/badge/PNG-1500x2000-0E2420" alt="PNG 1500 por 2000" />
  <img src="https://img.shields.io/badge/PDF-A4-F26B1D" alt="PDF A4" />
</p>

Crie placas de QR Code Pix com **30 designs** em 4 estilos — minimalista, colorido, divertido e corporativo. Personalize, visualize na hora e baixe em **PNG** ou **PDF**. Nada sai do navegador.

![Tela inicial do PixPlaca com uma placa de exemplo](./docs/screenshots/hero.png)

## Como funciona

<p align="center">
  <img src="./assets/readme/workflow.svg" width="100%" alt="Quatro passos: chave Pix, personalizar, QR BR Code, baixar" />
</p>

1. **Informe a chave Pix** — CPF e CNPJ passam por validação de dígito verificador.
2. **Personalize** — nome, cidade, mensagem, valor fixo ou livre, logo e cor de destaque. Logos largas ou altas se ajustam sozinhas ao espaço da placa.
3. **QR no padrão BR Code** — payload gerado localmente, com CRC16.
4. **Baixe** — PNG de 1500×2000 px ou PDF em folha A4.

## Uso

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
