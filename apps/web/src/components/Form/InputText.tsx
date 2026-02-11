import { classNames } from "../../utils/components/attributes";
import { InputBase, type InputTextProps } from "./InputBase";

export function InputText({ className, ...inputProps }: InputTextProps) {
  return (
    <InputBase
      type="text"
      className={classNames(["InputText-root", className])}
      {...inputProps}
    />
  );
}
