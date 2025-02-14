"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema, UserFormData } from "@/domain/lib/types";
import { Button } from "./Button";
import { addUserAction } from "../_action/actions";
import { FormField } from "./FormField";

export const FormUserAdd = () => {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit = async (data: UserFormData) => {
    try {
      const res = await addUserAction(data);
      if (!res.success) {
        if (res.errors) {
          Object.entries(res.errors).forEach(([key, message]) => {
            setError(key as keyof UserFormData, { type: "server", message });
          });
        }
        throw new Error("Validation failed");
      }
      reset();
    } catch (error) {
      setError("root", {
        type: "server",
        message:
          error instanceof Error
            ? `Unexpected error occurred: ${error.message}`
            : "Unexpected error occurred",
      });

      console.error("Unexpected error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {errors.root && <p className="text-red-600">{errors.root.message}</p>}
      <FormField
        id="fname"
        type="text"
        label="First Name:"
        register={register}
        error={errors.fname}
      />
      <FormField
        id="lname"
        type="text"
        label="Last Name:"
        register={register}
        error={errors.lname}
      />
      <FormField
        id="email"
        type="text"
        label="Email:"
        register={register}
        error={errors.email}
      />
      <FormField
        id="password"
        type="password"
        label="Password:"
        register={register}
        error={errors.password}
      />
      <FormField
        id="confirmPassword"
        type="password"
        label="Confirm Password:"
        register={register}
        error={errors.confirmPassword}
      />
      <Button isSubmitting={isSubmitting}>
        {isSubmitting ? "Adding..." : "Add"}
      </Button>
    </form>
  );
};
