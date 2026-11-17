import { Link } from "react-router";
import type { Route } from "./+types/not-found";
import { Page } from "~/components/Page";

export const meta: Route.MetaFunction = () => [{ title: "Página não encontrada" }];

export default function NotFound() {
  return (
    <Page>
      <main className="central">
        <h1>404</h1>
        <p className="subtitulo">Página não encontrada.</p>
        <Link to="/" className="bttl">
          Voltar ao início
        </Link>
      </main>
    </Page>
  );
}
