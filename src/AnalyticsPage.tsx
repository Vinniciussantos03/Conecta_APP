import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDownRight, ArrowUpRight, Building2, Camera, Eye, MessageCircle, Music2, PlayCircle, UsersRound } from 'lucide-react'
import { BrandAvatar } from './components/Brand'
import { weeklyData, recentViewers, segmentShare, networkStats } from './mocks/analytics'
import { formatCompact } from './mocks/brands'

type Range = 4 | 8 | 12

const pct = (a: number, b: number) => (b === 0 ? 0 : Math.round(((a - b) / b) * 100))

function Delta({ value }: { value: number }) {
  const up = value >= 0
  return <small className={up ? 'positive' : 'negative'}>{up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {up ? '+' : ''}{value}% vs. período anterior</small>
}

function ViewsChart({ data }: { data: typeof weeklyData }) {
  const [active, setActive] = useState(data.length - 1)
  const wrap = useRef<HTMLDivElement>(null)
  const [w, setW] = useState(640)
  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setW(Math.max(260, Math.round(entry.contentRect.width))))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const h = w < 500 ? 220 : 270
  const skip = Math.max(1, Math.ceil(data.length / Math.max(2, Math.floor(w / 74))))
  const pad = { l: 40, r: 14, t: 16, b: 30 }
  const max = Math.ceil(Math.max(...data.map((d) => d.views)) / 100) * 100
  const x = (i: number) => pad.l + (i / Math.max(1, data.length - 1)) * (w - pad.l - pad.r)
  const y = (v: number) => pad.t + (1 - v / max) * (h - pad.t - pad.b)
  const line = data.map((d, i) => `${i ? 'L' : 'M'}${x(i)},${y(d.views)}`).join(' ')
  const followersLine = data.map((d, i) => `${i ? 'L' : 'M'}${x(i)},${y(d.followers)}`).join(' ')
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(max * t))
  const current = data[Math.min(active, data.length - 1)]

  return (
    <div className="chart" ref={wrap}>
      <div className="chart-readout" aria-live="polite">
        <span><i className="swatch solid" /> Visualizações <strong>{current.views}</strong></span>
        <span><i className="swatch dashed" /> Novos seguidores <strong>{current.followers}</strong></span>
        <small className="muted">Semana de {current.label}</small>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Gráfico de visualizações do perfil e novos seguidores por semana" onMouseLeave={() => setActive(data.length - 1)}>
        <defs>
          <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--accent)" stopOpacity=".32" />
            <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={w - pad.r} y1={y(t)} y2={y(t)} className="grid-line" />
            <text x={pad.l - 8} y={y(t) + 4} textAnchor="end" className="axis">{t}</text>
          </g>
        ))}
        <path d={`${line} L${x(data.length - 1)},${y(0)} L${x(0)},${y(0)} Z`} fill="url(#area)" />
        <path d={followersLine} fill="none" stroke="var(--accent-2)" strokeWidth="2" strokeDasharray="5 5" />
        <path d={line} fill="none" stroke="var(--accent)" strokeWidth="2.6" strokeLinejoin="round" />
        <line x1={x(active)} x2={x(active)} y1={pad.t} y2={y(0)} className="cursor-line" />
        {data.map((d, i) => (
          <g key={d.label}>
            <circle cx={x(i)} cy={y(d.views)} r={i === active ? 5.5 : 3} className="dot-point" />
            <text x={x(i)} y={h - 9} textAnchor={i === 0 ? 'start' : i === data.length - 1 ? 'end' : 'middle'} className="axis">{(data.length - 1 - i) % skip ? '' : d.label}</text>
            <rect x={x(i) - (w - pad.l - pad.r) / data.length / 2} y={0} width={(w - pad.l - pad.r) / data.length} height={h} fill="transparent" onMouseEnter={() => setActive(i)} onClick={() => setActive(i)} />
          </g>
        ))}
      </svg>
    </div>
  )
}

