interface Props {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  type?: string;
  multiline?: boolean;
  readOnly?: boolean;
}

export default function AdminInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  multiline,
  readOnly,
}: Props) {
  const common =
    "w-full rounded-[3px] border border-beige/25 bg-cream/40 px-3 py-2 text-sm text-charcoal placeholder:text-taupe/40 focus:border-gold/50 focus:bg-cream/60 focus:outline-none focus:ring-1 focus:ring-gold/20 transition-colors";

  return (
    <div>
      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-taupe/80">
        {label}
      </label>
      {multiline ? (
        <textarea
          className={`${common} min-h-[80px] resize-y`}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
        />
      ) : (
        <input
          type={type}
          className={common}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
        />
      )}
    </div>
  );
}
