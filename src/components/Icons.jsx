// ============================================================
// アイコン集（インラインSVG）
// 外部フォント・画像に依存しないことで電波が弱くても崩れない。
// color / size を props で受け取る。
// ============================================================

export function MagnifierIcon({ color = "#4b4b4b", size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6.5" stroke={color} strokeWidth="2.6" />
      <line x1="15.5" y1="15.5" x2="21" y2="21" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

export function ListIcon({ color = "#4b4b4b", size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {[5, 12, 19].map(y => (
        <g key={y}>
          <circle cx="4" cy={y} r="1.8" fill={color} />
          <rect x="9" y={y - 1.6} width="12" height="3.2" rx="1.4" fill={color} />
        </g>
      ))}
    </svg>
  );
}

export function PinIcon({ color = "#4b4b4b", size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2C8.1 2 5 5.1 5 9c0 5 7 13 7 13s7-8 7-13c0-3.9-3.1-7-7-7z"
        fill={color}
      />
      <circle cx="12" cy="9" r="2.6" fill="#ffffff" />
    </svg>
  );
}

export function GridIcon({ color = "#ffffff", size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {[
        [3, 3], [13.5, 3], [3, 13.5], [13.5, 13.5],
      ].map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="7.5" height="7.5" rx="1.5" fill={color} />
      ))}
    </svg>
  );
}

export function FunnelIcon({ color = "#333333", size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 4h18l-7 8v6l-4 2v-8L3 4z" fill={color} />
    </svg>
  );
}

export function HamburgerIcon({ color = "#ffffff", size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {[5.5, 12, 18.5].map(y => (
        <line key={y} x1="3" y1={y} x2="21" y2={y} stroke={color} strokeWidth="2.6" strokeLinecap="round" />
      ))}
    </svg>
  );
}

export function ShareIcon({ color = "#ffffff", size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3v11" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M8 6.5L12 2.8l4 3.7" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M7 10H5v11h14V10h-2" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function PencilIcon({ color = "#333333", size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 20l1-4L16.5 4.5a2.1 2.1 0 013 3L8 19l-4 1z" fill={color} />
      <path d="M3 22h18" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function CloseIcon({ color = "#555555", size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <line x1="5" y1="5" x2="19" y2="19" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
      <line x1="19" y1="5" x2="5" y2="19" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}
