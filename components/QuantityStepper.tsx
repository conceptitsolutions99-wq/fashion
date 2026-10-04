"use client";

export default function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 10,
  size = "md",
  label = "Quantity",
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  label?: string;
}) {
  const dim = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const disabled = value <= min;
  const atMax = value >= max;

  return (
    <div
      className={`inline-flex items-center rounded-full border border-ink-200 ${
        size === "sm" ? "h-9" : "h-11"
      }`}
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={disabled}
        aria-label="Decrease quantity"
        className={`${dim} grid place-items-center rounded-full text-lg text-ink-700 transition enabled:hover:bg-ink-100 disabled:opacity-30`}
      >
        −
      </button>
      <span
        className={`min-w-7 text-center text-sm font-medium text-ink-950 ${
          size === "sm" ? "text-xs" : ""
        }`}
        aria-live="polite"
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={atMax}
        aria-label="Increase quantity"
        className={`${dim} grid place-items-center rounded-full text-lg text-ink-700 transition enabled:hover:bg-ink-100 disabled:opacity-30`}
      >
        +
      </button>
    </div>
  );
}
