/**
 * Flat drawing of a cold room, for where no honest photograph exists: pallets of cartons behind a strip curtain.
 * TODO(company-confirm): replace with photographs of the actual storage rooms.
 */
export function ColdRoomArt({ className = "" }: { className?: string }) {
  const strips = Array.from({ length: 9 }, (_, i) => i);
  // Each stack: a pallet base with cartons on it. [x, layers]
  const stacks: [number, number][] = [
    [70, 3],
    [300, 2],
    [530, 3],
  ];
  return (
    <svg viewBox="0 0 800 600" className={className} preserveAspectRatio="xMidYMid slice" role="presentation" aria-hidden="true">
      <rect width="800" height="600" fill="#d9e8f8" />
      <rect y="470" width="800" height="130" fill="#9fc2e8" />
      {stacks.map(([x, layers]) => (
        <g key={x}>
          {Array.from({ length: layers }, (_, l) =>
            [0, 1].map((c) => (
              <g key={`${l}-${c}`}>
                <rect x={x + c * 102} y={420 - l * 88 - 68} width="98" height="84" fill="#3b86d1" />
                <rect x={x + c * 102 + 42} y={420 - l * 88 - 68} width="14" height="84" fill="#0c548f" />
              </g>
            )),
          )}
          <rect x={x - 4} y="436" width="208" height="12" fill="#083d6b" />
          {[0, 90, 180].map((o) => (
            <rect key={o} x={x - 4 + o} y="448" width="28" height="22" fill="#083d6b" />
          ))}
        </g>
      ))}
      {strips.map((i) => (
        <rect key={i} x={i * 90 - 5} y="0" width="82" height="600" fill="#ffffff" opacity={i % 2 ? 0.3 : 0.2} />
      ))}
      <rect width="800" height="26" fill="#083d6b" />
    </svg>
  );
}
