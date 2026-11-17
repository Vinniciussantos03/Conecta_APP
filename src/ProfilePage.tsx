import { useEffect, useMemo, useState } from 'react'
import { BadgeCheck, Camera, Check, Circle, FileUp, MapPin, PencilLine, PlayCircle, RotateCcw, Save, Music2 } from 'lucide-react'
import { allNiches, completeness, initialProfile, type Profile, type Social } from './mocks/profile'
import { formatBRL, formatCompact } from './mocks/brands'

type Props = { profile: Profile; onSave: (p: Profile) => void; onReset: () => void }

const networkIcon = (n: Social['network']) => (n === 'Instagram' ? <Camera size={16} /> : n === 'TikTok' ? <Music2 size={16} /> : <PlayCircle size={16} />)

function Ring({ value }: { value: number }) {
  const r = 46
  const c = 2 * Math.PI * r
  return (
    <svg className="ring" viewBox="0 0 120 120" role="img" aria-label={`Perfil ${value}% completo`}>
      <defs>
        <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--grad-a)" />
          <stop offset="1" stopColor="var(--grad-c)" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r={r} fill="none" stroke="var(--surface-3)" strokeWidth="11" />
      <circle cx="60" cy="60" r={r} fill="none" stroke="url(#ring-grad)" strokeWidth="11" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} transform="rotate(-90 60 60)" style={{ transition: 'stroke-dashoffset .5s ease' }} />
      <text x="60" y="58" textAnchor="middle" className="ring-value">{value}%</text>
      <text x="60" y="76" textAnchor="middle" className="ring-label">completo</text>
    </svg>
  )
}

