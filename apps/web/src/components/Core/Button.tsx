import type { ElementType } from "react";
import { Box, type BoxProps } from "./Box";
import { classNames } from "../../utils/components/attributes";

export type ButtonVariant = "default" | "filled" | "outline" | "subtle";
export type ButtonColor = "default" | "primary" | "secondary";

type ButtonProps<C extends ElementType = "button"> = BoxProps<C> & {
  variant?: ButtonVariant;
  color?: ButtonColor;
  children: React.ReactNode;
}

export function Button<C extends ElementType = "button">({
  children,
  variant = "filled",
  color = "primary",
  disabled,
  onClick
}: ButtonProps<C>) {
  const variantName = variant || "default";
  const colorName = color || "default";

  return (
    <Box
      className={classNames([
        "Button-root",
        variantName !== "default" ? `Button-${variantName}` : undefined,
        colorName !== "default" ? `Button-${colorName}` : undefined,
      ])}
      component="button"
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </Box>
  );
}
