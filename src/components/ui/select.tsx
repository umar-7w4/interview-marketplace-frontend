"use client";

import React, { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  children: React.ReactNode;
}

export default function Select({
  label,
  children,
  className,
  ...props
}: SelectProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && <label className="font-semibold">{label}</label>}
      <select
        className={`dark-select ${className || ""}`} // Combine with any existing className
        {...props}
      >
        {children}
      </select>
    </div>
  );
}
