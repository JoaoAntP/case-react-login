import { redirect } from "react-router";
import { endSession } from "~/lib/auth";

// Acesso direto por URL (GET): só volta para o login.
export function clientLoader() {
  throw redirect("/login");
}

// Botões "Logout" enviam um POST para cá: encerra a sessão e volta ao login.
export function clientAction() {
  endSession();
  return redirect("/login");
}

export default function Logout() {
  return null;
}
