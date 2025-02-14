import Link from "next/link";

export default function AccessDeniedPage() {
  return (
    <div className="flex flex-col items-center">
      <div className="py-4 flex flex-col items-center space-y-4 border rounded-md bg-stone-700 w-2/3">
        <h1 className="font-semibold text-red-600 uppercase">Access Denied</h1>
        <p>
          You have attempted to access a protected resource, please login and
          try again!
        </p>
        <Link className="p-2 hover:underline" href="/">
          Login Page
        </Link>
      </div>
    </div>
  );
}
