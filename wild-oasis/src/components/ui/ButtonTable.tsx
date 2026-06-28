"use client";

import { HiPencil, HiTrash, HiClipboardCopy } from "react-icons/hi";

type ButtonTableProps = {
  isPending?: boolean;
  onHandle: () => void;
  type: "edit" | "delete" | "copy";
};

export const ButtonTable = ({
  type,
  isPending,
  onHandle,
}: ButtonTableProps) => {
  const renderIcon = () => {
    switch (type) {
      case "edit":
        return <HiPencil />;
      case "delete":
        return <HiTrash />;
      case "copy":
        return <HiClipboardCopy />;
      default:
        return null;
    }
  };

  return (
    <button
      className="button-type-primary size-small-button"
      onClick={onHandle}
      disabled={isPending}
    >
      {renderIcon()}
    </button>
  );
};
