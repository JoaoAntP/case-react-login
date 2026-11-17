# Case React — Login com perfis (usuário / adm)

Sistema de login rudimentar, 100% frontend, feito com **React + React Router** (modo framework, em modo SPA).
As telas seguem o Figma e os CSS enviados (`temaclar.css` / `temaescur.css`), com **Light e Dark mode**.

## Como rodar

Precisa de Node 20 ou mais novo.

```bash
npm install
npm run dev        # abre em http://localhost:5173
```

Outros comandos: `npm run typecheck` (checa tipos) e `npm run build` (gera `build/client`).

## Contas de teste

| Username  | Senha    | Perfil  | Vai para |
| --------- | -------- | ------- | -------- |
| `admin`   | admin123 | adm     | `/admin` |
| `usuario` | user123  | usuário | `/user`  |

Quem se cadastra em `/register` vira **usuário** e entra com o **e-mail** no campo Username.

## Telas e rotas

| URL         | Tela                      | Quem acessa                                   |
| ----------- | ------------------------- | --------------------------------------------- |
| `/`         | só redireciona            | todos                                         |
| `/login`    | Login                     | quem não está logado                          |
| `/register` | Cadastro                  | quem não está logado                          |
| `/user`     | Área do usuário           | qualquer perfil logado                        |
| `/admin`    | Painel admin              | **somente adm** (usuário comum vai para /user) |
| `/logout`   | encerra a sessão          | —                                             |

No painel admin dá para ver todas as contas, alternar o perfil (usuário ⇄ adm) e excluir contas.
Não é possível mexer na própria conta nem excluir o último administrador.

## Validações

- **Login:** usuário e senha obrigatórios; credenciais erradas mostram mensagem.
- **Cadastro:** nome e sobrenome (só letras), e-mail válido e não repetido, telefone com DDD (10 a 13 dígitos), senha com 6+ caracteres e confirmação igual à senha.

## Onde mexer (um arquivo por assunto)

| Quero mudar…                         | Arquivo                      |
| ------------------------------------ | ---------------------------- |
| cores, tamanhos, aparência           | `app/app.css`                |
| regras de validação dos campos       | `app/lib/validation.ts`      |
| usuários, login, perfis, proteção    | `app/lib/auth.ts`            |
| lógica do Light/Dark                 | `app/lib/theme.tsx`          |
| tela de login / cadastro             | `app/routes/login.tsx`, `register.tsx` |
| tela do usuário / do admin           | `app/routes/user.tsx`, `admin.tsx` |
| lista de URLs                        | `app/routes.ts`              |

## Como o tema funciona

Os dois CSS originais viraram **variáveis** em `app/app.css`: o bloco `:root` é o tema claro e o bloco
`:root[data-theme="dark"]` é o escuro, com os mesmos valores dos arquivos antigos. O botão **Trocar Tema**
só alterna o atributo `data-theme` no `<html>` e salva a escolha no `localStorage`.

## Limitações (é uma demo)

- Usuários ficam no `localStorage` do navegador e a sessão no `sessionStorage`; senhas em texto puro.
  Proteção de verdade (senha com hash, sessão, perfis) exige um back-end.
- Para publicar, sirva a pasta `build/client` com fallback para `index.html` (SPA).
