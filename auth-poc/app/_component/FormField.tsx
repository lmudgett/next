import {
  UseFormRegister,
  FieldError,
  FieldValues,
  Path,
} from "react-hook-form";

type FormFieldProps<T extends FieldValues> = {
  id: Path<T>;
  type: string;
  label: string;
  register: UseFormRegister<T>;
  error?: FieldError;
};

export const FormField = <T extends FieldValues>({
  id,
  type,
  label,
  register,
  error,
}: FormFieldProps<T>) => {
  return (
    <>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <input
        className="w-full p-2 border text-lime-950 border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:outline-none"
        type={type}
        id={id as string}
        {...register(id)}
      />
      {error && <p className="text-red-600">{error.message}</p>}
    </>
  );
};
