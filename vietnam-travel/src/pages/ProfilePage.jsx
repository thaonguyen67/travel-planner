import { Link } from 'react-router-dom'

function SectionHeader({ icon, title }) {
  return (
    <div className="flex items-center gap-3 border-b border-primary/10 pb-4">
      <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <span className="material-symbols-outlined text-2xl">{icon}</span>
      </div>
      <h2 className="text-xl font-bold text-primary">{title}</h2>
    </div>
  )
}

const profileImage = 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=256&q=80'

const itineraryThumb =
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=700&q=80'

export function ProfilePage({ currentUser, itineraries, favorites, destinations, onRemoveFromFavorites }) {
  const destinationById = Object.fromEntries(destinations.map((item) => [item.id, item]))
  const favoriteDestinations = favorites
    .map((id) => destinationById[id])
    .filter(Boolean)

  if (!currentUser) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h1 className="text-3xl font-black text-primary">Profile</h1>
        <p className="mt-2 text-slate-500">Please log in to see favorite destinations and itineraries.</p>
        <Link to="/login" className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-bold text-white">
          Go to Login
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 p-6">
      <section className="flex flex-col items-center gap-6 rounded-xl border border-primary/5 bg-white p-8 shadow-sm md:flex-row">
        <div className="size-32 shrink-0 overflow-hidden rounded-full border-4 border-primary/10 bg-slate-100">
          <img src={profileImage} alt="Profile" className="size-full object-cover" />
        </div>

        <div className="flex flex-1 flex-col items-center gap-1 md:items-start">
          <h1 className="text-3xl font-bold text-primary">{currentUser.name}</h1>
          <p className="font-medium text-slate-500">Travel Enthusiast & AI Planner Early Adopter</p>
          <div className="mt-2 flex gap-4">
            <div className="flex items-center gap-1 rounded-full bg-primary/5 px-3 py-1 text-sm text-primary">
              <span className="material-symbols-outlined text-xs">location_on</span>
              <span>Hanoi, Vietnam</span>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-sm text-accent">
              <span className="material-symbols-outlined text-xs">grade</span>
              <span>{itineraries.length} Trips Planned</span>
            </div>
          </div>
        </div>

        <button type="button" className="flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-8 text-sm font-bold text-white shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined text-lg">edit</span>
          <span>Edit Profile</span>
        </button>
      </section>

      <section className="flex flex-col gap-6">
        <SectionHeader icon="favorite" title="Favorite Destinations" />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {favoriteDestinations.length === 0 ? (
            <p className="col-span-full text-sm text-slate-600">
              No favorite destinations yet. Add destinations from the Destinations page.
            </p>
          ) : (
            favoriteDestinations.map((item) => (
              <article key={item.id} className="group relative overflow-hidden rounded-xl border border-primary/5 bg-white shadow-sm transition-all hover:shadow-md">
                <div className="h-48 w-full overflow-hidden">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveFromFavorites(item.id)}
                  className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-white/90 text-red-500 shadow-sm hover:bg-white"
                >
                  <span className="material-symbols-outlined text-xl">delete</span>
                </button>
              <div className="flex flex-col gap-2 p-4">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-bold leading-tight text-primary">{item.name}</h3>
                  <span className="flex items-center gap-0.5 text-sm font-bold text-accent">
                    <span className="material-symbols-outlined text-sm">star</span>
                    {item.rating}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="rounded bg-primary/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                    {item.region}
                  </span>
                  <span className="rounded bg-accent/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
                    {item.category}
                  </span>
                </div>
                <p className="line-clamp-2 text-sm text-slate-500">{item.longDescription}</p>
              </div>
            </article>
            ))
          )}
        </div>
      </section>

      <section className="flex flex-col gap-6 pt-2">
        <SectionHeader icon="event_note" title="Saved Itineraries" />

        <div className="flex flex-col gap-4">
          {itineraries.length === 0 ? (
            <div className="rounded-xl border border-primary/10 bg-white p-6">
              <p className="text-sm text-slate-600">No itineraries saved yet. Create one from the Plan Your Trip page.</p>
            </div>
          ) : (
            itineraries.map((itinerary) => (
              <article key={itinerary.id} className="group flex flex-col items-center gap-6 rounded-xl border border-primary/5 bg-white p-4 shadow-sm transition-all hover:border-primary/20 md:flex-row">
                <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-lg md:w-40">
                  <img src={itineraryThumb} alt={itinerary.title} className="h-full w-full object-cover" />
                </div>
                <div className="w-full flex-1 text-center md:text-left">
                  <h3 className="text-lg font-bold text-primary">{itinerary.title}</h3>
                  <div className="mt-1 flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500 md:justify-start">
                    <span>{destinationById[itinerary.destinationId]?.name || itinerary.destinationId}</span>
                    <span>{itinerary.pacing} Pacing</span>
                    <span>{itinerary.travelers} Travelers</span>
                  </div>
                </div>
                <div className="flex w-full gap-2 md:w-auto">
                  <button type="button" className="h-10 flex-1 rounded-full border border-primary px-6 text-sm font-bold text-primary">
                    Share
                  </button>
                  <button type="button" className="h-10 flex-1 rounded-full bg-primary px-8 text-sm font-bold text-white">
                    View
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  )
}
