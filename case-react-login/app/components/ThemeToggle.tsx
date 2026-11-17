import { useTheme } from "~/lib/theme";

/** Botão "Trocar Tema" (canto superior direito), igual ao do HTML original. */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      id="btn-trocar-tema"
      onClick={toggleTheme}
      aria-pressed={theme === "dark"}
      title={theme === "dark" ? "Tema escuro ativo" : "Tema claro ativo"}
    >
      Trocar Tema
    </button>
  );
}
