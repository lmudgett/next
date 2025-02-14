import { FormUserAdd } from "../_component/FormUserAdd";

export default function UserPage() {
  return (
    <div className="flex flex-col items-center">
      <div className="py-4 px-4 flex flex-col items-center space-y-4 border rounded-md bg-stone-700 w-2/3">
        <h1 className="font-semibold text-lime-400">Add User</h1>
        <FormUserAdd />
      </div>
    </div>
  );
}
