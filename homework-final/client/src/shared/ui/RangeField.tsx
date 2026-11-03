interface Props {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
}

export const RangeField = ({ label, min, max, step, value, onChange }: Props) => (
  <label className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-slate-200">
    <div className="flex items-center justify-between">
      <span>{label}</span>
      <span className="text-slate-400">{value}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
    />
  </label>
);
