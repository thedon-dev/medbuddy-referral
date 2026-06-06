"use client";

import { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  name: string;
  error?: string;
  children: ReactNode;
  required?: boolean;
}

export default function FormField({
  label,
  name,
  error,
  children,
  required = false,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="block text-sm font-semibold text-gray-700"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
          <span>⚠️</span> {error}
        </p>
      )}
    </div>
  );
}
