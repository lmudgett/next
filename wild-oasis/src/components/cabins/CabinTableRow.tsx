"use client";
import { useTransition } from "react";
import toast from "react-hot-toast";
import { Sono } from "next/font/google";
import { HiTrash, HiPencil, HiClipboard } from "react-icons/hi2";
import { formatCurrency } from "@/lib/utils";
import { CabinFormData } from "@/lib/validations/cabins";
import { ToastConfirmation } from "@/components/ui/ToastConfirmation";
import Table from "@/components/ui/Table";
import Modal from "@/components/ui/Modal";
import Menu from "@/components/ui/Menu";
import {
  deleteCabinAction,
  updateCabinAction,
} from "@/server/actions/cabins";
import { FormCabin } from "./FormCabin";

const sono = Sono({ subsets: ["latin"], weight: "600" });

type CabinTableRowProps = {
  cabin: CabinFormData;
};

export const CabinTableRow: React.FC<CabinTableRowProps> = ({ cabin }) => {
  const { id, name, maxCapacity, discount, regularPrice, imageBase64 } = cabin;
  const [isDeletePending, startDeleteTransition] = useTransition();
  const [isCopyPending, startCopyTransition] = useTransition();

  const handleDelete = () => {
    startDeleteTransition(async () => {
      if (id) {
        const res = await deleteCabinAction(id);
        console.log(res);
        if (res.success) {
          toast.success(`Cabin ${name} has been deleted`);
        } else {
          toast.error(`Sorry ${res.appError?.message}`);
        }
      }
    });
  };

  const handleCopy = () => {
    startCopyTransition(async () => {
      const res = await updateCabinAction({
        name: `${cabin.name} (COPY)`,
        maxCapacity: cabin.maxCapacity,
        regularPrice: cabin.regularPrice,
        discount: cabin.discount,
        description: cabin.description,
        imageBase64: cabin.imageBase64,
      });
      if (res.success) {
        toast.success(`Cabin ${name} has been copied`);
      } else {
        toast.error(
          `Cabin ${name} can't be copied because ${res.appError?.message}`
        );
      }
    });
  };

  return (
    <>
      <Table.Row className="table-cols-6">
        {!imageBase64 ? (
          <span className="uppercase text-[12px]">no image</span>
        ) : (
          <img
            src={imageBase64}
            className="cabin-image"
            alt={`Cabin ${name}`}
          />
        )}
        <div
          className={`text-[1.6rem] font-semibold text-gray-600 ${sono.className}`}
        >
          {name}
        </div>
        <div>Fits up to {maxCapacity} guests</div>
        <div className={`font-semibold ${sono.className}`}>
          {formatCurrency(regularPrice)}
        </div>
        <div className={`text-green-700 font-medium ${sono.className}`}>
          {!discount ? (
            <span className="uppercase text-[12px] text-black">
              no discount
            </span>
          ) : (
            formatCurrency(discount)
          )}
        </div>
        <div className="text-center space-x-2">
          {id && (
            <Menu>
              <Menu.ToggleButton id={id}>
                {(closeMenu) => (
                  <>
                    <Modal>
                      <Modal.ButtonOpen>
                        <Menu.Button icon={<HiPencil />}>Edit</Menu.Button>
                      </Modal.ButtonOpen>
                      <Modal.Window>
                        <FormCabin
                          cabin={cabin}
                          isEdit={true}
                          onFormEvent={closeMenu}
                        />
                      </Modal.Window>
                    </Modal>
                    <ToastConfirmation
                      buttonName="Confirm Copy"
                      messageBody={`Are you sure you want to copy cabin ${cabin.name}?`}
                      handleConfirm={handleCopy}
                      isPending={isCopyPending}
                    >
                      <Menu.Button icon={<HiClipboard />}>Copy</Menu.Button>
                    </ToastConfirmation>
                    <ToastConfirmation
                      buttonName="Confirm Delete"
                      messageBody={`Are you sure you want to delete cabin ${cabin.name}?`}
                      handleConfirm={handleDelete}
                      isPending={isDeletePending}
                    >
                      <Menu.Button icon={<HiTrash />}>Delete</Menu.Button>
                    </ToastConfirmation>
                  </>
                )}
              </Menu.ToggleButton>
            </Menu>
          )}
        </div>
      </Table.Row>
    </>
  );
};
