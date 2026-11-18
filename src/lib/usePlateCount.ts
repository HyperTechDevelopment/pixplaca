import { useEffect, useState } from "react";

// Contador local de placas baixadas. Guarda só um número — nunca chave,
// nome ou logo. ponytail: para ranking global real, este hook é o ponto
// de troca (bump passaria a chamar o backend).

const KEY = "pixplaca:placas-geradas";
const EVENT = "pixplaca:placa-gerada";

let memory = 0;

function read(): number {
  try {
    const n = Number.parseInt(localStorage.getItem(KEY) ?? "", 10);
    const valid = Number.isFinite(n) && n > 0 ? n : memory;
    memory = valid;
    return valid;
  } catch {
    return memory;
  }
}

/** Soma +1 após um download concluído. Chamado só no sucesso do export. */
export function bumpPlaca(): void {
  const next = read() + 1;
  memory = next;
  try {
    localStorage.setItem(KEY, String(next));
  } catch {
    // localStorage bloqueado: vale só para esta sessão, sem quebrar nada
  }
  window.dispatchEvent(new CustomEvent<number>(EVENT, { detail: next }));
}

export function usePlateCount(): number {
  const [count, setCount] = useState(read);
  useEffect(() => {
    setCount(read());
    const onLocal = (e: Event) => setCount((e as CustomEvent<number>).detail ?? read());
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setCount(read());
    };
    window.addEventListener(EVENT, onLocal);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(EVENT, onLocal);
      window.removeEventListener("storage", onStorage);
    };
  }, []);
  return count;
}
