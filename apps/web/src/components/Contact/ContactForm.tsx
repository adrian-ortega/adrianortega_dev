import { useState } from "react";
import { useForm } from "../../utils/useForm";
import { Box } from "../Core/Box";
import { Group } from "../Core/Group";
import { Stack } from "../Core/Stack";
import { InputText } from "../Form/InputText";
import { InputTextarea } from "../Form/InputTextarea";
import { Button } from "../Core/Button";

type ContactFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const form = useForm<ContactFormValues>({
    initialValues: {} as ContactFormValues,
    validate: {
      firstName: (value) =>
        !value || value.trim() === "" ? "First name is required" : null,
      lastName: (value) =>
        !value || value.trim() === "" ? "Last name is required" : null,
      email: (value) => {
        if (!value || value.trim() === "") {
          return "Email is required";
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? null : "Invalid email address";
      },
      message: (value) => {
        const val = String(value).trim();
        if (val === "" || val.length > 4) return null;
        return "Message is too short";
      },
    },
  });
  const onSubmit = (values: ContactFormValues) => {
    setLoading(true);
    setTimeout(() => {
      console.log('Done submitting', values);
      alert("You didn't finish this part");
      setLoading(false);
      form.reset();
    }, 2000);
  };

  return (
    <Box className="ContactForm-root">
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack gap={0}>
          <Group>
            <InputText
              label="First Name"
              required
              disabled={loading}
              {...form.getInputProps("firstName")}
            />
            <InputText
              label="Last Name"
              required
              disabled={loading}
              {...form.getInputProps("lastName")}
            />
          </Group>
          <InputText
            label="Email"
            required
            disabled={loading}
            {...form.getInputProps("email")}
          />
          <InputTextarea
            label="Message"
            disabled={loading}
            {...form.getInputProps("message")}
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </Stack>
      </form>
    </Box>
  );
}
