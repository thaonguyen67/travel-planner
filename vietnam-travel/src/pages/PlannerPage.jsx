import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

const sampleDayPlan = [
  {
    block: 'Morning',
    time: '08:00',
    title: 'Old Quarter Walking Tour',
    text: "Explore the 36 streets of Hanoi's historic heart and local morning markets.",
    tag1: 'Local Street Food',
    tag2: 'Instagrammable',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAr07Dn-w02Bpz78IaA_EcIIyMjoE3LhCAyeRl5AzX-Q1-j89lpcg79_218BF68wrm4S5Oy-DJl9kMnw0nj6dCMfh8f8S5VtEwsX-nz1_EWKJnvbT0iB8hHQgOM8QdUUanZzau8hhLQNE7xmq7QYG1wr6ONfXrxj_mZ5a1VEYfpetGmdwsBvxsnbwNMHhY_lY7OcTIzp2vlBGwvSJktzX0LVIyL2TxsqWMUm79GV2iiySyOrB1BV9N3fsle5bv93UPPqQamVTr2r9M',
  },
  {
    block: 'Afternoon',
    time: '13:30',
    title: 'Temple of Literature',
    text: "Visit Vietnam's first national university and peaceful traditional courtyards.",
    tag1: '2 Hours',
    tag2: 'History',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB6x9PovSku1oSbEUvDtDUGig7YQE5Iqpp6st55NdWL1qe0TYrgARPWsby8qqsmqVTB4IJi4CXXC-ZAYh57TM00HWQ04nNnBC9Apwpsiz1mC25mlGf4jgchVeuZfpHC0gX6hVMx82enHN7YjgsG9yPvR3pOLmXW8louiyF2bL1LiRTezWeQadTcpMnJxqCXSfsPAcwV1qr4BlGVVBICITWdPQjRwAln7POeCk_MyvR9i215zherWGnvMo3PJPPuWV4eLDYx4pumB3A',
  },
  {
    block: 'Evening',
    time: '18:30',
    title: 'Street Food Tour by Vespa',
    text: 'Enjoy a culinary journey through hidden alleys with local guides and tasting stops.',
    tag1: 'Included in Mid-Range',
    tag2: 'Nightlife',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDt0KJlJISvBcurkmIeWlQTfeTvXzQgwXAmPRvefJnQDg1TGZRnveUlpKJxg5pZ_7L1xmCgkMjWstCvYFGUI_veF9BnTilKtlUFzMc3tY2u3_BGOkqPKFnxF8x_xN84lptWfTSejFOgLdljAKvoYKr65Pt-INVdDqpSPSlaZyrRTrXmtQlLlSh9jX8ZHGDW7dnvf0IOTExw6tKkl8t3bSurM5cFhReLXq-sDzeDvbCQxNV4pD6k3hw-wYrpioyxpGok2drwBSHIAsk',
  },
]

