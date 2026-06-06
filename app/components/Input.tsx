"use client";

import { forwardRef, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  type?: "text" | "email" | "number" | "tel" | "password";
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ type = "text", className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={`
          w-full px-4 py-3 rounded-lg border border-gray-300 
          focus:ring-2 focus:ring-green-500 focus:border-green-500 
          outline-none transition-all duration-200
          text-gray-900 placeholder-gray-400
          hover:border-gray-400
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${className}
        `}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export default Input;
