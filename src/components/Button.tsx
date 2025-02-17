import type { FC } from "react";
import type { ButtonProperties, ButtonVariantStyle } from "@/types/button";
import clsx from "clsx";
import Loader from "./icons/Loader";

const buttonVariants: Record<ButtonProperties["variant"], ButtonVariantStyle> = {
  default: {
    backgroundColor: "bg-button-primary",
    color: "text-white",
    hoverBackgroundColor: "hover:bg-button-primary-hover",
    cursor: "cursor-pointer",
  },

  disabled: {
    backgroundColor: "bg-button-primary/[.10]",
    color: "text-white",
    cursor: "cursor-not-allowed",
  },

  custom: {
    backgroundColor: "",
    color: "",
    hoverBackgroundColor: "",
    cursor: "",
  }
};

const Button: FC<ButtonProperties> = ({ additionalClasses, disabled = false, label, loading, type, variant, rightIcon, onClick }) => {
  const currentVariant = disabled ? "disabled" : variant;
  const { backgroundColor, color, hoverBackgroundColor, cursor } = buttonVariants[currentVariant];
  const classes = clsx(backgroundColor, color, !disabled && hoverBackgroundColor && hoverBackgroundColor, cursor, additionalClasses);

  return (
    <button className={classes} disabled={disabled} type={type} onClick={onClick}>
      {loading ? <Loader /> : label}
      {rightIcon && rightIcon}
    </button>
  );
};

export default Button;
