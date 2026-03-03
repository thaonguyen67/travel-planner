import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

function shuffleAndTake(arr, count) {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy.slice(0, count)
}

export function HomePage({ destinations }) {
  const carouselDestinations = useMemo(() => shuffleAndTake(destinations, 7), [destinations])
  const scrollRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1)
  }

  useEffect(() => {
    checkScroll()
    const el = scrollRef.current
    if (el) el.addEventListener('scroll', checkScroll)
    window.addEventListener('resize', checkScroll)
    return () => {
      if (el) el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [carouselDestinations])

  const scroll = (direction) => {
    const el = scrollRef.current
    if (!el) return
    const amount = el.clientWidth * 0.8
    el.scrollBy({ left: direction * amount, behavior: 'smooth' })
  }

  return (
    <main className="bg-[#f1f1f1]">
      <section className="mx-auto max-w-6xl px-4 pb-10 pt-6 md:px-6">
        <div className="relative overflow-hidden rounded-[28px] shadow-xl">
          <img
            src="https://lp-cms-production.imgix.net/2023-10/GettyRF92865967.jpg?auto=format,compress&q=72&fit=crop"
            alt="Vietnam hero"
            className="h-[460px] w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
            <p className="rounded-full bg-orange-500 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
              Your AI-Powered Guide
            </p>
            <h1 className="mt-4 max-w-2xl text-4xl font-black leading-tight md:text-6xl">
              Explore the Beauty of <span className="underline decoration-orange-500">Vietnam</span>
            </h1>
            <p className="mt-4 max-w-xl text-sm text-slate-200 md:text-base">
              Experience the perfect blend of tradition and modernity. Discover breathtaking destinations and
              let our AI create your perfect itinerary.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/destinations" className="rounded-full bg-primary px-6 py-3 text-sm font-bold">
                Explore Destinations
              </Link>
              <Link to="/planner" className="rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-900">
                Plan Your Trip
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Curated Selections</p>
            <h2 className="text-4xl font-black text-slate-900">Featured Destinations</h2>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => scroll(-1)}
              disabled={!canScrollLeft}
              aria-label="Previous destinations"
              className="flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none"
            >
              <span className="material-symbols-outlined text-xl">chevron_left</span>
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              disabled={!canScrollRight}
              aria-label="Next destinations"
              className="flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none"
            >
              <span className="material-symbols-outlined text-xl">chevron_right</span>
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="no-scrollbar flex gap-6 overflow-x-auto pb-2 scroll-smooth"
        >
          {carouselDestinations.map((item) => (
            <Link
              key={item.id}
              to={`/destinations/${item.id}`}
              className="min-w-[280px] max-w-[280px] shrink-0 overflow-hidden rounded-3xl bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <img src={item.image} alt={item.name} className="h-60 w-full object-cover" />
              <div className="p-4">
                <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                  {item.zone}
                </span>
                <h3 className="mt-2 text-xl font-bold text-slate-900">{item.name}</h3>
                <p className="text-sm text-slate-500">{item.province}</p>
                <p className="mt-1 line-clamp-2 text-xs text-slate-600">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12 md:px-6">
        <div className="rounded-3xl bg-primary px-6 py-14 text-center text-white">
          <h2 className="text-5xl font-black leading-tight">Ready to start your adventure?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-100">
            Say goodbye to hours of research. Let our AI planner create the perfect personalized itinerary based
            on your interests, budget, and travel style.
          </p>
          <Link
            to="/planner"
            className="mt-8 inline-flex rounded-full bg-orange-500 px-8 py-3 text-base font-bold text-white"
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </main>
  )
}
