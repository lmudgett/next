"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/lib/validations/auth";
import { loginAction } from "@/server/actions/auth";

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
        {errors.email && (
          <p className="text-red-600 text-[1.3rem]">{errors.email.message}</p>
        )}
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
        {errors.password && (
          <p className="text-red-600 text-[1.3rem]">{errors.password.message}</p>
        )}
      </div>

      {errors.root && (
        <p className="text-red-600 text-[1.3rem]">{errors.root.message}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="button-type-primary size-medium-button text-center"
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
};
