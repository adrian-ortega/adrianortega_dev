import { Flex, type FlexProps } from "./Flex";
import { classNames } from "../../utils/components/attributes";

export type StackProps<C extends React.ElementType = "div"> = FlexProps<C> & {
  gap?: string | number;
};

export function Stack({ children, className, ...flexProps }: StackProps) {
  return (
    <Flex className={classNames(["Stack-root", className])} {...flexProps}>
      {children}
    </Flex>
  );
}
