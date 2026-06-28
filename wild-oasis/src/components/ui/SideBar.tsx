import Image from "next/image";
import { MainLink } from "./MainLink";
import logo from "../../../public/img/logo-light.png";

export const SideBar = () => {
  return (
    <aside className="p-[3.2rem_2.4rem] flex flex-col row-span-full gap-[3.2rem] border-r border-gray-100">
      <div className="px-[3.80rem] pb-3">
        <Image
          src={logo}
          className="h-[9.6rem] w-auto"
          alt="Next Wild Oasis Logo"
        />
      </div>
      <nav>
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
    </aside>
  );
};
