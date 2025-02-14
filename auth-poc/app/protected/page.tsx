import { ButtonLogout } from "./_component/ButtonLogout";

export default function ProtectedPage() {
  return (
    <div className="flex flex-col items-center">
      <div className="py-4 flex flex-col items-center space-y-4 border rounded-md bg-stone-700 w-2/3">
        <h1 className="font-semibold text-lime-400 uppercase">
          Protected Area
        </h1>
        <p>
          you have been authenticated and have a valid session for 5 minuets
        </p>
        <ButtonLogout />
      </div>
    </div>
  );
}
