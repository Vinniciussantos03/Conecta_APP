import { useId } from 'react'

export default function Sparkline({ values, height = 42 }: { values: number[]; height?: number }) {
  const id = useId()
  const width = 160
  const max = Math.max(...values)
  const min = Math.min(...values)
  const pts = values.map((v, i) => [(i / (values.length - 1)) * width, height - 4 - ((v - min) / (max - min || 1)) * (height - 8)])
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  return (
    <svg className="sparkline" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--accent)" stopOpacity=".35" />
          <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${line} L${width},${height} L0,${height} Z`} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke="var(--accent)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}
