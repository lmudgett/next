import Link from "next/link";
import { FormLogin } from "./_component/FormLogin";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <div className="py-4 flex flex-col items-center space-y-4 border rounded-md bg-stone-700 w-2/3">
        <h1 className="font-semibold text-lime-400 uppercase">
          Poc Authentication
        </h1>
        <p>
          This POC demostrates authentication with a digital ID, session
          management and access control.
        </p>
        <div>
          <span className="font-semibold text-lime-400">Resources:</span>
          <Link className="p-2 hover:underline" href="/protected">
            Protected Resource
          </Link>
          <Link className="p-2 hover:underline" href="/info">
            Unprotected Resource
          </Link>
        </div>
        <FormLogin />
      </div>
    </div>
  );
}
