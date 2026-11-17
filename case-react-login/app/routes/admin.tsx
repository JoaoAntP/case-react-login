import { Form, Link } from "react-router";
import type { Route } from "./+types/admin";
import { Page } from "~/components/Page";
import { deleteUser, listUsers, requireRole, toggleRole } from "~/lib/auth";

export const meta: Route.MetaFunction = () => [{ title: "Admin" }];

// Protegida: só o perfil "adm" entra. Usuário comum é mandado para /user.
export function clientLoader() {
  const me = requireRole("adm");
  return { me, users: listUsers() };
}

// Ações do painel (excluir usuário / alternar perfil). Revalida o perfil antes.
export async function clientAction({ request }: Route.ClientActionArgs) {
  const me = requireRole("adm");
  const form = await request.formData();
  const intent = String(form.get("intent") ?? "");
  const userId = String(form.get("userId") ?? "");

  let erro: string | null = null;
  if (intent === "delete") erro = deleteUser(me.id, userId);
  else if (intent === "toggle-role") erro = toggleRole(me.id, userId);
  else erro = "Ação desconhecida.";

  return { erro };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR");
}

export default function Admin({ loaderData, actionData }: Route.ComponentProps) {
  const { me, users } = loaderData;
  const admins = users.filter((u) => u.role === "adm").length;

  return (
    <Page>
      <main className="central larga">
        <h1>Admin</h1>
        <p className="subtitulo">
          Logado como <strong>{me.name}</strong>{" "}
          <span className="selo selo-adm">adm</span>
        </p>

        <div className="resumo">
          <div>
            <strong>{users.length}</strong>
            <span>Contas</span>
          </div>
          <div>
            <strong>{admins}</strong>
            <span>Administradores</span>
          </div>
          <div>
            <strong>{users.length - admins}</strong>
            <span>Usuários</span>
          </div>
        </div>

        {actionData?.erro && (
          <p className="erro erro-form" role="alert">
            {actionData.erro}
          </p>
        )}

        <div className="tabela-wrap">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Telefone</th>
                <th>Perfil</th>
                <th>Cadastro</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isMe = u.id === me.id;
                return (
                  <tr key={u.id}>
                    <td>
                      {u.name}
                      {isMe && " (você)"}
                    </td>
                    <td>{u.email}</td>
                    <td>{u.phone}</td>
                    <td>
                      <span
                        className={`selo ${u.role === "adm" ? "selo-adm" : "selo-user"}`}
                      >
                        {u.role === "adm" ? "adm" : "usuário"}
                      </span>
                    </td>
                    <td>{formatDate(u.createdAt)}</td>
                    <td>
                      <div className="acoes">
                        <Form method="post">
                          <input type="hidden" name="userId" value={u.id} />
                          <button
                            type="submit"
                            name="intent"
                            value="toggle-role"
                            className="acao"
                            disabled={isMe}
                          >
                            {u.role === "adm" ? "Tornar usuário" : "Tornar adm"}
                          </button>
                        </Form>
                        <Form
                          method="post"
                          onSubmit={(e) => {
                            if (!window.confirm(`Excluir a conta de ${u.name}?`)) {
                              e.preventDefault();
                            }
                          }}
                        >
                          <input type="hidden" name="userId" value={u.id} />
                          <button
                            type="submit"
                            name="intent"
                            value="delete"
                            className="acao perigo"
                            disabled={isMe}
                          >
                            Excluir
                          </button>
                        </Form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <Link to="/user" className="bttl">
          Ver minha área de usuário
        </Link>
        <Form method="post" action="/logout">
          <button type="submit" className="login">
            Logout
          </button>
        </Form>
      </main>
    </Page>
  );
}
