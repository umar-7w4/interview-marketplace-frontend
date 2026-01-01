import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export default function CustomMonthYearCalendar() {
  const [month, setMonth] = useState<number>(new Date().getMonth());
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const months = [
    { label: "January", value: 0 },
    { label: "February", value: 1 },
    { label: "March", value: 2 },
    { label: "April", value: 3 },
    { label: "May", value: 4 },
    { label: "June", value: 5 },
    { label: "July", value: 6 },
    { label: "August", value: 7 },
    { label: "September", value: 8 },
    { label: "October", value: 9 },
    { label: "November", value: 10 },
    { label: "December", value: 11 },
  ];

  const years = [];
  for (let y = 2025; y <= 2100; y++) {
    years.push(y);
  }

  function handleMonthChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setMonth(Number(e.target.value));
  }

  function handleYearChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setYear(Number(e.target.value));
  }

  return (
    <div className="flex flex-col items-center p-4 bg-[#15192e] text-white min-h-screen">
      <h1 className="text-2xl mb-6">Custom Month/Year Calendar</h1>

      {}
      <div className="flex gap-4 mb-4">
        <select
          className="rounded-md bg-[#1E2535] text-white p-2"
          value={month}
          onChange={handleMonthChange}
        >
          {months.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>

        <select
          className="rounded-md bg-[#1E2535] text-white p-2"
          value={year}
          onChange={handleYearChange}
        >
          {years.map((yr) => (
            <option key={yr} value={yr}>
              {yr}
            </option>
          ))}
        </select>
      </div>

      {}
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        month={new Date(year, month)}
        className="bg-[#1E2535] p-4 rounded-lg shadow-lg"
      />

      {}
      <p className="mt-4 text-sm">
        {selectedDate
          ? `You picked ${selectedDate.toDateString()}`
          : "No date selected"}
      </p>
    </div>
  );
}
