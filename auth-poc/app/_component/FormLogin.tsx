"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "./Button";

import { FormField } from "./FormField";
import { LoginFormData, loginSchema } from "@/domain/lib/types";

export const FormLogin = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await fetch("/api/authentication", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const res = await response.json();

      if (!res.success && res.errors) {
      } else {
        router.push("/protected");
      }
    } catch (error) {
      setError("root", {
        type: "server",
        message:
          error instanceof Error
            ? `Unexpected error occurred: ${error.message}`
            : "Unexpected error occurred",
      });
    }
    return;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormField
        id="email"
        type="text"
        label="Email: "
        register={register}
        error={errors.email}
      />
      <FormField
        id="password"
        type="password"
        label="Password: "
        register={register}
        error={errors.password}
      />

      <Button isSubmitting={isSubmitting}>login</Button>
    </form>
  );
};
