"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { DayPicker, DateRange } from "react-day-picker";
import { motion, AnimatePresence } from "framer-motion";
import { PenLine, Calendar as CalendarIcon } from "lucide-react";
import Image from "next/image";

export default function CalendarWidget() {
  const [range, setRange] = useState<DateRange | undefined>();
  const [notes, setNotes] = useState<string>("");
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration errors with localStorage
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Load notes from LocalStorage whenever the selected START date changes
  useEffect(() => {
    if (range?.from) {
      const key = `calendar-notes-${format(range.from, "yyyy-MM-dd")}`;
      const savedNote = localStorage.getItem(key);
      setNotes(savedNote || "");
    } else {
      setNotes(""); // Clear notes if no date is selected
    }
  }, [range?.from]);

  // Save notes to LocalStorage
  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNote = e.target.value;
    setNotes(newNote);
    if (range?.from) {
      const key = `calendar-notes-${format(range.from, "yyyy-MM-dd")}`;
      localStorage.setItem(key, newNote);
    }
  };

  if (!isMounted) return null; // Wait for client render

  // Format header dates for the UI
  const displayDate = range?.from
    ? range.to
      ? `${format(range.from, "MMM do")} - ${format(range.to, "MMM do, yyyy")}`
      : format(range.from, "MMMM do, yyyy")
    : "Select a date range";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-zinc-200"
    >
      {/* LEFT PANEL: Hero Image (Wall Calendar Aesthetic) */}
      <div className="relative w-full md:w-5/12 h-[300px] md:h-auto bg-zinc-900">
        <img
          src="https://images.unsplash.com/photo-1516681100942-77d8e7f9dd97?q=80&w=2500&auto=format&fit=crop"
          alt="Mountain Climber"
          className="object-cover w-full h-full opacity-90"
        />
        {/* Angled decorative overlay to match reference image */}
        <div
          className="absolute bottom-0 w-full h-32 bg-white"
          style={{ clipPath: "polygon(0 40%, 100% 0, 100% 100%, 0 100%)" }}
        ></div>

        {/* Dynamic Theme Text on Image */}
        <div className="absolute bottom-6 right-8 text-right z-10">
          <motion.h2
            key={range?.from ? "selected" : "none"}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-bold text-sky-600 tracking-tight drop-shadow-sm"
          >
            {range?.from
              ? format(range.from, "yyyy")
              : new Date().getFullYear()}
          </motion.h2>
          <p className="text-xl font-medium text-zinc-800 uppercase tracking-widest">
            {range?.from
              ? format(range.from, "MMMM")
              : format(new Date(), "MMMM")}
          </p>
        </div>
      </div>

      {/* RIGHT PANEL: Interactive Calendar & Notes */}
      <div className="w-full md:w-7/12 p-6 sm:p-10 flex flex-col justify-between">
        {/* Top Section: Date Range Indicator */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-100 text-zinc-800">
          <CalendarIcon className="w-5 h-5 text-sky-600" />
          <h3 className="font-semibold text-lg">{displayDate}</h3>
        </div>

        {/* The Grid Component */}
        <div className="flex justify-center mb-8">
          <DayPicker
            mode="range"
            selected={range}
            onSelect={setRange}
            showOutsideDays
            className="font-sans"
          />
        </div>

        {/* Integrated Notes Section */}
        <div className="mt-auto bg-zinc-50 rounded-xl p-5 border border-zinc-100 transition-colors focus-within:border-sky-300 focus-within:ring-4 focus-within:ring-sky-50">
          <div className="flex items-center gap-2 mb-3 text-zinc-700">
            <PenLine className="w-4 h-4" />
            <h4 className="font-medium text-sm uppercase tracking-wider">
              {range?.from
                ? `Notes for ${format(range.from, "MMM do")}`
                : "General Notes"}
            </h4>
          </div>
          <AnimatePresence mode="wait">
            <motion.textarea
              key={range?.from ? range.from.toISOString() : "general"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              value={notes}
              onChange={handleNoteChange}
              placeholder={
                range?.from
                  ? "Jot down memos for this selection..."
                  : "Select a date to attach a specific note..."
              }
              className="w-full h-24 bg-transparent resize-none outline-none text-zinc-600 placeholder:text-zinc-400"
            />
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
