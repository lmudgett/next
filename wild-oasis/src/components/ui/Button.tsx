import { ComponentProps } from "react";

export type ButtonVariant = "primary" | "secondary" | "danger";
export type ButtonSize = "small" | "medium" | "large" | "table";

// The variant/size classes are hand-written utilities in globals.css, so
// building the class names dynamically is safe (they're never purged).
export const buttonClasses = (
  variant: ButtonVariant = "primary",
  size: ButtonSize = "medium",
  className = ""
) => `button-type-${variant} size-${size}-button ${className}`.trim();

type ButtonProps = ComponentProps<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export const Button = ({
  variant = "primary",
  size = "medium",
  className = "",
  type = "button",
  ...props
}: ButtonProps) => (
  <button
    type={type}
    className={buttonClasses(variant, size, className)}
    {...props}
  />
);
