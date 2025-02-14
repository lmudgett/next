import Link from "next/link";

export default function UnprotectedPage() {
  return (
    <div className="flex flex-col items-center">
      <div className="py-4 flex flex-col items-center space-y-4 border rounded-md bg-stone-700 w-2/3">
        <h1 className="font-semibold text-lime-400 uppercase">
          Unprotected Section
        </h1>
        <p>Unprotected section of the application, no token required.</p>
        <Link className="p-2 hover:underline" href="/">
          Login Page
        </Link>
      </div>
    </div>
  );
}
