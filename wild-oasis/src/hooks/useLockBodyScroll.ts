import { useEffect } from "react";

export function useLockBodyScroll(isLocked: boolean) {
  useEffect(() => {
    const mainElement = document.querySelector("main");

    mainElement?.style.setProperty("overflow", isLocked ? "hidden" : "scroll");

    if (isLocked) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      document.documentElement.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      document.documentElement.style.overflow = "";
      mainElement?.style.setProperty("overflow", "scroll");
    };
  }, [isLocked]);
}
