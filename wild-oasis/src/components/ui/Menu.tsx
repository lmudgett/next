import React, {
  ReactNode,
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { createPortal } from "react-dom";
import { HiEllipsisHorizontal } from "react-icons/hi2";
import { useClickOutside } from "@/hooks/useClickOutside";

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
    throw new Error("Menu.* must be used inside a <Menu> provider.");
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
  const ref = useClickOutside<HTMLUListElement>(onClose);
  const [position, setPosition] = useState<{
    top: number;
    right: number;
  } | null>(null);

  // Close on scroll (incl. the scrollable <main>) or resize so the popover
  // never floats detached from its button — like the LinkedIn "···" menu.
  useEffect(() => {
    if (!isOpen) return;
    const close = () => onClose();
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [isOpen, onClose]);

  // Measure the button and anchor the popover under its right edge when opening
  // (done in the handler so positioning never requires a setState-in-effect).
  const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (isOpen) {
      setOpenMenuIndex(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
    setOpenMenuIndex(id);
  };

  return (
    <div className="component-table-menu">
      <button
        onClick={toggle}
        className="component-table-menu-toggle"
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <HiEllipsisHorizontal size={18} />
      </button>
      {isOpen &&
        position &&
        createPortal(
          <ul
            ref={ref}
            role="menu"
            className="component-table-menu-list"
            style={{
              position: "fixed",
              top: `${position.top}px`,
              right: `${position.right}px`,
            }}
          >
            {children(onClose)}
          </ul>,
          document.body
        )}
    </div>
  );
};

const MenuButton: React.FC<MenuButtonProps> = ({ onClick, icon, children }) => {
  return (
    <li role="none">
      {onClick ? (
        <button
          role="menuitem"
          className="component-table-menu-button"
          onClick={onClick}
        >
          {icon}
          <span>{children}</span>
        </button>
      ) : (
        <span role="menuitem" className="component-table-menu-button">
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
