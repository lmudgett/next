import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-lg border border-gray-100 shadow-sm p-8 flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-[2.4rem] font-semibold text-gray-700">
            The Wild Oasis
          </h1>
          <p className="text-gray-500">Sign in to manage cabins &amp; bookings</p>
        </div>
        <LoginForm />
        <p className="text-[1.3rem] text-gray-500 text-center border-t border-gray-100 pt-4">
          Demo login — <strong>admin@thewildoasis.com</strong> /{" "}
          <strong>password123</strong>
        </p>
      </div>
    </div>
  );
}
