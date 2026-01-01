import React from "react";
import { motion } from "framer-motion";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

interface CalendarProps {
  selectedDate: Date;
  onChange: (date: Date) => void;
}

export default function Calendar({ selectedDate, onChange }: CalendarProps) {
  function handleDayClick(day: Date) {
    onChange(day);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border p-4 shadow"
    >
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={(day: Date | undefined) => {
          if (day) handleDayClick(day);
        }}
      />
    </motion.div>
  );
}
