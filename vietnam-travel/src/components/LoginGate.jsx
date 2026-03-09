import { Link } from 'react-router-dom'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=95'

export function LoginGate({ title, message }) {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col lg:flex-row">
      {/* Left: Hero panel */}
      <div className="relative hidden min-h-[280px] flex-1 lg:flex lg:min-h-full lg:flex-col lg:justify-end">
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE}
            alt="Vietnam travel"
            className="h-full w-full object-cover"
            style={{ filter: 'saturate(1.15) contrast(1.08) brightness(1.02)' }}
          />
        </div>
        <div className="relative z-10 p-8 lg:p-12">
          <p className="max-w-sm text-lg font-medium leading-relaxed text-white drop-shadow-lg">
            Discover hidden gems and plan your perfect journey across Vietnam.
          </p>
          <p className="mt-4 flex items-center gap-2 text-sm text-white/90 drop-shadow-md">
            <span className="material-symbols-outlined text-base">location_on</span>
            From Ha Long Bay to the Mekong Delta
          </p>
        </div>
      </div>

      {/* Mobile hero strip */}
      <div className="relative h-32 overflow-hidden lg:hidden">
        <img
          src={HERO_IMAGE}
          alt=""
          className="h-full w-full object-cover"
          style={{ filter: 'saturate(1.15) contrast(1.08) brightness(1.02)' }}
        />
      </div>

      {/* Right: Message panel */}
      <div className="relative flex flex-1 flex-col justify-center overflow-hidden px-6 py-10 lg:px-16 lg:py-12">
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, #f6f8f7 0%, #e8f5f0 35%, #fef7ed 70%, #f6f8f7 100%)',
          }}
        />
        <div
          className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-primary/5 blur-3xl"
          aria-hidden
        />
        <div
          className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl"
          aria-hidden
        />
        <div
          className="absolute right-1/4 top-1/3 h-40 w-40 rounded-full bg-primary/5 blur-2xl"
          aria-hidden
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent"
          aria-hidden
        />
        <div className="relative z-10 mx-auto w-full max-w-md">
          <div className="mb-8 lg:mb-10">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">{title}</h1>
            <p className="mt-1 text-slate-600">{message}</p>
          </div>

          <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-sm lg:p-8">
            <Link
              to="/login"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-colors hover:bg-primary/90"
            >
              <span className="material-symbols-outlined text-lg">login</span>
              Go to Login
            </Link>
          </div>

          <p className="mt-6 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-primary"
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
              Back to Home
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
