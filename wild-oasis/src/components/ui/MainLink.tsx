"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  HiOutlineHome,
  HiOutlineCalendarDays,
  HiOutlineHomeModern,
  HiOutlineUsers,
  HiOutlineCog6Tooth,
  HiFaceFrown,
} from "react-icons/hi2";

type MainLinkProps = {
  href: string;
  iconType?: "home" | "users" | "bookings" | "settings" | "cabins";
  children: React.ReactNode;
};

export const MainLink: React.FC<MainLinkProps> = ({
  href,
  iconType = "home",
  children,
}) => {
  const pathName = usePathname(); //get the current path
  const isActive = href === pathName; // see if it matches with link
  const iconMap = {
    home: HiOutlineHome,
    users: HiOutlineUsers,
    bookings: HiOutlineCalendarDays,
    cabins: HiOutlineHomeModern,
    settings: HiOutlineCog6Tooth,
  };
  const Icon = iconMap[iconType] || HiFaceFrown; //sad face if you ask for the wrong icon

  return (
    <Link
      href={href}
      className={`group flex items-center gap-[1.2rem] text-[1.6rem] font-semibold p-[1.2rem_2.4rem] transition-all duration-300 hover:text-gray-800 hover:bg-gray-50 hover:rounded-[5px] 
        ${
          isActive ? "text-gray-800 bg-gray-50 rounded-[5px]" : "text-gray-600"
        }`}
    >
      <Icon
        className={`w-[2.4rem] h-[2.4rem] text-gray-400 transition-all duration-300 group-hover:text-indigo-800
            ${isActive ? "text-indigo-600" : "text-gray-400 "}`}
      />
      <span>{children}</span>
    </Link>
  );
};
