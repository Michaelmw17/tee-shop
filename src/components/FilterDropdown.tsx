"use client";

import { useState, useEffect, useRef, ReactNode } from "react";

export interface FilterDropdownProps {
  label: string;
  count?: number;
  children: ReactNode;
}

export default function FilterDropdown({ label, count = 0, children }: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:border-blue-400 hover:text-blue-600"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <span>{label}</span>
        {count > 0 && (
          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
            {count}
          </span>
        )}
        <span className={`text-xs transition-transform ${open ? "rotate-180" : ""}`} aria-hidden>
          v
        </span>
      </button>
      {open && (
        <div className="absolute right-0 z-30 mt-2 w-64 rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
          {children}
        </div>
      )}
    </div>
  );
}
