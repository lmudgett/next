import { HiOutlineUser } from "react-icons/hi2";
import { getSession } from "@/server/auth";

export default async function Header() {
  const session = await getSession();

  return (
    <header className="col-start-2 row-start-1 bg-white py-[1.2rem] px-[4.8rem] border-b border-solid border-gray-100 flex items-center justify-between">
      <span className="text-[1.4rem] font-medium text-gray-500 tracking-wide">
        The Wild Oasis
      </span>

      {session && (
        <div className="flex items-center gap-3 text-gray-600">
          <span className="flex items-center justify-center h-[3.6rem] w-[3.6rem] rounded-full bg-indigo-50 text-indigo-600">
            <HiOutlineUser size={20} />
          </span>
          <span className="text-[1.4rem] font-medium">{session.name}</span>
        </div>
      )}
    </header>
  );
}
