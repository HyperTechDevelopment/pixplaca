import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";

export function slug(name: string): string {
  return (
    name
      .normalize("NFD")
      .replace(/[^\x00-\x7F]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "placa-pix"
  );
}

function download(href: string, filename: string) {
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  a.click();
}

/** PNG em alta resolução (2.5x = 1500x2000px). */
export async function exportPng(node: HTMLElement, filename: string) {
  await document.fonts.ready;
  const dataUrl = await toPng(node, { pixelRatio: 2.5, cacheBust: true });
  download(dataUrl, `${slug(filename)}.png`);
}

/** PDF A4 retrato, placa centralizada e pronta para imprimir. */
export async function exportPdf(node: HTMLElement, filename: string) {
  await document.fonts.ready;
  const dataUrl = await toPng(node, { pixelRatio: 3, cacheBust: true });
  const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = 210;
  const pageH = 297;
  const margin = 12;
  const ratio = node.offsetWidth / node.offsetHeight;
  let w = pageW - margin * 2;
  let h = w / ratio;
  if (h > pageH - margin * 2) {
    h = pageH - margin * 2;
    w = h * ratio;
  }
  pdf.addImage(dataUrl, "PNG", (pageW - w) / 2, (pageH - h) / 2, w, h);
  pdf.save(`${slug(filename)}.pdf`);
}
