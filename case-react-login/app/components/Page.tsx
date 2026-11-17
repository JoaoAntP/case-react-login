import type { ReactNode } from "react";
import { ThemeToggle } from "./ThemeToggle";

/** Moldura comum das telas: fundo da página, centralização e botão de tema. */
export function Page({ children }: { children: ReactNode }) {
  return (
    <div className="pagina">
      <ThemeToggle />
      {children}
    </div>
  );
}
