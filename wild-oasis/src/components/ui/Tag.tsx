import { ReactNode } from "react";

// Small uppercase status pill. The caller supplies the colour classes so the
// same shape can render booking statuses, activity tags, etc.
type TagProps = {
  className?: string;
  children: ReactNode;
};

export const Tag = ({ className = "", children }: TagProps) => (
  <span
    className={`inline-block uppercase text-[1.1rem] font-semibold px-3 py-1 rounded-full ${className}`}
  >
    {children}
  </span>
);
