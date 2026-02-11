import type { ElementType } from "react";
import { Box, type BoxProps } from "./Box";

type ButtonProps<C extends ElementType = "button"> = BoxProps<C> & {
  children: React.ReactNode;
}

export function Button<C extends ElementType = "button">({ children }: ButtonProps<C>) {
  return (
    <Box className="Button-root" component="button">
      {children}
    </Box>
  )
}
