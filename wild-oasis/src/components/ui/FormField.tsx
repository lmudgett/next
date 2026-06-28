import { UseFormRegister, FieldValues, Path } from "react-hook-form";

type FormFieldProps<T extends FieldValues> = {
  id: Path<T>;
  type: string;
  label: string;
  value?: string;
  register: UseFormRegister<T>;
  // Accepts both a leaf FieldError and RHF's nested-error union; we only render
  // the message. (Coerced/preprocessed fields surface the nested shape.)
  error?: { message?: string };
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
};

export const FormField = <T extends FieldValues>({
  id,
  type,
  label,
  value,
  register,
  error,
  onBlur,
}: FormFieldProps<T>) => {
  return (
    <div className="form-row">
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        value={value}
        id={id as string}
        {...register(id, {
          setValueAs: (v) =>
            type === "number" ? (v === "" ? null : Number(v)) : v,
        })}
        onBlur={onBlur}
      />
      {error && <p className="text-red-600">{error.message}</p>}
    </div>
  );
};
