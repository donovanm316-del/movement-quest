interface Props {
  completedAtDates: string[];
  weeks?: number;
}

function levelClass(count: number): string {
  if (count <= 0) return 'bg-surface-hi';
  if (count === 1) return 'bg-primary/35';
  if (count === 2) return 'bg-primary/60';
  if (count === 3) return 'bg-primary/85';
  return 'bg-primary';
}

export function ConsistencyHeatmap({ completedAtDates, weeks = 16 }: Props) {
  const counts: Record<string, number> = {};
  for (const iso of completedAtDates) {
    const key = new Date(iso).toDateString();
    counts[key] = (counts[key] ?? 0) + 1;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayDow = today.getDay();
  const start = new Date(today);
  start.setDate(start.getDate() - todayDow - (weeks - 1) * 7);

  const totalDays = weeks * 7;
  const days: { date: Date; count: number }[] = [];
  const cursor = new Date(start);
  for (let i = 0; i < totalDays; i++) {
    days.push({ date: new Date(cursor), count: counts[cursor.toDateString()] ?? 0 });
    cursor.setDate(cursor.getDate() + 1);
  }

  const columns: { date: Date; count: number }[][] = [];
  for (let w = 0; w < weeks; w++) {
    columns.push(days.slice(w * 7, w * 7 + 7));
  }

  const pastDays = days.filter((d) => d.date <= today);
  const activeDays = pastDays.filter((d) => d.count > 0).length;
  const pct = pastDays.length > 0 ? Math.round((activeDays / pastDays.length) * 100) : 0;

  return (
    <div>
      <div className="flex gap-[3px] overflow-x-auto pb-1">
        {columns.map((col, ci) => (
          <div key={ci} className="flex flex-col gap-[3px]">
            {col.map((d, di) => (
              <div
                key={di}
                title={`${d.date.toDateString()}: ${d.count} quest${d.count === 1 ? '' : 's'}`}
                className={`h-3 w-3 shrink-0 rounded-sm ${d.date > today ? 'bg-transparent' : levelClass(d.count)}`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-text-dim">
        <span>
          {pct}% active ({activeDays}/{pastDays.length} days)
        </span>
        <span className="flex items-center gap-1">
          Less
          <span className="h-3 w-3 rounded-sm bg-surface-hi" />
          <span className="h-3 w-3 rounded-sm bg-primary/35" />
          <span className="h-3 w-3 rounded-sm bg-primary/60" />
          <span className="h-3 w-3 rounded-sm bg-primary" />
          More
        </span>
      </div>
    </div>
  );
}
