import { Form, Link } from "react-router";
import type { Route } from "./+types/user";
import { Page } from "~/components/Page";
import { requireSession } from "~/lib/auth";

export const meta: Route.MetaFunction = () => [{ title: "Área do usuário" }];

// Protegida: sem login, redireciona para /login.
export function clientLoader() {
  return { me: requireSession() };
}

export default function User({ loaderData }: Route.ComponentProps) {
  const { me } = loaderData;

  return (
    <Page>
      <main className="central">
        <h1>Olá, {me.name.split(" ")[0]}!</h1>
        <p className="subtitulo">
          <span className={`selo ${me.role === "adm" ? "selo-adm" : "selo-user"}`}>
            {me.role === "adm" ? "adm" : "usuário"}
          </span>
        </p>

        <dl className="dados">
          <div>
            <dt>Nome</dt>
            <dd>{me.name}</dd>
          </div>
          <div>
            <dt>E-mail</dt>
            <dd>{me.email}</dd>
          </div>
          <div>
            <dt>Telefone</dt>
            <dd>{me.phone}</dd>
          </div>
        </dl>

        {me.role === "adm" && (
          <Link to="/admin" className="bttl">
            Ir para o painel admin
          </Link>
        )}

        <Form method="post" action="/logout">
          <button type="submit" className="login">
            Logout
          </button>
        </Form>
      </main>
    </Page>
  );
}