export default function AnalyticsPage() {
  const [range, setRange] = useState<Range>(8)
  const data = useMemo(() => weeklyData.slice(-range), [range])
  const previous = useMemo(() => weeklyData.slice(-range * 2, -range), [range])
  const sum = (arr: typeof weeklyData, k: 'views' | 'brands' | 'followers') => arr.reduce((s, d) => s + d[k], 0)
  const views = sum(data, 'views')
  const brands = sum(data, 'brands')
  const followers = sum(data, 'followers')
  const maxBrands = Math.max(...data.map((d) => d.brands))

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">DADOS</span>
          <h1>Seu crescimento</h1>
          <p className="muted">Acompanhe quantas marcas viram seu perfil e como sua audiência evoluiu nas últimas semanas.</p>
        </div>
        <div className="segmented" role="tablist" aria-label="Período">
          {([4, 8, 12] as Range[]).map((r) => (
            <button key={r} role="tab" aria-selected={range === r} className={range === r ? 'active' : ''} onClick={() => setRange(r)}>{r} semanas</button>
          ))}
        </div>
      </div>

      <section className="kpi-grid">
        <article className="kpi"><span className="kpi-icon"><Eye size={18} /></span><span className="tiny-label">VISUALIZAÇÕES DO PERFIL</span><strong>{views.toLocaleString('pt-BR')}</strong>{previous.length > 0 ? <Delta value={pct(views, sum(previous, 'views'))} /> : <small className="muted">Primeiro período registrado</small>}</article>
        <article className="kpi"><span className="kpi-icon"><Building2 size={18} /></span><span className="tiny-label">EMPRESAS QUE VIRAM</span><strong>{brands}</strong>{previous.length > 0 ? <Delta value={pct(brands, sum(previous, 'brands'))} /> : <small className="muted">Primeiro período registrado</small>}</article>
        <article className="kpi"><span className="kpi-icon"><UsersRound size={18} /></span><span className="tiny-label">NOVOS SEGUIDORES</span><strong>+{followers.toLocaleString('pt-BR')}</strong>{previous.length > 0 ? <Delta value={pct(followers, sum(previous, 'followers'))} /> : <small className="muted">Primeiro período registrado</small>}</article>
        <article className="kpi"><span className="kpi-icon"><MessageCircle size={18} /></span><span className="tiny-label">TAXA DE RESPOSTA</span><strong>92%</strong><small className="muted">Responde em média em 3h</small></article>
      </section>

      <section className="analytics-grid">
        <div className="panel span-2">
          <div className="panel-head"><div><h2>Visualizações por semana</h2><p className="muted">Passe o mouse ou toque nas semanas para ver os valores.</p></div></div>
          <ViewsChart key={range} data={data} />
        </div>

        <div className="panel">
          <div className="panel-head"><div><h2>Empresas que viram seu perfil</h2><p className="muted">Quantidade de marcas distintas por semana.</p></div></div>
          <div className="bars" role="img" aria-label="Barras de marcas que visitaram o perfil por semana">
            {data.map((d, i) => (
              <div key={d.label} className="bar-col">
                <span className="bar-value">{d.brands}</span>
                <div className="bar-track"><i className={i === data.length - 1 ? 'current' : ''} style={{ height: `${(d.brands / maxBrands) * 100}%` }} /></div>
                <small>{data.length > 8 && i % 2 ? '' : d.label}</small>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-head"><div><h2>Segmentos interessados</h2><p className="muted">De onde vêm as marcas que visitam você.</p></div></div>
          <ul className="hbars">
            {segmentShare.map((s) => (
              <li key={s.segment}>
                <span>{s.segment}</span>
                <div className="hbar"><i style={{ width: `${s.value}%` }} /></div>
                <strong>{s.value}%</strong>
              </li>
            ))}
          </ul>
        </div>

        <div className="panel">
          <div className="panel-head"><div><h2>Visitas recentes</h2><p className="muted">Marcas que interagiram com seu perfil.</p></div></div>
          <ul className="viewer-list">
            {recentViewers.map((v) => (
              <li key={v.brand}>
                <BrandAvatar initials={v.initials} hue={v.hue} size={36} />
                <span><strong>{v.brand}</strong><small>{v.action} · {v.segment}</small></span>
                <time>{v.when}</time>
              </li>
            ))}
          </ul>
        </div>

        <div className="panel">
          <div className="panel-head"><div><h2>Desempenho por rede</h2><p className="muted">Seguidores, engajamento e crescimento no mês.</p></div></div>
          <ul className="network-list">
            {networkStats.map((n) => (
              <li key={n.network} className={n.followers === 0 ? 'off' : ''}>
                <span className="net-icon">{n.network === 'Instagram' ? <Camera size={17} /> : n.network === 'TikTok' ? <Music2 size={17} /> : <PlayCircle size={17} />}</span>
                <span><strong>{n.network}</strong><small>{n.followers ? `${formatCompact(n.followers)} seguidores` : 'Não conectado'}</small></span>
                {n.followers ? <><em>{n.engagement.toLocaleString('pt-BR')}% eng.</em><b className="positive">+{n.growth.toLocaleString('pt-BR')}%</b></> : <em className="muted">Conecte no perfil</em>}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
