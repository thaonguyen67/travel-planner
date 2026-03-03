import { useMemo, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { SiteFooter, SiteHeader } from './components/SiteChrome'
import { destinations } from './data/destinations'
import { AuthPage } from './pages/AuthPage'
import { DestinationPage } from './pages/DestinationPage'
import { HomePage } from './pages/HomePage'
import { PlannerPage } from './pages/PlannerPage'
import { ProfilePage } from './pages/ProfilePage'

const USERS_KEY = 'vt_users'
const CURRENT_USER_KEY = 'vt_current_user'
const ITINERARIES_KEY = 'vt_itineraries'
const FAVORITES_KEY = 'vt_favorites'

// localStorage: vt_users = [{ name, email, password }], vt_current_user = { name, email }
const readStorage = (key, fallback) => {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

const writeStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.warn('localStorage write failed:', e)
  }
}

function App() {
  const [users, setUsers] = useState(() => readStorage(USERS_KEY, []))
  const [currentUser, setCurrentUser] = useState(() => readStorage(CURRENT_USER_KEY, null))
  const [itineraries, setItineraries] = useState(() => readStorage(ITINERARIES_KEY, []))
  const [favorites, setFavorites] = useState(() => readStorage(FAVORITES_KEY, []))

  const login = ({ email, password }) => {
    const user = users.find(
      (item) => item.email.toLowerCase() === email.toLowerCase().trim() && item.password === password,
    )
    if (!user) {
      return { ok: false, message: 'Incorrect email or password.' }
    }
    const safeUser = { name: user.name, email: user.email }
    setCurrentUser(safeUser)
    writeStorage(CURRENT_USER_KEY, safeUser)
    return { ok: true, message: 'Logged in successfully.' }
  }

  const signup = ({ email, password }) => {
    const normalizedEmail = email.toLowerCase().trim()
    if (users.some((item) => item.email === normalizedEmail)) {
      return { ok: false, message: 'Email already exists.' }
    }
    const displayName = normalizedEmail.split('@')[0] || 'Traveler'
    const newUser = { name: displayName, email: normalizedEmail, password }
    const nextUsers = [...users, newUser]
    setUsers(nextUsers)
    writeStorage(USERS_KEY, nextUsers)

    const safeUser = { name: displayName, email: newUser.email }
    setCurrentUser(safeUser)
    writeStorage(CURRENT_USER_KEY, safeUser)
    return { ok: true, message: 'Account created and logged in.' }
  }

  const logout = () => {
    setCurrentUser(null)
    try {
      localStorage.removeItem(CURRENT_USER_KEY)
    } catch (e) {
      console.warn('localStorage remove failed:', e)
    }
  }

  const saveItinerary = (input) => {
    if (!currentUser) {
      return { ok: false, message: 'Please log in first.' }
    }
    const next = [
      {
        id: crypto.randomUUID(),
        userEmail: currentUser.email,
        createdAt: new Date().toISOString(),
        ...input,
      },
      ...itineraries,
    ]
    setItineraries(next)
    writeStorage(ITINERARIES_KEY, next)
    return { ok: true, message: 'Itinerary saved to your profile.' }
  }

  const myItineraries = useMemo(() => {
    if (!currentUser) {
      return []
    }
    return itineraries.filter((item) => item.userEmail === currentUser.email)
  }, [currentUser, itineraries])

  const myFavorites = useMemo(() => {
    if (!currentUser) return []
    return favorites.filter((f) => f.userEmail === currentUser.email).map((f) => f.destinationId)
  }, [currentUser, favorites])

  const addToFavorites = (destinationId) => {
    if (!currentUser) return { ok: false, message: 'Please log in to add favorites.' }
    const exists = favorites.some(
      (f) => f.userEmail === currentUser.email && f.destinationId === destinationId,
    )
    if (exists) return { ok: true, message: 'Already in favorites.' }
    const next = [...favorites, { userEmail: currentUser.email, destinationId }]
    setFavorites(next)
    writeStorage(FAVORITES_KEY, next)
    return { ok: true, message: 'Added to favorites.' }
  }

  const removeFromFavorites = (destinationId) => {
    const next = favorites.filter(
      (f) => !(f.userEmail === currentUser?.email && f.destinationId === destinationId),
    )
    setFavorites(next)
    writeStorage(FAVORITES_KEY, next)
  }

  const destinationPageElement = (
    <DestinationPage
      destinations={destinations}
      currentUser={currentUser}
      favorites={myFavorites}
      onAddToFavorites={addToFavorites}
      onRemoveFromFavorites={removeFromFavorites}
    />
  )

  return (
    <div className="min-h-screen bg-background-light font-display text-slate-900">
      <SiteHeader currentUser={currentUser} onLogout={logout} />
      <Routes>
        <Route path="/" element={<HomePage destinations={destinations} />} />
        <Route path="/login" element={<AuthPage onLogin={login} onSignup={signup} />} />
        <Route path="/signup" element={<AuthPage onLogin={login} onSignup={signup} />} />
        <Route path="/destinations" element={destinationPageElement} />
        <Route path="/destinations/:destinationId" element={destinationPageElement} />
        <Route
          path="/planner"
          element={
            <PlannerPage
              destinations={destinations}
              currentUser={currentUser}
              onSaveItinerary={saveItinerary}
            />
          }
        />
        <Route
          path="/profile"
          element={
            <ProfilePage
              currentUser={currentUser}
              itineraries={myItineraries}
              favorites={myFavorites}
              destinations={destinations}
              onRemoveFromFavorites={removeFromFavorites}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <SiteFooter />
    </div>
  )
}

export default App
