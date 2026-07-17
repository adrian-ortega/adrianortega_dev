import { useState, type ChangeEventHandler } from "react";
import type { BaseInputProps } from "../components/Form/types";

type UseFormOptions<T> = {
  initialValues: T;
  validate?: Record<keyof T, (value: T[keyof T]) => string | null>;
};

type UseFormReturnType<T> = {
  values: T;
  errors: Record<keyof T, string|null>;
  setValues: React.Dispatch<React.SetStateAction<T>>;
  setFieldError: (field: keyof T, error: string|null) => void;
  getInputProps: (field: keyof T) => Omit<BaseInputProps, "label"> & {
    value: T[keyof T];
    onChange?: ChangeEventHandler<HTMLInputElement|HTMLTextAreaElement>;
  };
  onSubmit: (callback: (values: T) => void) => (e: React.FormEvent<HTMLFormElement>) => void;
  reset: () => void;
};

type FormValues = Record<string, string | number | null | undefined>;

export function useForm<T extends FormValues>({ initialValues, validate }: UseFormOptions<T>): UseFormReturnType<T> {

  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<keyof T, string|null>>({} as Record<keyof T, string>);

  const setFieldError = (field: keyof T, error: string|null) => {
    setErrors(prevErrors => ({
      ...prevErrors,
      [field]: error,
    }));
  };

  const getInputProps = (field: keyof T) => {
    return {
      name: String(field),
      value: values[field],
      error: errors[field],
      onChange: (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
        const { value } = e.target;
        setValues(prevValues => ({
          ...prevValues,
          [field]: value,
        }));
      },
    };
  };

  const validateFields = (): boolean => {
    let isValid = true;
    if (validate) {
      for (const field in validate) {
        const validateFn = validate[field];
        const error = validateFn(values[field]);
        setFieldError(field, error || null);
        if (error) {
          isValid = false;
        }
      }
    }
    return isValid;
  };

  const onSubmit = (callback: (values: T) => void) => (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isValid = validateFields();
    if (isValid && callback) {
      callback(values);
    }
  };

  const reset = () => {
    const keys = Object.keys(initialValues) as (keyof T)[];
    const resetValues = keys.reduce((acc, key) => {
      acc[key] = initialValues[key];
      return acc;
    }, {} as T);
    setValues(resetValues);
    setErrors({} as Record<keyof T, string|null>);
  };

  return {
    values,
    errors,
    setValues,
    setFieldError,
    getInputProps,
    onSubmit,
    reset,
  }
};
