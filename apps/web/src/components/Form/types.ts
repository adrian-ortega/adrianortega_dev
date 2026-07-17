export type BaseInputProps = {
  name: string;
  label: string;
  value?: number | string | null | undefined;
  placeholder?: string;
  required?: boolean;
  error?: string|null;
}
