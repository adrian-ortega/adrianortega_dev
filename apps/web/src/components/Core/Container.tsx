import { classNames } from "../../utils/components/attributes";
import { Box, type BoxProps } from "./Box";

type ContainerProps = BoxProps & {
  maxWidth?:"xs" | "sm" | "md" | "lg" | "xl";
};

export function Container({
  children,
  maxWidth,
  className,
  ...boxProps
}: ContainerProps) {
  const style = {
    "--local-max-width": maxWidth ? `var(--container-${maxWidth})` : undefined,
  }
  return (
    <Box
      className={classNames([
        "Container-root",
        maxWidth ? `Container-${maxWidth}` : undefined,
        className
      ])}
      {...boxProps}
      style={{ ...style, ...boxProps.style }}
    >
      {children}
    </Box>
  );
}
