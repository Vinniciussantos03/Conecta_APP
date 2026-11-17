import { ArrowRight, ArrowUpRight, BadgeCheck, BriefcaseBusiness, Eye, Sparkles, Target } from 'lucide-react'
import type { Page } from './App'
import { BrandAvatar } from './components/Brand'
import Sparkline from './components/Sparkline'
import { opportunities, formatBRL } from './mocks/brands'
import { recentViewers, weeklyData } from './mocks/analytics'
import type { Profile } from './mocks/profile'

type Props = { profile: Profile; score: number; applied: string[]; saved: string[]; onNavigate: (page: Page) => void }

export default function HomePage({ profile, score, applied, saved, onNavigate }: Props) {
  const firstName = profile.name.split(' ')[0] || 'Criadora'
  const last = weeklyData[weeklyData.length - 1]
  const prev = weeklyData[weeklyData.length - 2]
  const growth = Math.round(((last.views - prev.views) / prev.views) * 100)
  const highlights = [...opportunities].sort((a, b) => b.match - a.match).slice(0, 3)
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'

  return (
    <div className="page">
      <section className="hero-card">
        <div>
          <span className="eyebrow light"><Sparkles size={13} /> SEU RESUMO DA SEMANA</span>
          <h1>{greeting}, {firstName}!</h1>
          <p><strong>{last.brands} marcas</strong> viram seu perfil nesta semana e suas visualizações cresceram <strong>{growth}%</strong>. Bora transformar isso em parceria?</p>
          <div className="hero-actions">
            <button className="light-button" onClick={() => onNavigate('marcas')}>Ver oportunidades <ArrowRight size={17} /></button>
            <button className="ghost-light" onClick={() => onNavigate('dados')}>Ver meus dados</button>
          </div>
        </div>
        <div className="hero-orbit" aria-hidden="true"><span /><span /><span /></div>
      </section>

      <section className="kpi-grid">
        <article className="kpi">
          <span className="kpi-icon"><Eye size={18} /></span>
          <span className="tiny-label">VISUALIZAÇÕES (7 DIAS)</span>
          <strong>{last.views}</strong>
          <small className="positive"><ArrowUpRight size={14} /> {growth}% vs. semana anterior</small>
          <Sparkline values={weeklyData.slice(-12).map((w) => w.views)} />
        </article>
        <article className="kpi">
          <span className="kpi-icon"><BadgeCheck size={18} /></span>
          <span className="tiny-label">MARCAS QUE VIRAM VOCÊ</span>
          <strong>{last.brands}</strong>
          <small className="positive"><ArrowUpRight size={14} /> +{last.brands - prev.brands} nesta semana</small>
          <Sparkline values={weeklyData.slice(-12).map((w) => w.brands)} />
        </article>
        <article className="kpi">
          <span className="kpi-icon"><BriefcaseBusiness size={18} /></span>
          <span className="tiny-label">CANDIDATURAS ATIVAS</span>
          <strong>{applied.length}</strong>
          <small>{saved.length} oportunidade{saved.length === 1 ? '' : 's'} salva{saved.length === 1 ? '' : 's'}</small>
          <button className="text-link" onClick={() => onNavigate('marcas')}>Acompanhar <ArrowRight size={14} /></button>
        </article>
        <article className="kpi">
          <span className="kpi-icon"><Target size={18} /></span>
          <span className="tiny-label">PERFIL COMPLETO</span>
          <strong>{score}%</strong>
          <div className="progress"><i style={{ width: `${score}%` }} /></div>
          <button className="text-link" onClick={() => onNavigate('perfil')}>{score < 100 ? 'Completar agora' : 'Ver perfil'} <ArrowRight size={14} /></button>
        </article>
      </section>

      <section className="split-grid">
        <div className="panel">
          <div className="panel-head">
            <div><h2>Oportunidades em destaque</h2><p className="muted">Selecionadas pelo seu nicho e engajamento.</p></div>
            <button className="text-link" onClick={() => onNavigate('marcas')}>Ver todas <ArrowRight size={14} /></button>
          </div>
          <div className="mini-list">
            {highlights.map((o) => (
              <button key={o.id} className="mini-opportunity" onClick={() => onNavigate('marcas')}>
                <BrandAvatar initials={o.initials} hue={o.hue} />
                <span className="mini-copy">
                  <strong>{o.brand} {o.verified && <BadgeCheck size={14} className="verified" />}</strong>
                  <small>{o.campaign} · {o.segment}</small>
                </span>
                <span className="mini-meta">
                  <em className="match">{o.match}% match</em>
                  <small>{formatBRL(o.budget[0])}–{formatBRL(o.budget[1])}</small>
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="panel">
          <div className="panel-head">
            <div><h2>Quem viu seu perfil</h2><p className="muted">Atividade recente de marcas.</p></div>
            <button className="text-link" onClick={() => onNavigate('dados')}>Detalhes <ArrowRight size={14} /></button>
          </div>
          <ul className="viewer-list">
            {recentViewers.slice(0, 4).map((v) => (
              <li key={v.brand}>
                <BrandAvatar initials={v.initials} hue={v.hue} size={36} />
                <span><strong>{v.brand}</strong><small>{v.action}</small></span>
                <time>{v.when}</time>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
