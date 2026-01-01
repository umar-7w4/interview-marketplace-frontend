import React from "react";

interface TextareaProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function Textarea({
  label,
  placeholder,
  value,
  onChange,
}: TextareaProps) {
  return (
    <div className="relative flex flex-col gap-2">
      {label && (
        <label className="text-white text-lg font-semibold tracking-wider">
          {label}
        </label>
      )}
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={5}
        className="
          w-full
          rounded-md
          p-4
          mt-2
          mb-4
          bg-gradient-to-br from-[#232946] to-[#2c2f4a]
          text-white
          shadow-xl
          focus:outline-none
          focus:ring-4 focus:ring-blue-500
          transition-transform
          duration-300
          ease-in-out
          transform
          hover:scale-[1.02]
          placeholder:text-gray-300
        "
      />
      <div className="absolute bottom-2 right-2 text-xs text-gray-400">
        AI-Powered Input
      </div>
    </div>
  );
}
