"use client";

import { forwardRef, SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: Array<{ value: string; label: string }>;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, className = "", ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={`
          w-full px-4 py-3 rounded-lg border border-gray-300 
          focus:ring-2 focus:ring-green-500 focus:border-green-500 
          outline-none transition-all duration-200
          text-gray-900 bg-white
          hover:border-gray-400
          disabled:bg-gray-100 disabled:cursor-not-allowed
          appearance-none
          cursor-pointer
          ${className}
        `}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
          backgroundPosition: "right 1rem center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "1.5rem",
        }}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  },
);

Select.displayName = "Select";

export default Select;
