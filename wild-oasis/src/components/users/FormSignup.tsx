"use client";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { signupSchema, SignupFormData } from "@/lib/validations/users";
import { signupAction } from "@/server/actions/users";

export const FormSignup = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: SignupFormData) => {
    const res = await signupAction(data);
    if (res.success) {
      toast.success(`User "${data.name}" created`);
      reset();
    } else {
      toast.error(`Unable to create user: ${res.appError?.message ?? ""}`);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormField
        label="Full name"
        id="name"
        type="text"
        register={register}
        error={errors.name}
      />
      <FormField
        label="Email address"
        id="email"
        type="email"
        register={register}
        error={errors.email}
      />
      <FormField
        label="Password (min 8 characters)"
        id="password"
        type="password"
        register={register}
        error={errors.password}
      />
      <FormField
        label="Repeat password"
        id="passwordConfirm"
        type="password"
        register={register}
        error={errors.passwordConfirm}
      />
      <div className="form-row">
        <Button variant="secondary" type="reset" onClick={() => reset()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating…" : "Create new user"}
        </Button>
      </div>
    </form>
  );
};
