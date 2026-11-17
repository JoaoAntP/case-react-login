// Regras de validação dos formulários. Funções puras: recebem os valores e
// devolvem um objeto de erros (vazio = tudo certo).

export type LoginValues = { username: string; password: string };
export type LoginErrors = Partial<Record<keyof LoginValues | "form", string>>;

export type RegisterValues = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};
export type RegisterErrors = Partial<
  Record<keyof RegisterValues | "form", string>
>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NAME_REGEX = /^[\p{L}][\p{L}'.-]*(?:\s+[\p{L}][\p{L}'.-]*)+$/u;
const PHONE_CHARS_REGEX = /^[\d\s()+-]+$/;

export function validateLogin(values: LoginValues): LoginErrors {
  const errors: LoginErrors = {};

  if (!values.username.trim()) {
    errors.username = "Informe o usuário.";
  }
  if (!values.password) {
    errors.password = "Informe a senha.";
  }

  return errors;
}

export function validateRegister(values: RegisterValues): RegisterErrors {
  const errors: RegisterErrors = {};

  const name = values.name.trim().replace(/\s+/g, " ");
  if (!name) {
    errors.name = "Informe seu nome completo.";
  } else if (!NAME_REGEX.test(name)) {
    errors.name = "Informe nome e sobrenome, usando apenas letras.";
  }

  const email = values.email.trim();
  if (!email) {
    errors.email = "Informe seu e-mail.";
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = "E-mail inválido. Exemplo: nome@dominio.com";
  }

  const phone = values.phone.trim();
  if (!phone) {
    errors.phone = "Informe seu telefone.";
  } else if (!PHONE_CHARS_REGEX.test(phone)) {
    errors.phone = "Use apenas números, espaços, ( ) + e -.";
  } else {
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 13) {
      errors.phone = "Telefone inválido. Use DDD + número, ex.: (21) 99999-0000.";
    }
  }

  if (!values.password) {
    errors.password = "Crie uma senha.";
  } else if (values.password.length < 6) {
    errors.password = "A senha deve ter pelo menos 6 caracteres.";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Confirme a senha.";
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "As senhas não são iguais.";
  }

  return errors;
}

export function hasErrors(errors: object): boolean {
  return Object.keys(errors).length > 0;
}
