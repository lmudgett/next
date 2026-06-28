import React, { ReactNode } from "react";
import { toast, Toast } from "react-hot-toast";
import { useClickOutside } from "@/hooks/useClickOutside";

type ToastConfirmationProps = {
  buttonName: string;
  className?: string;
  messageBody?: string;
  children: ReactNode;
  isPending?: boolean;
  handleConfirm: () => void;
};

/**
 * a simple confirmation with a confirm and cancel button taking a passed function
 * @param param0
 * @returns
 */
export const ToastConfirmation = ({
  children,
  buttonName,
  className,
  isPending = false,
  messageBody = "Are you sure?",
  handleConfirm,
}: ToastConfirmationProps) => {
  const ref = useClickOutside<HTMLDivElement>(() => toast.dismiss());

  const showConfirmation = () => {
    toast.custom(
      (t: Toast) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } modal-overlay`}
        >
          <div ref={ref} className="modal-content">
            <p className="text-center pb-4">{messageBody}</p>
            <div className="text-center space-x-4">
              <button
                className="button-type-secondary py-2 px-4"
                onClick={() => toast.dismiss()}
              >
                Cancel
              </button>
              <button
                disabled={isPending}
                onClick={() => {
                  handleConfirm();
                  toast.dismiss();
                }}
                className="button-type-danger py-2 px-4"
              >
                {buttonName}
              </button>
            </div>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        removeDelay: -1,
        position: "top-center",
        ariaProps: {
          role: "status",
          "aria-live": "polite",
        },
      }
    );
  };

  return (
    <>
      <button onClick={showConfirmation} className={className}>
        {children}
      </button>
    </>
  );
};
