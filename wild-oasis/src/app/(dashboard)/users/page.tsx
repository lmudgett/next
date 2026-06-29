import { Suspense } from "react";
import type { Metadata } from "next";
import { FormSignup } from "@/components/users/FormSignup";
import { UserTable } from "@/components/users/UserTable";
import { getAllUsersAction } from "@/server/actions/users";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { ErrorMessage } from "@/components/ui/ErrorMessage";

export const metadata: Metadata = {
  title: "Users",
  description: "Create and review hotel staff accounts.",
};

// Render dynamically so the user list streams fresh on each request.
export const dynamic = "force-dynamic";

async function UsersList() {
  const { success, users, message } = await getAllUsersAction();

  if (!success) {
    return <ErrorMessage resource="users" message={message} />;
  }

  return <UserTable users={users ?? []} />;
}

export default function UsersPage() {
  return (
    <>
      <div className="row-horizontal">
        <h1>Create a new user</h1>
      </div>

      <FormSignup />

      <div className="row-vertical">
        <h2>Existing users</h2>
        <Suspense fallback={<TableSkeleton rows={3} columns={4} />}>
          <UsersList />
        </Suspense>
      </div>
    </>
  );
}
