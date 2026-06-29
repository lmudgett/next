"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/lib/validations/auth";
import { loginAction } from "@/server/actions/auth";
import { Button } from "@/components/ui/Button";
import { FieldError } from "@/components/ui/FieldError";

export const LoginForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormData) => {
    const res = await loginAction(data);
    if (res.success) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setError("root", {
        message: res.appError?.message ?? "Unable to sign in",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 bg-transparent border-0 p-0 shadow-none"
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="font-medium text-gray-600">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className="w-full"
          {...register("email")}
        />
        <FieldError message={errors.email?.message} />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="font-medium text-gray-600">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          className="w-full"
          {...register("password")}
        />
        <FieldError message={errors.password?.message} />
      </div>

      <FieldError message={errors.root?.message} />

      <Button type="submit" disabled={isSubmitting} className="text-center">
        {isSubmitting ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
};
