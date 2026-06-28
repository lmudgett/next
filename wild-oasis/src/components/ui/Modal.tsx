"use client";
import React, {
  createContext,
  ReactNode,
  useState,
  useContext,
  useEffect,
  ReactElement,
} from "react";
import { createPortal } from "react-dom";
import { HiXMark } from "react-icons/hi2";
import { useClickOutside } from "@/hooks/useClickOutside";

type ModalContextType = {
  onClose: () => void;
  isOpen: boolean;
};

type ModalProps = {
  children: ReactNode;
};

type ModalButtonProps = {
  children: ReactNode;
  className?: string;
};

type ModalComponent = React.FC<ModalProps> & {
  ButtonOpen: React.FC<ModalButtonProps>;
  Window: React.FC<ModalWindowProps>;
};

type ModalWindowProps = {
  children: ReactElement<{ onClose?: () => void }>;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used in a <Modal> provider.");
  }
  return context;
}

const Modal: ModalComponent = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => setIsOpen(!isOpen);

  return (
    <ModalContext.Provider value={{ onClose, isOpen }}>
      {children}
    </ModalContext.Provider>
  );
};

const ModalButtonOpen: React.FC<ModalButtonProps> = ({
  className = "",
  children,
}) => {
  const { onClose } = useModal();
  return (
    <button className={className} onClick={onClose}>
      {children}
    </button>
  );
};

const ModalWindow: React.FC<ModalWindowProps> = ({ children }) => {
  const { isOpen, onClose } = useModal();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const ref = useClickOutside<HTMLDivElement>(onClose);

  return (
    <>
      {isOpen &&
        createPortal(
          <div className="modal-overlay">
            <div ref={ref} className="modal-content">
              <button className="modal-button-close" onClick={onClose}>
                <HiXMark />
              </button>
              <div>{React.cloneElement(children, { onClose })}</div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

Modal.ButtonOpen = ModalButtonOpen;
Modal.Window = ModalWindow;

export default Modal;
