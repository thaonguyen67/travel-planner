import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const AUTH_TABS = [
  { to: '/login', label: 'Log In', mode: 'login' },
  { to: '/signup', label: 'Sign Up', mode: 'signup' },
]

export function AuthPage({ onLogin, onSignup }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const mode = pathname === '/signup' ? 'signup' : 'login'
  const [input, setInput] = useState({ email: '', password: '' })
  const [message, setMessage] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    const result = mode === 'login' ? onLogin(input) : onSignup(input)
    setMessage(result.message)
    if (result.ok) navigate('/')
  }

  return (
    <main className="flex min-h-[60vh] items-center justify-center bg-background-light px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-primary/10 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-2">
          {AUTH_TABS.map(({ to, label, mode: tabMode }) => (
            <Link
              key={to}
              to={to}
              className={
                mode === tabMode
                  ? 'rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white'
                  : 'rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition-colors hover:border-primary/30 hover:text-primary'
              }
            >
              {label}
            </Link>
          ))}
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="email"
            required
            placeholder="Email"
            className="rounded-xl border border-slate-200 px-4 py-3"
            value={input.email}
            onChange={(e) => setInput((prev) => ({ ...prev, email: e.target.value }))}
          />
          <input
            type="password"
            required
            placeholder="Password"
            className="rounded-xl border border-slate-200 px-4 py-3"
            value={input.password}
            onChange={(e) => setInput((prev) => ({ ...prev, password: e.target.value }))}
          />
          <button type="submit" className="rounded-xl bg-primary py-3 text-sm font-bold text-white">
            {mode === 'login' ? 'Log In' : 'Create Account'}
          </button>
        </form>

        {message ? <p className="mt-4 text-sm text-primary">{message}</p> : null}

        <p className="mt-6 text-center text-sm text-slate-500">
          <Link to="/" className="font-medium text-primary hover:underline">
            ← Back to Home
          </Link>
        </p>
      </div>
    </main>
  )
}
