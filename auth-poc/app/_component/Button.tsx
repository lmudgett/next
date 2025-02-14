"use client";
import React from "react";

export const Button = ({
  children,
  isSubmitting,
}: {
  children: React.ReactNode;
  isSubmitting: boolean;
}) => {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="mt-2 px-4 py-2 text-white bg-lime-500 rounded-lg hover:bg-lime-600 focus:ring-2 focus:ring-lime-400 focus:outline-none "
    >
      {children}
    </button>
  );
};
