interface SliderFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  onChange: (value: number) => void;
}

export function SliderField({ label, value, min, max, step = 1, suffix = "%", onChange }: SliderFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <label className="text-sm font-medium text-ink-soft">{label}</label>
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-20 rounded-lg border border-line-soft bg-white px-2 py-1 text-right text-sm font-semibold text-ink outline-none focus:border-teal"
          />
          <span className="text-xs text-ink-muted">{suffix}</span>
        </div>
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-canvas-3 accent-primary"
      />
    </div>
  );
}
