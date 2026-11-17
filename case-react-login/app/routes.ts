import { type RouteConfig, index, route } from "@react-router/dev/routes";

// Mapa de URLs -> arquivos de tela.
export default [
  index("routes/home.tsx"), // "/"        -> redireciona conforme o login
  route("login", "routes/login.tsx"), // "/login"
  route("register", "routes/register.tsx"), // "/register"
  route("user", "routes/user.tsx"), // "/user"   (qualquer perfil logado)
  route("admin", "routes/admin.tsx"), // "/admin"  (somente perfil adm)
  route("logout", "routes/logout.tsx"), // "/logout" (encerra a sessão)
  route("*", "routes/not-found.tsx"), // qualquer outra URL
] satisfies RouteConfig;
