import { useRef } from "react";

/** Custom 6-box one-time-password input (replaces mui-one-time-password-input). */
export function OtpInput({
  value,
  onChange,
  length = 6,
  autoFocus = true,
}: {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  autoFocus?: boolean;
}) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const chars = value.split("").slice(0, length);

  const setChar = (index: number, char: string) => {
    const next = value.split("");
    next[index] = char;
    onChange(next.join("").slice(0, length));
  };

  const handleChange = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, "").slice(-1);
    if (!digit) return;
    setChar(index, digit);
    if (index < length - 1) refs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (chars[index]) {
        setChar(index, "");
      } else if (index > 0) {
        refs.current[index - 1]?.focus();
        setChar(index - 1, "");
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      refs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (pasted) {
      onChange(pasted);
      refs.current[Math.min(pasted.length, length - 1)]?.focus();
    }
  };

  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          autoFocus={autoFocus && i === 0}
          value={chars[i] ?? ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className="h-12 w-10 rounded-lg border border-brand-cream-dark bg-white text-center text-lg font-semibold text-brand-ink shadow-sm outline-none transition focus:border-brand-maroon focus:ring-2 focus:ring-brand-turmeric/40"
        />
      ))}
    </div>
  );
}
