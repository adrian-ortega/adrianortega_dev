import { Group } from "../Core/Group";

type InputLabelProps = {
  for?: string;
  label: string;
  required?: boolean;
}

export function InputLabel({ label, required, for: htmlFor }: InputLabelProps) {
  return (
    <Group component="label" className="InputLabel-root" htmlFor={htmlFor}>
      <span>{label}</span>
      {required && <span className="InputLabel-required">*</span>}
    </Group>
  );
}
