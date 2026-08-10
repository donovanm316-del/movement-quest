export type ChestState = 'closed' | 'shaking' | 'open';

const SPARKLES = [
  { x: 20, y: 20, delay: 0 },
  { x: 115, y: 15, delay: 0.15 },
  { x: 10, y: 55, delay: 0.3 },
  { x: 125, y: 60, delay: 0.1 },
  { x: 70, y: 5, delay: 0.25 },
];

export function TreasureChest({ state, onClick }: { state: ChestState; onClick: () => void }) {
  const isOpen = state === 'open';

  return (
    <button
      onClick={onClick}
      disabled={state !== 'closed'}
      aria-label="Open treasure chest"
      className="relative flex items-center justify-center bg-transparent p-0"
      style={{ cursor: state === 'closed' ? 'pointer' : 'default' }}
    >
      <svg
        viewBox="0 0 140 120"
        width={190}
        height={163}
        className={state === 'shaking' ? 'animate-shake' : state === 'closed' ? 'animate-nudge' : ''}
      >
        <defs>
          <radialGradient id="chestGlow" cx="50%" cy="45%" r="50%">
            <stop offset="0%" stopColor="#ffb347" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#ffb347" stopOpacity="0" />
          </radialGradient>
        </defs>

        {isOpen && <circle cx={70} cy={55} r={58} fill="url(#chestGlow)" className="animate-burst" />}

        {isOpen &&
          SPARKLES.map((s, i) => (
            <text
              key={i}
              x={s.x}
              y={s.y}
              fontSize={14}
              className="animate-sparkle"
              style={{ animationDelay: `${s.delay}s` }}
            >
              ✨
            </text>
          ))}

        {/* base */}
        <rect x={15} y={62} width={110} height={46} rx={8} fill="#8a5a2b" stroke="#4a2e15" strokeWidth={3} />
        <rect x={61} y={62} width={18} height={46} fill="#e8a13a" stroke="#4a2e15" strokeWidth={1.5} />
        <circle cx={70} cy={70} r={3} fill="#4a2e15" />

        {/* lid */}
        <g
          style={{
            transformOrigin: '70px 63px',
            transform: isOpen ? 'rotate(-118deg)' : 'rotate(0deg)',
            transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          <rect x={12} y={34} width={116} height={32} rx={14} fill="#a9702f" stroke="#4a2e15" strokeWidth={3} />
          <rect x={61} y={34} width={18} height={20} fill="#e8a13a" stroke="#4a2e15" strokeWidth={1.5} />
          <circle cx={70} cy={50} r={9} fill="#ffd27a" stroke="#4a2e15" strokeWidth={2} />
        </g>
      </svg>
    </button>
  );
}
