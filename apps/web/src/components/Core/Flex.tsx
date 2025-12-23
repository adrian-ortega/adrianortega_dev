import * as React from "react";
import { classNames } from "../../utils/components/attributes";
import { Box, type BoxProps } from "./Box";

export type FlexOwnProps = {
  gap?: React.CSSProperties["gap"];
  alignItems?: React.CSSProperties["alignItems"];
  justifyContent?: React.CSSProperties["justifyContent"];
  flexDirection?: React.CSSProperties["flexDirection"];
};

export type FlexProps<C extends React.ElementType = "div"> = BoxProps<C> &
  FlexOwnProps;

export function Flex<C extends React.ElementType = "div">({
  children,
  style,
  gap,
  alignItems,
  justifyContent,
  flexDirection,
  className,
  ...boxProps
}: FlexProps<C>) {
  const _style: React.CSSProperties = {
    display: "flex",
    gap,
    alignItems,
    justifyContent,
    flexDirection,
    ...style,
  };

  return (
    <Box<C>
      className={classNames(["Flex-root", className])}
      style={_style}
      {...(boxProps as BoxProps<C>)}
    >
      {children}
    </Box>
  );
}
