import { classNames } from "../../utils/components/attributes";
import { Box, type BoxProps } from "./Box";

export type FlexProps = BoxProps & {
  gap?: React.CSSProperties["gap"];
  alignItems?: React.CSSProperties["alignItems"];
  justifyContent?: React.CSSProperties["justifyContent"];
  flexDirection?: React.CSSProperties["flexDirection"];
};

export function Flex({
  children,
  style,
  gap,
  alignItems,
  justifyContent,
  flexDirection,
  className,
  ...boxProps
}: FlexProps) {
  const _style: React.CSSProperties = {
    gap,
    alignItems,
    justifyContent,
    flexDirection,
    ...style,
  };

  return (
    <Box
      className={classNames(["Flex-root", className])}
      style={_style}
      {...boxProps}
    >
      {children}
    </Box>
  );
}
