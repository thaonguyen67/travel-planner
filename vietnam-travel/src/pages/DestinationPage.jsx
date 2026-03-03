import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

const REGION_FILTERS = ['All', 'North', 'Central', 'South']
const CATEGORY_FILTERS = ['All', 'Nature', 'Heritage', 'City', 'Beach', 'Adventure', 'Culture']

function FilterButtonGroup({ label, options, value, onChange }) {
  return (
    <div>
      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={
              value === opt
                ? 'rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white'
                : 'rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/20'
            }
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

const ROWS_PER_PAGE = 3
const COLS_PER_ROW = 3
const DESTINATIONS_PER_PAGE = ROWS_PER_PAGE * COLS_PER_ROW

function DestinationsGrid({ filtered, selected }) {
  const [visibleCount, setVisibleCount] = useState(DESTINATIONS_PER_PAGE)
  const navigate = useNavigate()
  const visible = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  return (
    <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {visible.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => navigate(`/destinations/${item.id}`)}
          className={`group overflow-hidden rounded-xl border bg-white text-left shadow-sm transition-all hover:shadow-xl ${
            selected.id === item.id ? 'border-2 border-primary' : 'border-slate-100'
          }`}
        >
          <div className="relative h-56 w-full">
            <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
            <span className="absolute bottom-4 left-4 rounded-full bg-primary/90 px-3 py-1 text-xs font-bold text-white">
              {item.zone}
            </span>
          </div>
          <div className="p-5">
            <h3 className="text-lg font-bold text-slate-900">{item.name}</h3>
            <p className="mt-1 text-sm text-slate-500">{item.description}</p>
          </div>
        </button>
      ))}
      {hasMore && (
        <div className="col-span-full flex justify-center pt-4">
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => prev + DESTINATIONS_PER_PAGE)}
            className="rounded-full bg-primary px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-primary/90"
          >
            See more
          </button>
        </div>
      )}
    </section>
  )
}

export function DestinationPage({ destinations, currentUser, favorites, onAddToFavorites, onRemoveFromFavorites }) {
  const { destinationId } = useParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [region, setRegion] = useState('All')
  const [category, setCategory] = useState('All')

  const filtered = useMemo(() => {
    return destinations.filter((item) => {
      const sameRegion = region === 'All' || item.zone === region
      const sameCategory = category === 'All' || item.category === category
      const keyword = `${item.name} ${item.region} ${item.category} ${item.description}`.toLowerCase()
      const sameSearch = !searchTerm.trim() || keyword.includes(searchTerm.toLowerCase().trim())
      return sameRegion && sameCategory && sameSearch
    })
  }, [destinations, region, category, searchTerm])

  const filterKey = `${region}-${category}-${searchTerm}`

  const selected =
    destinations.find((item) => item.id === destinationId) ||
    filtered[0] ||
    destinations[0]

  const isFavorite = favorites.includes(selected?.id)

  const handleFavoriteClick = () => {
    if (!currentUser) return
    if (isFavorite) {
      onRemoveFromFavorites(selected.id)
    } else {
      onAddToFavorites(selected.id)
    }
  }

  return (
    <main className="min-h-screen bg-background-light px-6 py-8 lg:px-20">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Explore Destinations</h1>
        <p className="mt-2 text-slate-600">Discover hidden gems and popular landmarks curated by AI.</p>
      </div>

      <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm space-y-4">
        <FilterButtonGroup label="Region" options={REGION_FILTERS} value={region} onChange={setRegion} />
        <FilterButtonGroup label="Category" options={CATEGORY_FILTERS} value={category} onChange={setCategory} />
        <div className="pt-2 border-t border-slate-100">
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
            Search
          </label>
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by name, region, category..."
            className="w-full min-w-0 rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
          />
        </div>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[1.65fr_1fr]">
        <DestinationsGrid key={filterKey} filtered={filtered} selected={selected} />

        <aside className="sticky top-28 h-fit overflow-hidden rounded-2xl border border-primary/10 bg-white shadow-2xl">
          <div className="relative h-64">
            <img src={selected.image} alt={selected.name} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <h2 className="text-2xl font-bold">{selected.name}</h2>
              <p className="text-sm opacity-90">{selected.province}</p>
            </div>
          </div>

          <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-slate-700">Rating: {selected.rating}</p>
              {currentUser ? (
                <button
                  type="button"
                  onClick={handleFavoriteClick}
                  className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${
                    isFavorite ? 'text-primary' : 'text-primary hover:text-primary/80'
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-xl"
                    style={isFavorite ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    favorite
                  </span>
                  {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>
              ) : (
                <Link to="/login" className="text-sm font-semibold text-primary hover:underline">
                  Log in to add favorites
                </Link>
              )}
            </div>

            <div>
              <h4 className="mb-2 text-sm font-bold uppercase tracking-wider text-primary">Overview</h4>
              <p className="text-sm leading-relaxed text-slate-600">{selected.longDescription}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-primary/10 bg-primary/5 p-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Best Time</p>
                <p className="mt-1 text-sm font-semibold">{selected.bestTime}</p>
              </div>
              <div className="rounded-xl border border-primary/10 bg-primary/5 p-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Avg Stay</p>
                <p className="mt-1 text-sm font-semibold">{selected.avgStay}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 bg-white/80 p-6">
            <Link
              to={`/planner?destination=${selected.id}`}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-bold text-white hover:opacity-90"
            >
              <span className="material-symbols-outlined">auto_fix_high</span>
              Add to AI Trip Plan
            </Link>
          </div>
        </aside>
      </div>
    </main>
  )
}
