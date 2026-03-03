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
    <footer className="mt-12 border-t border-primary/10 bg-white px-6 py-8">
      <div className="mx-auto grid w-full max-w-6xl gap-8 md:grid-cols-4">
        <div className="space-y-2">
          <h3 className="font-bold text-primary">VietnamTravel</h3>
          <p className="text-xs text-slate-500">
            Your premium companion for discovering the timeless charm and hidden gems of Vietnam.
          </p>
        </div>
        <div className="space-y-2 text-sm text-slate-500">
          <h4 className="font-semibold text-slate-900">Explore</h4>
          <p>Northern Vietnam</p>
          <p>Central Coast</p>
          <p>Southern Mekong</p>
        </div>
        <div className="space-y-2 text-sm text-slate-500">
          <h4 className="font-semibold text-slate-900">Tools</h4>
          <p>AI Itinerary Planner</p>
          <p>Budget Calculator</p>
          <p>Visa Guide</p>
        </div>
        <div className="space-y-2 text-sm text-slate-500">
          <h4 className="font-semibold text-slate-900">Newsletter</h4>
          <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2">
            <span className="text-xs">Email address</span>
            <span className="material-symbols-outlined ml-auto text-primary">arrow_forward</span>
          </div>
        </div>
      </div>
      <p className="mx-auto mt-8 max-w-6xl border-t border-slate-100 pt-6 text-center text-xs text-slate-400">
        © 2024 Vietnam Travel Guidebook + AI Planner. All rights reserved.
      </p>
    </footer>
  )
}
