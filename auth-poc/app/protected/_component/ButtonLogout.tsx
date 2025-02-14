"use client";
import { useRouter } from "next/navigation";

export const ButtonLogout = () => {
  const router = useRouter();

  const handleClick = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
      });

      if (response.ok) {
        router.push("/logout");
      } else {
        console.error("Failed to logout");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <button
      className="mt-2 px-4 py-2 text-white bg-lime-500 rounded-lg hover:bg-lime-600 focus:ring-2 focus:ring-lime-400 focus:outline-none "
      onClick={handleClick}
    >
      Logout
    </button>
  );
};
