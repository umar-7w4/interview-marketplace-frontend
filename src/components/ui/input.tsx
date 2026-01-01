import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="text-gray-200 mb-2 font-semibold block">
            {label}
          </label>
        )}

        <input
          ref={ref}
          {...props}
          className={`border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            error ? "border-red-500" : ""
          }`}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
