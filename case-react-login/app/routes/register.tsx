import { Form, Link, redirect, useNavigation } from "react-router";
import type { Route } from "./+types/register";
import { Field } from "~/components/Field";
import { Page } from "~/components/Page";
import { getSession, homeFor, registerUser } from "~/lib/auth";
import {
  hasErrors,
  validateRegister,
  type RegisterErrors,
} from "~/lib/validation";

export const meta: Route.MetaFunction = () => [{ title: "Register" }];

export function clientLoader() {
  const session = getSession();
  if (session) throw redirect(homeFor(session.role));
  return null;
}

type ActionData = {
  errors: RegisterErrors;
  values: { name: string; email: string; phone: string };
};

export async function clientAction({
  request,
}: Route.ClientActionArgs): Promise<ActionData | Response> {
  const form = await request.formData();
  const values = {
    name: String(form.get("name") ?? ""),
    email: String(form.get("email") ?? ""),
    phone: String(form.get("phone") ?? ""),
    password: String(form.get("password") ?? ""),
    confirmPassword: String(form.get("confirmPassword") ?? ""),
  };
  const keep = { name: values.name, email: values.email, phone: values.phone };

  const errors = validateRegister(values);
  if (hasErrors(errors)) return { errors, values: keep };

  const result = registerUser(values);
  if (!result.ok) {
    return { errors: { [result.field]: result.message }, values: keep };
  }

  return redirect("/login?cadastro=ok");
}

export default function Register({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const enviando = navigation.state === "submitting";
  const errors = actionData?.errors ?? {};
  const values = actionData?.values;

  return (
    <Page>
      <main className="central">
        <h1>Register</h1>

        <Form method="post" noValidate>
          <Field
            label="Full Name"
            name="name"
            autoComplete="name"
            defaultValue={values?.name}
            error={errors.name}
          />
          <Field
            label="E-mail"
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={values?.email}
            error={errors.email}
          />
          <Field
            label="Phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            defaultValue={values?.phone}
            error={errors.phone}
          />
          <Field
            label="Password"
            name="password"
            type="password"
            autoComplete="new-password"
            error={errors.password}
          />
          <Field
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            error={errors.confirmPassword}
          />

          <button type="submit" className="registrar" disabled={enviando}>
            {enviando ? "Registrando…" : "Register"}
          </button>
          <Link to="/login" className="bttl">
            Have account? Sign In
          </Link>
        </Form>
      </main>
    </Page>
  );
}
