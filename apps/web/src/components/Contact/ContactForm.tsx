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

type SubmitStatus = {
  ok: boolean;
  message: string;
}

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<SubmitStatus | null>(null);
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

  const onSubmit = async (values: ContactFormValues) => {
    setLoading(true);
    setStatus(null);
    try {
      const nonceResponse = await fetch("/api/contact/nonce");
      const { nonce } = await nonceResponse.json();

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, nonce }),
      });
      const data = await response.json();

      if (!response.ok || data.error) {
        setStatus({
          ok: false,
          message: data.message ?? "Something went wrong. Please try again.",
        });
        return;
      }

      setStatus({ ok: true, message: data.message });
      form.reset();
    } catch {
      setStatus({
        ok: false,
        message: "Could not reach the server. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
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
          {status && (
            <Box
              className={`ContactForm-status ${status.ok ? "is-success" : "is-error"}`}
              role="status"
            >
              {status.message}
            </Box>
          )}
          <Button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </Stack>
      </form>
    </Box>
  );
}
