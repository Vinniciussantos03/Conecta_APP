import { useState, type FormEvent } from 'react'
import { ArrowRight, Eye, EyeOff, LoaderCircle, LockKeyhole, Moon, Sparkles, Sun, UserRound } from 'lucide-react'
import { Brand, LogoMark } from './components/Brand'

type Props = { onLogin: () => void; theme: 'dark' | 'light'; onToggleTheme: () => void }

export default function Login({ onLogin, theme, onToggleTheme }: Props) {
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = (event: FormEvent) => {
    event.preventDefault()
    setError('')
    if (!user.trim() || !password) {
      setError('Preencha usuário e senha para entrar.')
      return
    }
    setBusy(true)
    window.setTimeout(() => {
      if (user.trim().toLowerCase() === 'andressa' && password === '12345') {
        onLogin()
      } else {
        setBusy(false)
        setError('Usuário ou senha incorretos. Confira os dados e tente novamente.')
      }
    }, 650)
  }

  return (
    <main className="auth-shell">
      <section className="auth-intro">
        <div className="auth-glow" aria-hidden="true" />
        <div className="auth-hero">
          <LogoMark size={132} />
          <h1 className="auth-wordmark">Conecta</h1>
          <p className="auth-tagline">Seu talento<br />no lugar certo.</p>
          <p className="auth-copy">Conecte-se com marcas, agências e oportunidades que combinam com o seu perfil.</p>
        </div>
        <ul className="auth-highlights">
          <li><strong>+120</strong><span>marcas ativas</span></li>
          <li><strong>R$ 1,4M</strong><span>pagos a criadores</span></li>
          <li><strong>4,8</strong><span>nota média das parcerias</span></li>
        </ul>
      </section>

      <section className="auth-panel">
        <div className="auth-panel-top">
          <span className="auth-mobile-brand"><Brand size={30} /></span>
          <button className="icon-button" type="button" onClick={onToggleTheme} aria-label={theme === 'dark' ? 'Usar tema claro' : 'Usar tema escuro'}>
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
        <form className="auth-card" onSubmit={submit} noValidate>
          <span className="eyebrow"><Sparkles size={13} /> ÁREA DO CRIADOR</span>
          <h2>Entre na sua conta</h2>
          <p className="muted">Acompanhe oportunidades, seu perfil e quem está de olho no seu trabalho.</p>

          <label className="field">
            <span>Usuário</span>
            <span className="input-icon">
              <UserRound size={17} />
              <input value={user} onChange={(e) => setUser(e.target.value)} placeholder="Seu usuário" autoComplete="username" autoFocus />
            </span>
          </label>
          <label className="field">
            <span>Senha</span>
            <span className="input-icon">
              <LockKeyhole size={17} />
              <input type={show ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Sua senha" autoComplete="current-password" />
              <button type="button" className="input-action" onClick={() => setShow((v) => !v)} aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}>
                {show ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </span>
          </label>

          {error && <p className="form-error" role="alert">{error}</p>}

          <button className="gradient-button wide" type="submit" disabled={busy}>
            {busy ? <><LoaderCircle className="spin" size={18} /> Entrando...</> : <>Entrar <ArrowRight size={18} /></>}
          </button>
          <button className="outline-button wide" type="button" onClick={() => setError('Cadastro de novas contas chega na próxima etapa do protótipo.')}>Criar conta</button>

          <p className="demo-hint">Protótipo — acesso de demonstração: <strong>andressa</strong> / <strong>12345</strong></p>
        </form>
      </section>
    </main>
  )
}
