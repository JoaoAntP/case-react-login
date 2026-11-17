import type { Config } from "@react-router/dev/config";

export default {
  // Modo SPA: tudo roda no navegador (não há servidor).
  // O "banco de dados" desta demo é o localStorage.
  ssr: false,
} satisfies Config;
