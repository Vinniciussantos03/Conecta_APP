import { useEffect, useMemo, useState } from 'react'
import { BadgeCheck, Bookmark, BookmarkCheck, CalendarClock, Check, MapPin, Search, Send, SlidersHorizontal, Users, Wallet, X } from 'lucide-react'
import { BrandAvatar } from './components/Brand'
import { opportunities, segments, formatBRL, formatCompact, type Opportunity, type Segment } from './mocks/brands'

type Props = {
  search: string
  onSearch: (value: string) => void
  saved: string[]
  applied: string[]
  onToggleSave: (id: string) => void
  onApply: (id: string) => void
  onWithdraw: (id: string) => void
}

type Tab = 'todas' | 'salvas' | 'candidaturas'
type Sort = 'match' | 'valor' | 'prazo'

const deadlineOrder = (d: string) => {
  const [day, month] = d.split(' ')
  return (month === 'dez' ? 100 : 0) + Number(day)
}

export default function BrandsPage({ search, onSearch, saved, applied, onToggleSave, onApply, onWithdraw }: Props) {
  const [segment, setSegment] = useState<Segment | 'Todos'>('Todos')
  const [tab, setTab] = useState<Tab>('todas')
  const [sort, setSort] = useState<Sort>('match')
  const [detail, setDetail] = useState<Opportunity | null>(null)
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => setToast(''), 2600)
    return () => window.clearTimeout(t)
  }, [toast])

  useEffect(() => {
    if (!detail) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setDetail(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [detail])

  const list = useMemo(() => {
    const q = search.trim().toLowerCase()
    return opportunities
      .filter((o) => segment === 'Todos' || o.segment === segment)
      .filter((o) => tab === 'todas' || (tab === 'salvas' ? saved.includes(o.id) : applied.includes(o.id)))
      .filter((o) => !q || [o.brand, o.campaign, o.summary, o.segment, ...o.looking].join(' ').toLowerCase().includes(q))
      .sort((a, b) => (sort === 'match' ? b.match - a.match : sort === 'valor' ? b.budget[1] - a.budget[1] : deadlineOrder(a.deadline) - deadlineOrder(b.deadline)))
  }, [search, segment, tab, sort, saved, applied])

  const apply = (o: Opportunity) => { onApply(o.id); setToast(`Candidatura enviada para ${o.brand}!`) }
  const withdraw = (o: Opportunity) => { onWithdraw(o.id); setToast(`Candidatura para ${o.brand} cancelada.`) }

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">MARCAS</span>
          <h1>Oportunidades para você</h1>
          <p className="muted">Grandes marcas procurando criadores com o seu perfil. Veja o que cada uma busca e candidate-se.</p>
        </div>
        <div className="heading-stats">
          <div><strong>{opportunities.length}</strong><span>abertas</span></div>
          <div><strong>{applied.length}</strong><span>candidaturas</span></div>
          <div><strong>{saved.length}</strong><span>salvas</span></div>
        </div>
      </div>

      <div className="toolbar">
        <label className="search-field">
          <Search size={16} />
          <input value={search} onChange={(e) => onSearch(e.target.value)} placeholder="Buscar por marca, campanha ou nicho" aria-label="Buscar oportunidades" />
          {search && <button className="input-action" onClick={() => onSearch('')} aria-label="Limpar busca"><X size={15} /></button>}
        </label>
        <div className="segmented" role="tablist" aria-label="Filtrar lista">
          {(['todas', 'salvas', 'candidaturas'] as Tab[]).map((t) => (
            <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>
              {t === 'todas' ? 'Todas' : t === 'salvas' ? 'Salvas' : 'Candidaturas'}
            </button>
          ))}
        </div>
        <label className="select-field">
          <SlidersHorizontal size={15} />
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label="Ordenar por">
            <option value="match">Melhor match</option>
            <option value="valor">Maior valor</option>
            <option value="prazo">Prazo mais próximo</option>
          </select>
        </label>
      </div>

      <div className="chips" role="group" aria-label="Segmentos">
        {(['Todos', ...segments] as const).map((s) => (
          <button key={s} className={`chip ${segment === s ? 'active' : ''}`} onClick={() => setSegment(s)} aria-pressed={segment === s}>{s}</button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="empty-state panel">
          <Search size={26} />
          <strong>Nenhuma oportunidade encontrada</strong>
          <p className="muted">Tente outro termo, segmento ou volte para todas as oportunidades.</p>
          <button className="outline-button" onClick={() => { onSearch(''); setSegment('Todos'); setTab('todas') }}>Limpar filtros</button>
        </div>
      ) : (
        <div className="opportunity-grid">
          {list.map((o) => {
            const isSaved = saved.includes(o.id)
            const isApplied = applied.includes(o.id)
            return (
              <article key={o.id} className="opportunity-card">
                <header>
                  <BrandAvatar initials={o.initials} hue={o.hue} />
                  <div className="op-brand">
                    <strong>{o.brand} {o.verified && <BadgeCheck size={15} className="verified" aria-label="Marca verificada" />}</strong>
                    <small>{o.segment} · {o.brandFollowers} seguidores</small>
                  </div>
                  <button className={`icon-button save ${isSaved ? 'on' : ''}`} onClick={() => onToggleSave(o.id)} aria-label={isSaved ? 'Remover dos salvos' : 'Salvar oportunidade'} aria-pressed={isSaved}>
                    {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                  </button>
                </header>
                <div className="op-campaign">
                  <span className="tag">Campanha</span>
                  {o.isNew && <span className="tag new">Nova</span>}
                  <span className="match">{o.match}% match</span>
                </div>
                <h3>{o.campaign}</h3>
                <p>{o.summary}</p>
                <div className="looking">
                  <span className="tiny-label">O QUE ESTÃO PROCURANDO</span>
                  <ul>{o.looking.map((l) => <li key={l}><Check size={13} /> {l}</li>)}</ul>
                </div>
                <div className="op-meta">
                  <span><MapPin size={14} /> {o.region} · {o.mode}</span>
                  <span><Wallet size={14} /> {formatBRL(o.budget[0])}–{formatBRL(o.budget[1])}</span>
                  <span><CalendarClock size={14} /> até {o.deadline}</span>
                </div>
                <footer>
                  <button className="outline-button" onClick={() => setDetail(o)}>Ver detalhes</button>
                  {isApplied
                    ? <button className="applied-button" onClick={() => withdraw(o)} title="Cancelar candidatura"><Check size={16} /> Candidatura enviada</button>
                    : <button className="gradient-button" onClick={() => apply(o)}><Send size={15} /> Candidatar-se</button>}
                </footer>
              </article>
            )
          })}
        </div>
      )}

      {detail && (
        <div className="modal-backdrop" onClick={() => setDetail(null)}>
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="op-title" onClick={(e) => e.stopPropagation()}>
            <button className="icon-button modal-close" onClick={() => setDetail(null)} aria-label="Fechar"><X size={18} /></button>
            <div className="modal-head">
              <BrandAvatar initials={detail.initials} hue={detail.hue} size={56} />
              <div>
                <strong className="modal-brand">{detail.brand} {detail.verified && <BadgeCheck size={16} className="verified" />}</strong>
                <small className="muted">{detail.segment} · {detail.brandFollowers} seguidores</small>
              </div>
            </div>
            <h2 id="op-title">{detail.campaign}</h2>
            <p>{detail.summary}</p>
            <div className="detail-grid">
              <div><span className="tiny-label">REMUNERAÇÃO</span><strong>{formatBRL(detail.budget[0])}–{formatBRL(detail.budget[1])}</strong></div>
              <div><span className="tiny-label">SEGUIDORES MÍNIMOS</span><strong>{formatCompact(detail.minFollowers)}</strong></div>
              <div><span className="tiny-label">VAGAS</span><strong><Users size={15} /> {detail.slots}</strong></div>
              <div><span className="tiny-label">PRAZO</span><strong>{detail.deadline}</strong></div>
            </div>
            <span className="tiny-label">FORMATOS</span>
            <div className="chips compact">{detail.formats.map((f) => <span key={f} className="chip static">{f}</span>)}</div>
            <span className="tiny-label">O QUE A MARCA BUSCA</span>
            <ul className="check-list">{detail.looking.map((l) => <li key={l}><Check size={14} /> {l}</li>)}</ul>
            <div className="match-box">
              <strong>{detail.match}% de compatibilidade</strong>
              <div className="progress"><i style={{ width: `${detail.match}%` }} /></div>
              <small className="muted">Calculado com base no seu nicho, região e engajamento.</small>
            </div>
            <div className="modal-actions">
              <button className="outline-button" onClick={() => onToggleSave(detail.id)}>{saved.includes(detail.id) ? 'Remover dos salvos' : 'Salvar'}</button>
              {applied.includes(detail.id)
                ? <button className="applied-button" onClick={() => withdraw(detail)}><Check size={16} /> Candidatura enviada</button>
                : <button className="gradient-button" onClick={() => apply(detail)}><Send size={15} /> Candidatar-se</button>}
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  )
}
