import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";

// Aplica o tema salvo antes da primeira pintura: sem flash e sem script
// inline (compatível com CSP). Mesma chave usada pelo ThemeProvider.
try {
  const stored = localStorage.getItem("pixplaca-tema");
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (stored === "dark" || (stored !== "light" && systemDark)) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
} catch {
  // localStorage bloqueado: segue o claro até o React ler o sistema
}

createRoot(document.getElementById("root")!).render(<App />);
