type FieldProps = {
  label: string;
  name: string;
  type?: "text" | "email" | "tel" | "password";
  autoComplete?: string;
  defaultValue?: string;
  error?: string;
};

/** Campo do formulário: rótulo + input + mensagem de erro acessível. */
export function Field({
  label,
  name,
  type = "text",
  autoComplete,
  defaultValue,
  error,
}: FieldProps) {
  const inputId = `campo-${name}`;
  const errorId = `${inputId}-erro`;

  return (
    <div className="campo">
      <label htmlFor={inputId}>{label}</label>
      <input
        id={inputId}
        name={name}
        type={type}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
      />
      {error && (
        <span id={errorId} className="erro" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
