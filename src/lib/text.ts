/** Remove qualquer caractere não-ASCII (equivale a /[^\x00-\x7F]/g). */
export function stripNonAscii(value: string): string {
  return Array.from(value)
    .filter((ch) => ch.charCodeAt(0) <= 0x7f)
    .join("");
}
