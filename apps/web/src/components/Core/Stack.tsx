import { Flex, type FlexProps } from "./Flex";
import { classNames } from "../../utils/components/attributes";

type StackProps = FlexProps & {
  gap?: string | number;
};

export function Stack({ children, className, ...flexProps }: StackProps) {
  return (
    <Flex className={classNames(["Stack-root", className])} {...flexProps}>
      {children}
    </Flex>
  );
}
