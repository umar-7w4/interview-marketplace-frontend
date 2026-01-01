import React, { useEffect, useState } from "react";

interface CustomTimePickerProps {
  label?: string;
  value: string;
  onChange: (val: string) => void;
}

export default function CustomTimePicker({
  label,
  value,
  onChange,
}: CustomTimePickerProps) {
  const [time, setTime] = useState(value);

  useEffect(() => {
    setTime(value);
  }, [value]);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const updatedTime = e.target.value;
    setTime(updatedTime);
    onChange(updatedTime);
  }

  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  );
  const minutes = ["00", "15", "30", "45"];

  return (
    <div className="flex flex-col gap-2">
      {label && <label className="font-semibold">{label}</label>}
      <div className="flex gap-2">
        <select
          className="rounded-md bg-[#1E2535] text-white p-2"
          value={time.split(":")[0] || "00"}
          onChange={(e) =>
            handleChange({
              target: {
                value: `${e.target.value}:${time.split(":")[1] || "00"}`,
              },
            } as React.ChangeEvent<HTMLSelectElement>)
          }
        >
          {hours.map((hour) => (
            <option key={hour} value={hour}>
              {hour}
            </option>
          ))}
        </select>

        <select
          className="rounded-md bg-[#1E2535] text-white p-2"
          value={time.split(":")[1] || "00"}
          onChange={(e) =>
            handleChange({
              target: {
                value: `${time.split(":")[0] || "00"}:${e.target.value}`,
              },
            } as React.ChangeEvent<HTMLSelectElement>)
          }
        >
          {minutes.map((minute) => (
            <option key={minute} value={minute}>
              {minute}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