export function PlannerPage({ destinations, currentUser, onSaveItinerary }) {
  const [searchParams] = useSearchParams()
  const selectedDestination = searchParams.get('destination') || destinations[0]?.id

  const [form, setForm] = useState({
    destinationId: selectedDestination,
    travelers: 2,
    durationDays: 7,
    pacing: 'Chill',
    budget: 'Mid-Range',
    interests: ['Food', 'Beaches'],
  })
  const [status, setStatus] = useState('')

  const sortedDestinations = useMemo(
    () => [...destinations].sort((a, b) => a.name.localeCompare(b.name)),
    [destinations],
  )

  const selectedName = useMemo(
    () => destinations.find((item) => item.id === form.destinationId)?.name ?? 'Vietnam',
    [destinations, form.destinationId],
  )

  const toggleInterest = (interest) => {
    setForm((prev) => {
      if (prev.interests.includes(interest)) {
        return { ...prev, interests: prev.interests.filter((item) => item !== interest) }
      }
      return { ...prev, interests: [...prev.interests, interest] }
    })
  }

  const savePlan = () => {
    const result = onSaveItinerary({
      title: `${form.durationDays} Days in ${selectedName}`,
      destinationId: form.destinationId,
      travelers: Number(form.travelers),
      durationDays: Number(form.durationDays),
      pacing: form.pacing,
      budget: form.budget,
      activities: sampleDayPlan.map((item) => `${item.block}: ${item.title}`),
      notes: `Interests: ${form.interests.join(', ')}`,
    })
    setStatus(result.message)
  }

  if (!currentUser) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h1 className="text-3xl font-black text-slate-900">Plan Your Trip to Vietnam</h1>
        <p className="mt-2 text-slate-500">Please log in to save AI itineraries to your profile.</p>
        <Link to="/login" className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-bold text-white">
          Go to Login
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-10">
      <div className="mb-10">
        <h1 className="mb-2 text-4xl font-black text-slate-900">Plan Your Trip to Vietnam</h1>
        <p className="text-lg text-primary/70">Personalize your journey with our AI-powered travel intelligence.</p>
      </div>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        <div className="rounded-2xl border border-primary/5 bg-white p-8 shadow-sm lg:col-span-5">
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">Destinations</label>
              <select
                className="w-full rounded-xl border-none bg-background-light py-3.5 pl-4 pr-4 text-slate-900"
                value={form.destinationId}
                onChange={(event) => setForm((prev) => ({ ...prev, destinationId: event.target.value }))}
              >
                {sortedDestinations.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">Travelers</label>
                <input
                  type="number"
                  min="1"
                  className="w-full rounded-xl border-none bg-background-light py-3.5 pl-4 pr-4"
                  value={form.travelers}
                  onChange={(event) => setForm((prev) => ({ ...prev, travelers: event.target.value }))}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">Duration (Days)</label>
                <input
                  type="number"
                  min="1"
                  className="w-full rounded-xl border-none bg-background-light py-3.5 pl-4 pr-4"
                  value={form.durationDays}
                  onChange={(event) => setForm((prev) => ({ ...prev, durationDays: event.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="mb-3 block text-sm font-bold text-slate-700">Trip Pacing</label>
              <div className="flex rounded-xl bg-background-light p-1">
                {['Chill', 'Balanced', 'Packed'].map((pace) => (
                  <button
                    key={pace}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, pacing: pace }))}
                    className={
                      form.pacing === pace
                        ? 'flex-1 rounded-lg bg-white py-2 text-sm font-semibold text-primary shadow-sm'
                        : 'flex-1 rounded-lg py-2 text-sm font-semibold text-slate-500'
                    }
                  >
                    {pace}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-3 block text-sm font-bold text-slate-700">Interests</label>
              <div className="flex flex-wrap gap-2">
                {['Food', 'Nature', 'History', 'Beaches', 'Nightlife'].map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={
                      form.interests.includes(interest)
                        ? 'rounded-full bg-primary px-4 py-2 text-xs font-bold text-white'
                        : 'rounded-full bg-primary/10 px-4 py-2 text-xs font-bold text-primary'
                    }
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-3 block text-sm font-bold text-slate-700">Budget Level</label>
              <div className="grid grid-cols-3 gap-3">
                {['Budget', 'Mid-Range', 'Luxury'].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, budget: value }))}
                    className={
                      form.budget === value
                        ? 'rounded-xl border-2 border-primary bg-primary/5 py-3 text-xs font-bold text-primary'
                        : 'rounded-xl border-2 border-primary/10 py-3 text-xs font-bold text-slate-500'
                    }
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>

            <button type="button" className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-bold text-white">
              <span>Generate Itinerary</span>
              <span className="material-symbols-outlined text-xl">auto_awesome</span>
            </button>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-7">
          <div className="flex gap-2 rounded-2xl border border-primary/5 bg-white p-2 shadow-sm">
            {['Day 1', 'Day 2', 'Day 3', 'Day 4'].map((day, index) => (
              <button
                key={day}
                type="button"
                className={
                  index === 0
                    ? 'rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white'
                    : 'rounded-xl px-6 py-3 text-sm font-bold text-slate-500'
                }
              >
                {day}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {sampleDayPlan.map((item) => (
              <article key={item.title} className="flex gap-6 rounded-2xl border-l-4 border-primary bg-white p-6 shadow-sm">
                <div className="w-16 shrink-0 text-center">
                  <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-400">{item.block}</p>
                  <p className="text-lg font-bold text-primary">{item.time}</p>
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                  <p className="mb-3 mt-2 text-sm text-slate-600">{item.text}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded bg-primary/10 px-2 py-1 text-[11px] font-bold text-primary">{item.tag1}</span>
                    <span className="rounded bg-orange-100 px-2 py-1 text-[11px] font-bold text-orange-500">{item.tag2}</span>
                  </div>
                </div>
                <img src={item.image} alt={item.title} className="hidden h-24 w-24 rounded-xl object-cover sm:block" />
              </article>
            ))}
          </div>

          <div className="rounded-2xl border border-primary/10 bg-primary/5 p-6">
            <h4 className="mb-2 flex items-center gap-2 font-bold text-primary">
              <span className="material-symbols-outlined">info</span>
              Travel Notes
            </h4>
            <ul className="list-inside list-disc space-y-2 text-sm text-slate-600">
              <li>Keep small denominations of VND for street vendors.</li>
              <li>Download Grab for convenient transportation.</li>
              <li>Dress respectfully when visiting temples.</li>
            </ul>
          </div>

          <div className="flex flex-col gap-4 pt-2 sm:flex-row">
            <button type="button" className="flex-1 rounded-xl border-2 border-primary/20 py-4 font-bold text-primary">
              Regenerate Day 1
            </button>
            <button type="button" onClick={savePlan} className="flex-1 rounded-xl bg-primary py-4 font-bold text-white">
              Save Itinerary
            </button>
          </div>
          {status ? <p className="text-sm font-semibold text-primary">{status}</p> : null}
        </div>
      </div>
    </main>
  )
}
