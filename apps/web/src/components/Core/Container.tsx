import { classNames } from "../../utils/components/attributes";
import { Box, type BoxProps } from "./Box";

type ContainerProps = BoxProps & {};

export function Container({
  children,
  className,
  ...boxProps
}: ContainerProps) {
  return (
    <Box className={classNames(["Container-root", className])} {...boxProps}>
      {children}
    </Box>
  );
}
