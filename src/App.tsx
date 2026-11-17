import { useEffect, useState } from 'react'
import { BarChart3, Bell, BriefcaseBusiness, Home, LogOut, Menu, Moon, Search, Sun, UserRound, X } from 'lucide-react'
import Login from './Login'
import HomePage from './HomePage'
import BrandsPage from './BrandsPage'
import ProfilePage from './ProfilePage'
import AnalyticsPage from './AnalyticsPage'
import { Brand } from './components/Brand'
import { usePersistentState } from './hooks'
import { initialProfile, completeness, type Profile } from './mocks/profile'

export type Page = 'inicio' | 'marcas' | 'perfil' | 'dados'
export type Theme = 'dark' | 'light'

const nav: { id: Page; label: string; icon: typeof Home }[] = [
  { id: 'inicio', label: 'Início', icon: Home },
  { id: 'marcas', label: 'Marcas', icon: BriefcaseBusiness },
  { id: 'perfil', label: 'Meu perfil', icon: UserRound },
  { id: 'dados', label: 'Dados', icon: BarChart3 },
]

const pageTitles: Record<Page, string> = { inicio: 'Início', marcas: 'Marcas e oportunidades', perfil: 'Meu perfil', dados: 'Dados e crescimento' }

export default function App() {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('conecta-theme') === 'light' ? 'light' : 'dark'))
  const [logged, setLogged] = useState(() => sessionStorage.getItem('conecta-session') === 'andressa')
  const [page, setPage] = useState<Page>('inicio')
  const [menuOpen, setMenuOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [notifOpen, setNotifOpen] = useState(false)
  const [profile, setProfile] = usePersistentState<Profile>('conecta-profile', initialProfile)
  const [saved, setSaved] = usePersistentState<string[]>('conecta-saved', ['aurora'])
  const [applied, setApplied] = usePersistentState<string[]>('conecta-applied', ['lumi'])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('conecta-theme', theme)
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0c0614' : '#f7f4fd')
  }, [theme])

  useEffect(() => { window.scrollTo(0, 0) }, [page])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  const go = (next: Page) => { setPage(next); setMenuOpen(false); setNotifOpen(false) }

  if (!logged) {
    return <Login theme={theme} onToggleTheme={toggleTheme} onLogin={() => { sessionStorage.setItem('conecta-session', 'andressa'); setPage('inicio'); setLogged(true) }} />
  }

  const logout = () => { sessionStorage.removeItem('conecta-session'); setLogged(false); setMenuOpen(false) }
  const { score } = completeness(profile)
  const firstName = profile.name.split(' ')[0] || 'Criadora'
  const toggle = (list: string[], id: string) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id])

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`} aria-label="Navegação principal">
        <div className="sidebar-brand">
          <Brand size={34} />
          <button className="icon-button mobile-only" onClick={() => setMenuOpen(false)} aria-label="Fechar menu"><X size={20} /></button>
        </div>
        <nav className="nav">
          {nav.map(({ id, label, icon: Icon }) => (
            <button key={id} className={`nav-item ${page === id ? 'active' : ''}`} onClick={() => go(id)} aria-current={page === id ? 'page' : undefined}>
              <Icon size={18} /> <span>{label}</span>
              {id === 'marcas' && <em className="nav-badge">{applied.length}</em>}
            </button>
          ))}
        </nav>
        <div className="sidebar-card">
          <span className="tiny-label">PERFIL {score}% COMPLETO</span>
          <div className="progress"><i style={{ width: `${score}%` }} /></div>
          <p>Perfis completos recebem até 3x mais visitas de marcas.</p>
          <button className="text-link" onClick={() => go('perfil')}>Completar perfil</button>
        </div>
        <button className="nav-item logout" onClick={logout}><LogOut size={18} /> <span>Sair</span></button>
      </aside>
      {menuOpen && <button className="mobile-overlay" aria-label="Fechar menu" onClick={() => setMenuOpen(false)} />}

      <div className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-button mobile-only" onClick={() => setMenuOpen(true)} aria-label="Abrir menu"><Menu size={21} /></button>
            <span className="mobile-only"><Brand size={28} /></span>
            <span className="topbar-title desktop-only">{pageTitles[page]}</span>
          </div>
          <label className="topbar-search">
            <Search size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') go('marcas') }}
              placeholder="Buscar marcas, agências ou oportunidades..."
              aria-label="Buscar marcas e oportunidades"
            />
          </label>
          <div className="topbar-actions">
            <button className="icon-button" onClick={toggleTheme} aria-label={theme === 'dark' ? 'Usar tema claro' : 'Usar tema escuro'} title={theme === 'dark' ? 'Tema claro' : 'Tema escuro'}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="notif-wrap">
              <button className="icon-button" onClick={() => setNotifOpen((v) => !v)} aria-label="Notificações" aria-expanded={notifOpen}>
                <Bell size={18} /><i className="dot" />
              </button>
              {notifOpen && (
                <div className="notif-pop" role="dialog" aria-label="Notificações">
                  <strong>Notificações</strong>
                  <button onClick={() => go('dados')}><b>Aurora Cosméticos</b> salvou seu perfil<small>há 2 horas</small></button>
                  <button onClick={() => go('marcas')}><b>Brisa Beauty</b> abriu uma campanha com 91% de match<small>hoje</small></button>
                  <button onClick={() => go('perfil')}>Adicione seu mídia kit para subir no ranking<small>ontem</small></button>
                </div>
              )}
            </div>
            <button className="user-chip" onClick={() => go('perfil')} aria-label="Abrir meu perfil">
              <span className="avatar sm">{firstName[0]}</span>
              <span className="desktop-only"><strong>{firstName}</strong><small>@{profile.handle}</small></span>
            </button>
          </div>
        </header>

        <main className="content" key={page}>
          {page === 'inicio' && <HomePage profile={profile} score={score} applied={applied} saved={saved} onNavigate={go} />}
          {page === 'marcas' && (
            <BrandsPage
              search={search}
              onSearch={setSearch}
              saved={saved}
              applied={applied}
              onToggleSave={(id) => setSaved((s) => toggle(s, id))}
              onApply={(id) => setApplied((a) => (a.includes(id) ? a : [...a, id]))}
              onWithdraw={(id) => setApplied((a) => a.filter((x) => x !== id))}
            />
          )}
          {page === 'perfil' && <ProfilePage profile={profile} onSave={setProfile} onReset={() => setProfile(initialProfile)} />}
          {page === 'dados' && <AnalyticsPage />}
        </main>
      </div>
    </div>
  )
}
