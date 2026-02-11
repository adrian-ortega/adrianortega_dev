import * as React from "react";
import { classNames } from "../../utils/components/attributes";
import { Box, type BoxProps } from "./Box";

export type FlexOwnProps = {
  gap?: React.CSSProperties["gap"];
  alignItems?: React.CSSProperties["alignItems"];
  justifyContent?: React.CSSProperties["justifyContent"];
  flexDirection?: React.CSSProperties["flexDirection"];
  grow?: React.CSSProperties["flexGrow"] | boolean;
  shrink?: React.CSSProperties["flexShrink"] | boolean;
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
  grow,
  shrink,
  ...boxProps
}: FlexProps<C>) {
  const _style: React.CSSProperties = {
    gap,
    alignItems,
    justifyContent,
    flexDirection,
    ...style,
  };

  if (grow) {
    _style.flexGrow = (typeof grow === "boolean" && grow) ? 1 : grow;
  }

  if (shrink) {
    _style.flexShrink = (typeof shrink === "boolean" && shrink) ? 1 : shrink;
  }

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
