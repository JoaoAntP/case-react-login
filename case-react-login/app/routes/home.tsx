import { redirect } from "react-router";
import { getSession, homeFor } from "~/lib/auth";

// "/" não tem tela própria: só decide para onde mandar a pessoa.
export function clientLoader() {
  const session = getSession();
  throw redirect(session ? homeFor(session.role) : "/login");
}

export default function Home() {
  return null;
}
