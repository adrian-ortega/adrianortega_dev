import * as React from "react";
import { classNames } from "../../utils/components/attributes";
import { Flex, type FlexProps } from "./Flex";

export type GroupProps<C extends React.ElementType = "div"> = FlexProps<C> & {
  //
};

export function Group<C extends React.ElementType = "div">({
  children,
  className,
  ...flexProps
}: GroupProps<C>) {
  return (
    <Flex<C>
      className={classNames(["Group-root", className])}
      {...(flexProps as FlexProps<C>)}
    >
      {children}
    </Flex>
  );
}
