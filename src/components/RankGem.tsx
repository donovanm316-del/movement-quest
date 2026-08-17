interface GemColors {
  fill: string;
  fillLight: string;
  glow: string;
}

const GEM_COLORS: Record<string, GemColors> = {
  beginner: { fill: '#22c55e', fillLight: '#86efac', glow: '#22c55e' },
  bronze: { fill: '#b45309', fillLight: '#f0b26b', glow: '#d97706' },
  silver: { fill: '#94a3b8', fillLight: '#e2e8f0', glow: '#cbd5e1' },
  gold: { fill: '#eab308', fillLight: '#fde68a', glow: '#facc15' },
  platinum: { fill: '#0ea5e9', fillLight: '#bae6fd', glow: '#38bdf8' },
  diamond: { fill: '#818cf8', fillLight: '#c7d2fe', glow: '#818cf8' },
  master: { fill: '#e879f9', fillLight: '#f5d0fe', glow: '#e879f9' },
};

export function RankGem({ rankId, size = 64 }: { rankId: string; size?: number }) {
  const c = GEM_COLORS[rankId] ?? GEM_COLORS.beginner;
  const legendary = rankId === 'master';
  const gradId = `gem-fill-${rankId}`;
  const glowId = `gem-glow-${rankId}`;

  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <defs>
        <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c.glow} stopOpacity="0.55" />
          <stop offset="100%" stopColor={c.glow} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c.fillLight} />
          <stop offset="100%" stopColor={c.fill} />
        </linearGradient>
      </defs>

      <circle cx={50} cy={50} r={48} fill={`url(#${glowId})`} />

      {legendary && (
        <>
          <path d="M22,52 Q2,38 6,18 Q22,24 28,46 Z" fill={c.fill} opacity={0.65} />
          <path d="M78,52 Q98,38 94,18 Q78,24 72,46 Z" fill={c.fill} opacity={0.65} />
        </>
      )}

      <polygon points="50,14 82,50 50,86 18,50" fill={`url(#${gradId})`} stroke={c.fill} strokeWidth={2.5} />
      <polygon points="50,14 66,32 50,50 34,32" fill="white" opacity={0.28} />
    </svg>
  );
}
