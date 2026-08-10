interface Props {
  pct: number;
  label?: string;
  colorClass?: string;
}

export function ExpBar({ pct, label, colorClass = 'bg-primary' }: Props) {
  return (
    <div className="w-full">
      {label && <div className="text-xs text-text-dim mb-1">{label}</div>}
      <div className="h-3 w-full rounded-full bg-surface-hi overflow-hidden border border-border">
        <div
          className={`h-full rounded-full ${colorClass} transition-all duration-700 ease-out`}
          style={{ width: `${Math.max(0, Math.min(100, pct))}%` }}
        />
      </div>
    </div>
  );
}
