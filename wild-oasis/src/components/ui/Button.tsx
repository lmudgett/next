"use client";

import { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  onClick: () => void;
};

export const Button: React.FC<ButtonProps> = ({ children, onClick }) => {
  return <button onClick={onClick}>{children}</button>;
};
