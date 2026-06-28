import { useEffect, RefObject } from "react";

// NOTE: currently unused — preserved during the structural refactor (Q5).
// Prune if it stays unreferenced.
export function useScrollWindow<T extends HTMLElement>(
  ref: RefObject<T>,
  onClose: () => void
) {
  useEffect(() => {
    function handleScrollWindow(event: WheelEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener("wheel", handleScrollWindow);
    return () => document.removeEventListener("wheel", handleScrollWindow);
  }, [ref, onClose]);
}
