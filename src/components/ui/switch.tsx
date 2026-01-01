import * as React from "react";

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onCheckedChange,
  ...props
}) => {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className="sr-only peer"
        {...props}
      />
      <div
        className={`w-10 h-5 bg-gray-600 peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-5 peer-checked:bg-blue-500 after:content-[''] after:absolute after:top-1/2 after:left-1 after:-translate-y-1/2 after:w-4 after:h-4 after:bg-white after:border after:rounded-full after:transition-all`}
      ></div>
    </label>
  );
};
