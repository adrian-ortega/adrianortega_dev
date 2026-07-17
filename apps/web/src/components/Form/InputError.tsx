import { Box } from "../Core/Box";

type InputErrorProps = {
  error?: string|null;
}
export function InputError({ error }: InputErrorProps) {
  return (
    <Box className="InputError-root">
      {error}
    </Box>
  )
}
