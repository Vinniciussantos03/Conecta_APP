import { useId } from 'react'

export function LogoMark({ size = 40 }: { size?: number }) {
  const id = useId()
  return (
    <svg className="logo-mark" width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-c`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ddd6fe" />
          <stop offset=".5" stopColor="#a78bfa" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <path d="M44 19A17 17 0 1 0 44 45" fill="none" stroke={`url(#${id}-c)`} strokeWidth="8" strokeLinecap="round" />
      <ellipse cx="32" cy="33" rx="27" ry="8.5" fill="none" stroke="#a78bfa" strokeWidth="2.4" transform="rotate(-18 32 33)" opacity=".8" />
      <path d="M33 23.5l2.2 5.3 5.3 2.2-5.3 2.2L33 38.5l-2.2-5.3-5.3-2.2 5.3-2.2z" fill="#f5f3ff" />
      <path d="M53 8l1 2.4 2.4 1-2.4 1L53 15l-1-2.6-2.4-1 2.4-1z" fill="#c4b5fd" />
    </svg>
  )
}

export function Brand({ size = 34, showName = true }: { size?: number; showName?: boolean }) {
  return (
    <span className="brand">
      <LogoMark size={size} />
      {showName && <span className="brand-name">Conecta</span>}
    </span>
  )
}

export function BrandAvatar({ initials, hue, size = 44 }: { initials: string; hue: number; size?: number }) {
  return (
    <span
      className="brand-avatar"
      style={{ width: size, height: size, fontSize: size * 0.34, background: `linear-gradient(135deg, hsl(${hue} 70% 62%), hsl(${(hue + 40) % 360} 65% 42%))` }}
      aria-hidden="true"
    >
      {initials}
    </span>
  )
}
