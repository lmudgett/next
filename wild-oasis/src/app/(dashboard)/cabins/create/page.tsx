import type { Metadata } from "next";
import { FormCabin } from "@/components/cabins/FormCabin";

export const metadata: Metadata = { title: "New Cabin" };

export default function CreateCabinPage() {
  return (
    <>
      <div className="row-horizontal">
        <h1>New Cabin</h1>
      </div>
      <FormCabin isEdit={false} />
    </>
  );
}
