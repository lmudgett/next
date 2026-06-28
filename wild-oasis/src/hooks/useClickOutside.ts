import { useEffect, useRef, useCallback } from "react";

const outsideClickStack: HTMLElement[] = [];

export function useClickOutside<T extends HTMLElement>(callback: () => void) {
  const ref = useRef<T | null>(null);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (!ref.current || !outsideClickStack.includes(ref.current)) {
        return;
      }

      const index = outsideClickStack.indexOf(ref.current);

      for (let i = outsideClickStack.length - 1; i >= index; i--) {
        if (outsideClickStack[i].contains(event.target as Node)) {
          return;
        } else {
          callback();
        }
      }

      outsideClickStack.splice(index, 1);
    },
    [callback]
  );

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current; // Store ref value to avoid issues in cleanup
    outsideClickStack.push(element);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      const index = outsideClickStack.indexOf(element);
      if (index !== -1) {
        outsideClickStack.splice(index, 1);
      }
    };
  }, [handleClickOutside]);

  return ref;
}
