import { HiOutlineUser } from "react-icons/hi2";
import Table from "@/components/ui/Table";
import { formatDate } from "@/lib/utils";
import type { UserListItem } from "@/lib/validations/users";

const USER_COLS = "grid-cols-[2.4rem_1.5fr_2fr_1fr]";

type UserTableProps = {
  users: UserListItem[];
};

export const UserTable = ({ users }: UserTableProps) => (
  <Table>
    <Table.Header className={USER_COLS}>
      <div></div>
      <Table.Cell>Name</Table.Cell>
      <Table.Cell>Email</Table.Cell>
      <Table.Cell>Created</Table.Cell>
    </Table.Header>
    <Table.Body
      data={users}
      render={(user) => (
        <Table.Row className={USER_COLS} key={user.id}>
          <span className="text-indigo-500">
            <HiOutlineUser size={18} />
          </span>
          <div className="font-medium">{user.name}</div>
          <div className="text-gray-500">{user.email}</div>
          <div className="text-gray-500">{formatDate(user.createdAt)}</div>
        </Table.Row>
      )}
    />
  </Table>
);
