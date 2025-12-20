import { classNames } from "../../utils/components/attributes";
import { Flex, type FlexProps } from "./Flex";

export type GroupProps = FlexProps & {
  //
}

export function Group({ children, className, ...flexProps }: GroupProps) {
  return (
    <Flex className={classNames(["Group-root", className])}  {...flexProps}>
      {children}
    </Flex>
  );
}
