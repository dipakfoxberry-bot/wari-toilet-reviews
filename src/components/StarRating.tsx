import { useState } from "react";

interface Props {
  value: number;
  onChange: (v: number) => void;
  label: string;
}

export function StarRating({ value, onChange, label }: Props) {
  const [hover, setHover] = useState(0);
  const display = hover || value;
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg bg-card/80 backdrop-blur px-4 py-3 border border-border">
      <span className="text-base font-medium text-foreground">{label}</span>
      <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onMouseEnter={() => setHover(n)}
            onClick={() => onChange(n)}
            className="text-3xl leading-none transition-transform hover:scale-110"
            aria-label={`${n} star`}
          >
            <span style={{ color: n <= display ? "#f59e0b" : "#d4d4d8" }}>★</span>
          </button>
        ))}
      </div>
    </div>
  );
}
