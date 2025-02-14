import Link from "next/link";

export default function LogoutPage() {
  return (
    <div className="flex flex-col items-center">
      <div className="py-4 flex flex-col items-center space-y-4 border rounded-md bg-stone-700 w-2/3">
        <h1 className="font-semibold text-lime-400 uppercase">logged Out</h1>
        <p>
          You have been logged out! Click on the Login link below to continue.
        </p>
        <Link className="p-2 hover:underline" href="/">
          Login Page
        </Link>
      </div>
    </div>
  );
}
