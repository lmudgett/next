import { Toaster } from "react-hot-toast";
import Header from "@/components/ui/Header";
import { SideBar } from "@/components/ui/SideBar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[26rem_1fr] grid-rows-[auto_1fr] h-screen">
      <Header />
      <SideBar />
      <main className="bg-gray-50 p-[4rem_4.8rem_6.4rem] overflow-scroll">
        <div className="container">{children}</div>
      </main>
      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{ margin: "8px" }}
        toastOptions={{
          success: {
            duration: 3000,
          },
          error: {
            duration: 5000,
          },
          style: {
            fontSize: "16px",
            maxWidth: "500px",
            padding: "16px 24px",
            backgroundColor: "#374151",
            color: "#e5e7eb",
          },
        }}
      />
    </div>
  );
}
