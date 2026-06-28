import React, {
  ReactNode,
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
  //ReactElement,
} from "react";
import { createPortal } from "react-dom";
import { HiEllipsisHorizontal } from "react-icons/hi2";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

type MenuContextType = {
  openMenuIndex: number | null;
  setOpenMenuIndex: (index: number | null) => void;
  onClose: () => void;
};

type MenuProps = {
  children: ReactNode;
};

type MenuToggleProps = {
  id: number;
  //children?: ReactNode;
  children: (closeMenu: () => void) => ReactNode;
};

type MenuButtonProps = {
  icon: ReactNode;
  onClick?: () => void;
  children?: ReactNode;
};

const MenuContext = createContext<MenuContextType | undefined>(undefined);

function useMenu() {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useModal must be used in a <Modal> provider.");
  }
  return context;
}

const Menu: React.FC<MenuProps> & {
  ToggleButton: React.FC<MenuToggleProps>;
  Button: React.FC<MenuButtonProps>;
} = ({ children }) => {
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const onClose = () => setOpenMenuIndex(null);

  return (
    <MenuContext.Provider value={{ openMenuIndex, setOpenMenuIndex, onClose }}>
      {children}
    </MenuContext.Provider>
  );
};

const MenuToggleButton: React.FC<MenuToggleProps> = ({ id, children }) => {
  const { openMenuIndex, setOpenMenuIndex, onClose } = useMenu();
  const isOpen = openMenuIndex === id;
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const ref = useClickOutside<HTMLUListElement>(onClose);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const closeMenu = onClose;

  useLockBodyScroll(isOpen);
  const updateMenuPosition = useCallback(() => {
    if (!isOpen || !buttonRef.current) return;
    const { bottom, left } = buttonRef.current.getBoundingClientRect();
    setMenuPosition({
      top: bottom + window.scrollY,
      left: left + window.scrollX,
    });
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) updateMenuPosition();
  }, [isOpen, updateMenuPosition]);

  return (
    <div className="component-table-menu">
      <button
        ref={buttonRef}
        onClick={(e) => {
          e.stopPropagation();
          setOpenMenuIndex(isOpen ? null : id);
        }}
        className="component-table-menu-toggle"
      >
        <HiEllipsisHorizontal size={18} />
      </button>
      {isOpen &&
        createPortal(
          <ul
            ref={ref}
            className="component-table-menu-list"
            style={{
              position: "absolute",
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`,
              visibility: menuPosition.top === 0 ? "hidden" : "visible",
            }}
          >
            {children(closeMenu)}
          </ul>,
          document.body
        )}
    </div>
  );
};

const MenuButton: React.FC<MenuButtonProps> = ({ onClick, icon, children }) => {
  return (
    <li>
      {onClick ? (
        <button className="component-table-menu-button" onClick={onClick}>
          {icon}
          <span>{children}</span>
        </button>
      ) : (
        <span className="component-table-menu-button">
          {icon}
          <span>{children}</span>
        </span>
      )}
    </li>
  );
};

Menu.ToggleButton = MenuToggleButton;
Menu.Button = MenuButton;

export default Menu;
