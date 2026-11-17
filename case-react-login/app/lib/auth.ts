import { redirect } from "react-router";

// ---------------------------------------------------------------------------
// "Back-end de mentirinha" para a demo: usuários ficam no localStorage e a
// sessão no sessionStorage. NÃO é seguro (senhas em texto puro, tudo editável
// no navegador). Num projeto real, isso fica num servidor.
// ---------------------------------------------------------------------------

export type Role = "user" | "adm";

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  role: Role;
  createdAt: string;
}

/** Usuário sem a senha — é o que as telas recebem. */
export type PublicUser = Omit<User, "password">;

const USERS_KEY = "case-react:users";
const SESSION_KEY = "case-react:session";

// Contas de teste criadas na primeira execução.
const SEED_USERS: User[] = [
  {
    id: "seed-admin",
    name: "Administrador",
    username: "admin",
    email: "admin@exemplo.com",
    phone: "(21) 99999-0000",
    password: "admin123",
    role: "adm",
    createdAt: "2026-01-01T12:00:00.000Z",
  },
  {
    id: "seed-usuario",
    name: "Usuário Teste",
    username: "usuario",
    email: "usuario@exemplo.com",
    phone: "(21) 98888-0000",
    password: "user123",
    role: "user",
    createdAt: "2026-01-01T12:00:00.000Z",
  },
];

// ----------------------------- armazenamento -------------------------------

function writeUsers(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function readUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as User[];
    }
  } catch {
    // JSON corrompido: cai no reset abaixo.
  }
  writeUsers(SEED_USERS);
  return [...SEED_USERS];
}

function toPublic(user: User): PublicUser {
  const { password: _password, ...rest } = user;
  return rest;
}

// -------------------------------- consultas --------------------------------

export function listUsers(): PublicUser[] {
  return readUsers().map(toPublic);
}

/** Aceita o username OU o e-mail no campo "Username". */
export function authenticate(
  identifier: string,
  password: string,
): PublicUser | null {
  const id = identifier.trim().toLowerCase();
  const found = readUsers().find(
    (u) =>
      (u.username.toLowerCase() === id || u.email.toLowerCase() === id) &&
      u.password === password,
  );
  return found ? toPublic(found) : null;
}

export type RegisterResult =
  | { ok: true }
  | { ok: false; field: "email"; message: string };

export function registerUser(data: {
  name: string;
  email: string;
  phone: string;
  password: string;
}): RegisterResult {
  const users = readUsers();
  const email = data.email.trim().toLowerCase();

  if (users.some((u) => u.email.toLowerCase() === email || u.username === email)) {
    return { ok: false, field: "email", message: "Este e-mail já está cadastrado." };
  }

  users.push({
    id: crypto.randomUUID(),
    name: data.name.trim().replace(/\s+/g, " "),
    username: email, // quem se cadastra faz login com o e-mail
    email,
    phone: data.phone.trim(),
    password: data.password,
    role: "user", // todo cadastro novo nasce como usuário comum
    createdAt: new Date().toISOString(),
  });
  writeUsers(users);
  return { ok: true };
}

// --------------------------------- sessão ----------------------------------

export function startSession(userId: string): void {
  sessionStorage.setItem(SESSION_KEY, userId);
}

export function endSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

/** Usuário logado (ou null). O perfil é sempre lido do cadastro atual. */
export function getSession(): PublicUser | null {
  const userId = sessionStorage.getItem(SESSION_KEY);
  if (!userId) return null;
  const user = readUsers().find((u) => u.id === userId);
  return user ? toPublic(user) : null;
}

export function homeFor(role: Role): string {
  return role === "adm" ? "/admin" : "/user";
}

// --------------------- proteção de rotas (usadas nos loaders) --------------

/** Exige login; sem sessão, manda para /login. */
export function requireSession(): PublicUser {
  const session = getSession();
  if (!session) {
    endSession();
    throw redirect("/login");
  }
  return session;
}

/** Exige um perfil específico; perfil errado é redirecionado para a sua tela. */
export function requireRole(role: Role): PublicUser {
  const session = requireSession();
  if (session.role !== role) throw redirect(homeFor(session.role));
  return session;
}

// --------------------------- ações do painel admin -------------------------

/** Retorna uma mensagem de erro, ou null se deu certo. */
export function deleteUser(actingId: string, targetId: string): string | null {
  if (actingId === targetId) return "Você não pode excluir a própria conta.";

  const users = readUsers();
  const target = users.find((u) => u.id === targetId);
  if (!target) return "Usuário não encontrado.";

  const admins = users.filter((u) => u.role === "adm").length;
  if (target.role === "adm" && admins <= 1) {
    return "Não é possível excluir o último administrador.";
  }

  writeUsers(users.filter((u) => u.id !== targetId));
  return null;
}

/** Alterna entre "user" e "adm". Retorna mensagem de erro ou null. */
export function toggleRole(actingId: string, targetId: string): string | null {
  if (actingId === targetId) return "Você não pode alterar o seu próprio perfil.";

  const users = readUsers();
  const target = users.find((u) => u.id === targetId);
  if (!target) return "Usuário não encontrado.";

  target.role = target.role === "adm" ? "user" : "adm";
  writeUsers(users);
  return null;
}
