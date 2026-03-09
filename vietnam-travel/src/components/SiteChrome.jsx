import { Link, NavLink } from 'react-router-dom'

const linkClass = ({ isActive }) =>
  isActive
    ? 'text-primary text-sm font-bold border-b-2 border-primary pb-1'
    : 'text-slate-600 text-sm font-semibold hover:text-primary transition-colors'

export function SiteHeader({ currentUser, onLogout }) {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-primary/10 bg-white/80 px-6 py-4 backdrop-blur-md md:px-20">
      <Link to="/" className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-full bg-primary text-white">
          <span className="material-symbols-outlined text-base">explore</span>
        </div>
        <h2 className="text-lg font-bold leading-tight tracking-tight text-slate-900">
          Vietnam<span className="text-orange-500">Travel</span>
        </h2>
      </Link>

      <nav className="hidden items-center gap-8 md:flex">
        <NavLink to="/" className={linkClass} end>
          Home
        </NavLink>
        <NavLink to="/destinations" className={linkClass}>
          Destinations
        </NavLink>
        <NavLink to="/planner" className={linkClass}>
          Plan Your Trip
        </NavLink>
        <NavLink to="/profile" className={linkClass}>
          My Profile
        </NavLink>
      </nav>

      {currentUser ? (
        <button
          type="button"
          className="rounded-full bg-primary px-5 py-2 text-xs font-bold text-white hover:bg-primary/90"
          onClick={onLogout}
        >
          Log Out
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="rounded-full border border-primary px-4 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/5"
          >
            Log In
          </Link>
          <Link
            to="/signup"
            className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary/90"
          >
            Sign Up
          </Link>
        </div>
      )}
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="relative mt-12 overflow-hidden border-t border-primary/10 bg-gradient-to-b from-white to-primary/5 px-6 py-12">
      <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-primary/5 blur-3xl" aria-hidden />
      <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-orange-500/5 blur-3xl" aria-hidden />
      <div className="relative mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-xs text-slate-500">
            © 2026 Vietnam Travel Guidebook and AI Itinerary Planner. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-slate-400">
            <span className="material-symbols-outlined text-base">location_on</span>
            <span className="text-xs">Vietnam</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
