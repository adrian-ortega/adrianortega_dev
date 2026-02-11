import { type ChangeEventHandler } from "react";
import { classNames } from "../../utils/components/attributes";
import { Stack, type StackProps } from "../Core/Stack";
import { InputError } from "./InputError";
import { InputLabel } from "./InputLabel";
import type { BaseInputProps } from "./types";

export type InputTextProps<C extends React.ElementType = "input"> = BaseInputProps & StackProps<C> & {
  type?: "text" | "email" | "tel";
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
};

export function InputBase({
  className,
  type = "text",
  name,
  label,
  placeholder,
  required,
  disabled,
  error,
  onChange,
  value,
}: InputTextProps) {
  const htmlId = `input-${type}-${name}`;
  return (
    <Stack className={classNames([
      "InputBase-root",
      error ? "InputBase-error" : undefined,
      className
    ])} grow>
      <InputLabel label={label} required={required} for={name} />
      <input
        id={htmlId}
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        onChange={onChange}
        value={value ?? ""}
      />
      <InputError error={error} />
    </Stack>
  );
}