export default function ProfilePage({ profile, onSave, onReset }: Props) {
  const [draft, setDraft] = useState<Profile>(profile)
  const [toast, setToast] = useState('')
  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => setToast(''), 2600)
    return () => window.clearTimeout(t)
  }, [toast])

  const saved = useMemo(() => completeness(profile), [profile])
  const live = useMemo(() => completeness(draft), [draft])
  const dirty = JSON.stringify(draft) !== JSON.stringify(profile)
  const totalFollowers = profile.socials.reduce((s, x) => s + x.followers, 0)

  const set = <K extends keyof Profile>(key: K, value: Profile[K]) => setDraft((d) => ({ ...d, [key]: value }))
  const setSocial = (i: number, patch: Partial<Social>) => setDraft((d) => ({ ...d, socials: d.socials.map((s, idx) => (idx === i ? { ...s, ...patch } : s)) }))
  const toggleNiche = (n: string) => setDraft((d) => ({ ...d, niches: d.niches.includes(n) ? d.niches.filter((x) => x !== n) : [...d.niches, n] }))
  const focusField = (key: string) => {
    const el = document.getElementById(`field-${key}`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    window.setTimeout(() => el?.focus({ preventScroll: true }), 300)
  }

  const save = () => {
    const next = { ...draft, handle: draft.handle.replace(/^@/, '').trim() }
    onSave(next)
    setDraft(next)
    setToast('Perfil atualizado com sucesso!')
  }

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">CADASTRO</span>
          <h1>Meu perfil</h1>
          <p className="muted">Veja como as marcas enxergam você e mantenha seu cadastro completo para aparecer mais nas buscas.</p>
        </div>
      </div>

      <div className="profile-layout">
        <div className="profile-col">
          <section className="panel profile-card">
            <div className="profile-cover" aria-hidden="true" />
            <div className="profile-identity">
              <span className="avatar xl">{(profile.name[0] || 'A').toUpperCase()}</span>
              <h2>@{profile.handle} <BadgeCheck size={18} className="verified" /></h2>
              <small>{profile.role}</small>
              <span className="muted location"><MapPin size={14} /> {profile.city || 'Cidade não informada'}</span>
            </div>
            <div className="profile-stats">
              <div><strong>{formatCompact(totalFollowers)}</strong><span>Seguidores</span></div>
              <div><strong>{profile.partnerships}</strong><span>Parcerias</span></div>
              <div><strong>{profile.engagement.toLocaleString('pt-BR')}%</strong><span>Engajamento</span></div>
            </div>
            <p className="profile-bio">{profile.bio || 'Sem bio por enquanto.'}</p>
            <div className="chips compact center">{profile.niches.map((n) => <span key={n} className="chip static">{n}</span>)}</div>
            <button className="gradient-button wide" onClick={() => focusField('name')}><PencilLine size={16} /> Editar perfil</button>
            <div className="highlights">
              {['Meu dia', 'Looks', 'Viagens', 'Projetos'].map((h, i) => (
                <span key={h} className="highlight"><i style={{ background: `linear-gradient(135deg, hsl(${270 + i * 18} 70% 65%), hsl(${300 + i * 12} 60% 40%))` }} />{h}</span>
              ))}
            </div>
          </section>

          <section className="panel completeness">
            <div className="completeness-top">
              <Ring value={saved.score} />
              <div>
                <h2>Força do perfil</h2>
                <p className="muted">{saved.score >= 100 ? 'Perfeito! Seu perfil está completo.' : `Faltam ${saved.items.filter((i) => !i.done).length} itens para chegar a 100%.`}</p>
                {dirty && live.score !== saved.score && <small className="pending">Ao salvar: {live.score}%</small>}
              </div>
            </div>
            <ul className="todo-list">
              {saved.items.map((item) => (
                <li key={item.key} className={item.done ? 'done' : ''}>
                  {item.done ? <Check size={15} /> : <Circle size={15} />}
                  <span>{item.label}</span>
                  {!item.done && <button className="text-link" onClick={() => focusField(item.key)}>Resolver</button>}
                  <em>+{item.weight}%</em>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="panel form-panel">
          <div className="panel-head">
            <div><h2>Dados do cadastro</h2><p className="muted">As alterações aparecem no seu perfil público assim que você salvar.</p></div>
          </div>

          <div className="form-grid">
            <label className="field"><span>Nome completo</span><input id="field-name" value={draft.name} onChange={(e) => set('name', e.target.value)} /></label>
            <label className="field"><span>Usuário (@)</span><input value={draft.handle} onChange={(e) => set('handle', e.target.value)} /></label>
            <label className="field"><span>Cidade</span><input id="field-city" value={draft.city} onChange={(e) => set('city', e.target.value)} placeholder="Ex.: Fortaleza - CE" /></label>
            <label className="field"><span>Telefone / WhatsApp</span><input id="field-contact" value={draft.phone} onChange={(e) => set('phone', e.target.value)} placeholder="(85) 90000-0000" inputMode="tel" /></label>
            <label className="field"><span>E-mail</span><input type="email" value={draft.email} onChange={(e) => set('email', e.target.value)} /></label>
            <label className="field"><span>Valor inicial por publicação (R$)</span><input id="field-price" type="number" min={0} step={50} value={draft.priceFrom} onChange={(e) => set('priceFrom', Math.max(0, Number(e.target.value) || 0))} /></label>
            <label className="field full">
              <span>Bio <em className="counter">{draft.bio.trim().length}/220</em></span>
              <textarea id="field-bio" rows={3} maxLength={220} value={draft.bio} onChange={(e) => set('bio', e.target.value)} />
            </label>
          </div>

          <div className="form-block">
            <span className="field-label">Nichos de conteúdo</span>
            <div className="chips" id="field-niches" tabIndex={-1}>
              {allNiches.map((n) => (
                <button key={n} type="button" className={`chip ${draft.niches.includes(n) ? 'active' : ''}`} onClick={() => toggleNiche(n)} aria-pressed={draft.niches.includes(n)}>{n}</button>
              ))}
            </div>
          </div>

          <div className="form-block">
            <span className="field-label">Redes sociais</span>
            <div className="social-list" id="field-socials" tabIndex={-1}>
              {draft.socials.map((s, i) => (
                <div key={s.network} className="social-row">
                  <span className="social-name">{networkIcon(s.network)} {s.network}</span>
                  <input value={s.handle} onChange={(e) => setSocial(i, { handle: e.target.value })} placeholder="@seuusuario" aria-label={`Usuário no ${s.network}`} />
                  <input type="number" min={0} value={s.followers} onChange={(e) => setSocial(i, { followers: Math.max(0, Number(e.target.value) || 0) })} aria-label={`Seguidores no ${s.network}`} />
                </div>
              ))}
            </div>
          </div>

          <div className="form-block">
            <span className="field-label">Mídia kit</span>
            <div className="upload-box" id="field-mediaKit" tabIndex={-1}>
              <FileUp size={22} />
              <div>
                <strong>{draft.mediaKit ? 'midia-kit-andressa.pdf' : 'Envie seu mídia kit em PDF'}</strong>
                <small className="muted">{draft.mediaKit ? 'Arquivo anexado (simulação)' : 'Marcas com acesso ao mídia kit respondem 2x mais rápido.'}</small>
              </div>
              <button type="button" className="outline-button" onClick={() => set('mediaKit', !draft.mediaKit)}>{draft.mediaKit ? 'Remover' : 'Anexar arquivo'}</button>
            </div>
          </div>

          <div className="form-footer">
            <small className="muted">Valor atual a partir de {formatBRL(profile.priceFrom)} por publicação.</small>
            <div>
              <button type="button" className="outline-button" onClick={() => { onReset(); setDraft(initialProfile); setToast('Dados de demonstração restaurados.') }} title="Restaurar dados de demonstração"><RotateCcw size={15} /> Restaurar</button>
              <button type="button" className="outline-button" disabled={!dirty} onClick={() => setDraft(profile)}>Descartar</button>
              <button type="button" className="gradient-button" disabled={!dirty} onClick={save}><Save size={15} /> Salvar alterações</button>
            </div>
          </div>
        </section>
      </div>

      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  )
}
