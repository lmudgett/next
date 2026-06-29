import Image from "next/image";
import { HiArrowRightOnRectangle } from "react-icons/hi2";
import { MainLink } from "./MainLink";
import { getSession } from "@/server/auth";
import { logoutAction } from "@/server/actions/auth";
import logo from "../../../public/img/logo-light.png";

export const SideBar = async () => {
  const session = await getSession();

  return (
    <aside className="col-start-1 row-span-full p-[3.2rem_2.4rem] flex flex-col gap-[3.2rem] border-r border-gray-100">
      <div className="px-[3.80rem] pb-3">
        <Image
          src={logo}
          className="h-[9.6rem] w-auto"
          alt="Next Wild Oasis Logo"
        />
      </div>
      <nav className="flex-1">
        <ul className="flex flex-col gap-[0.8rem]">
          <li>
            <MainLink href="/dashboard">Home</MainLink>
          </li>
          <li>
            <MainLink href="/bookings" iconType="bookings">
              Bookings
            </MainLink>
          </li>
          <li>
            <MainLink href="/cabins" iconType="cabins">
              Cabins
            </MainLink>
          </li>
          <li>
            <MainLink href="/users" iconType="users">
              Users
            </MainLink>
          </li>
          <li>
            <MainLink href="/settings" iconType="settings">
              Settings
            </MainLink>
          </li>
        </ul>
      </nav>

      <div className="border-t border-gray-100 pt-4 flex flex-col gap-2">
        {session && (
          <p className="text-[1.3rem] text-gray-500">
            Signed in as <span className="font-medium">{session.name}</span>
          </p>
        )}
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
          >
            <HiArrowRightOnRectangle size={20} />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
};
