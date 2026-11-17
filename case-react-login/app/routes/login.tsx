import { Form, Link, redirect, useNavigation, useSearchParams } from "react-router";
import type { Route } from "./+types/login";
import { Field } from "~/components/Field";
import { Page } from "~/components/Page";
import { authenticate, getSession, homeFor, startSession } from "~/lib/auth";
import { hasErrors, validateLogin, type LoginErrors } from "~/lib/validation";

export const meta: Route.MetaFunction = () => [{ title: "Login" }];

// Quem já está logado não precisa ver a tela de login.
export function clientLoader() {
  const session = getSession();
  if (session) throw redirect(homeFor(session.role));
  return null;
}

type ActionData = { errors: LoginErrors; values: { username: string } };

// Roda no navegador quando o formulário é enviado.
export async function clientAction({
  request,
}: Route.ClientActionArgs): Promise<ActionData | Response> {
  const form = await request.formData();
  const username = String(form.get("username") ?? "");
  const password = String(form.get("password") ?? "");

  const errors = validateLogin({ username, password });
  if (hasErrors(errors)) return { errors, values: { username } };

  const user = authenticate(username, password);
  if (!user) {
    return {
      errors: { form: "Usuário ou senha incorretos." },
      values: { username },
    };
  }

  startSession(user.id);
  return redirect(homeFor(user.role)); // adm -> /admin, usuário -> /user
}

export default function Login({ actionData }: Route.ComponentProps) {
  const [params] = useSearchParams();
  const navigation = useNavigation();
  const enviando = navigation.state === "submitting";
  const errors = actionData?.errors ?? {};

  return (
    <Page>
      <main className="central">
        <h1>Login</h1>

        {params.get("cadastro") === "ok" && (
          <p className="aviso" role="status">
            Conta criada! Faça login para continuar.
          </p>
        )}

        <Form method="post" noValidate>
          {errors.form && (
            <p className="erro erro-form" role="alert">
              {errors.form}
            </p>
          )}

          <Field
            label="Username"
            name="username"
            autoComplete="username"
            defaultValue={actionData?.values.username}
            error={errors.username}
          />
          <Field
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            error={errors.password}
          />

          <button type="submit" className="login" disabled={enviando}>
            {enviando ? "Entrando…" : "Login"}
          </button>
        </Form>


      
      </main>
    </Page>
  );
}
