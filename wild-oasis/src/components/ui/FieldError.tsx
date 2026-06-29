// Inline validation message rendered beneath a form field.
type FieldErrorProps = {
  message?: string;
};

export const FieldError = ({ message }: FieldErrorProps) =>
  message ? <p className="text-red-600 text-[1.3rem] mt-1">{message}</p> : null;
