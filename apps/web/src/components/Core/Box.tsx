import type { ReactNode } from "react";
import { classNames } from "../../utils/components/attributes";

export type BoxProps = {
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
};


export function Box({
  children,
  className = "Box-root",
  ...boxProps
}: BoxProps) {
  const _className = classNames(className);
  return <div className={_className} {...boxProps}>{children}</div>;
}
