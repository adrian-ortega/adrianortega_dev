import * as React from "react";
import { classNames } from "../../utils/components/attributes";

type ElementType = React.ElementType;

type PropsToOmit<C extends ElementType, P> = keyof (P & { component?: C });

export type PolymorphicProps<C extends ElementType, Props = unknown> = Props & {
  component?: C;
} & Omit<React.ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;

export type PolymorphicRef<C extends ElementType> =
  React.ComponentPropsWithRef<C>["ref"];

export type BoxOwnProps = {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export type BoxProps<C extends ElementType = "div"> = PolymorphicProps<
  C,
  BoxOwnProps
>;

const BoxInner = <C extends ElementType = "div">(
  { component, children, className, ...rest }: BoxProps<C>,
  ref: React.Ref<C>
) => {
  const Component = (component ?? "div") as ElementType;
  const _className = classNames(["Box-root", className]);

  return (
    <Component ref={ref} className={_className} {...rest}>
      {children}
    </Component>
  );
};

export const Box = React.forwardRef(BoxInner) as <
  C extends ElementType = "div"
>(
  props: BoxProps<C> & { ref?: PolymorphicRef<C> }
) => React.ReactElement | null;
