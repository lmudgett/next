import { CabinTable } from "@/components/cabins/CabinTable";
import { getAllCabinsAction } from "@/server/actions/cabins";
import "./style.css";

export default async function CabinsPage() {
  const { success, cabins, message } = await getAllCabinsAction();

  return (
    <>
      <div className="row-horizontal">
        <h1>All Cabins</h1>
      </div>
      {success ? (
        <div className="row-vertical">
          <CabinTable cabins={cabins} />
        </div>
      ) : (
        <p>
          Sorry, there was a problem listing the cabins. Please contact the
          admin:
          <pre>{message}</pre>
        </p>
      )}
    </>
  );
}
