import type { ChangeEventHandler } from "react";
import { classNames } from "../../utils/components/attributes";
import { Stack, type StackProps } from "../Core/Stack";
import { InputError } from "./InputError";
import { InputLabel } from "./InputLabel";
import { type BaseInputProps } from "./types";

type InputTextareaProps<C extends React.ElementType = "textarea"> = BaseInputProps & StackProps<C> & {
  rows?: number;
  onChange?: ChangeEventHandler<HTMLInputElement|HTMLTextAreaElement>;
}

export function InputTextarea({
  name,
  className,
  label,
  placeholder,
  required,
  disabled,
  rows = 4,
  error,
  value,
  onChange,
}: InputTextareaProps) {
  const htmlId = `input-${name}`;
  return (
    <Stack
      className={classNames([
        "InputBase-root",
        "InputTextarea-root",
        className,
      ])}
    >
      <InputLabel label={label} required={required} for={name} />
      <textarea
        id={htmlId}
        name={name}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        value={value ?? ""}
        onChange={onChange}
      />
      <InputError error={error} />
    </Stack>
  );
}
