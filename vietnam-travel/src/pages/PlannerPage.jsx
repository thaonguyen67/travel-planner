import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { LoginGate } from '../components/LoginGate'
import { generateItinerary } from '../lib/gemini'

const PLACEHOLDER_ACTIVITY = {
  block: 'Morning',
  time: '08:00',
  title: 'Select options and click Generate Itinerary',
  text: 'Your AI-powered itinerary will appear here.',
  tag1: '—',
  tag2: '—',
}

export function PlannerPage({ destinations, currentUser, onSaveItinerary }) {
  const [searchParams] = useSearchParams()
  const selectedDestination = searchParams.get('destination') || destinations[0]?.id

  const [form, setForm] = useState({
    destinationId: selectedDestination,
    travelers: 2,
    durationDays: 7,
    pacing: 'Chill',
    budget: 'Mid-Range',
    interests: ['Food', 'Nature'],
  })
  const [status, setStatus] = useState('')
  const [selectedDay, setSelectedDay] = useState(0)
  const [itineraryDays, setItineraryDays] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generateError, setGenerateError] = useState('')
  const [isEditMode, setIsEditMode] = useState(false)

  const sortedDestinations = useMemo(
    () => [...destinations].sort((a, b) => a.name.localeCompare(b.name)),
    [destinations],
  )

  const selectedDestinationData = useMemo(
    () => destinations.find((item) => item.id === form.destinationId),
    [destinations, form.destinationId],
  )

  const selectedName = selectedDestinationData?.name ?? 'Vietnam'

  const toggleInterest = (interest) => {
    setForm((prev) => {
      if (prev.interests.includes(interest)) {
        return { ...prev, interests: prev.interests.filter((item) => item !== interest) }
      }
      return { ...prev, interests: [...prev.interests, interest] }
    })
  }

  const handleGenerateItinerary = async () => {
    setIsGenerating(true)
    setGenerateError('')
    setStatus('')
    try {
      const days = await generateItinerary({
        destinationName: selectedName,
        travelers: Number(form.travelers),
        durationDays: Number(form.durationDays),
        pacing: form.pacing,
        budget: form.budget,
        interests: form.interests,
      })
      setItineraryDays(days)
      setSelectedDay(0)
    } catch (err) {
      setGenerateError(err.message || 'Failed to generate itinerary')
    } finally {
      setIsGenerating(false)
    }
  }

  const savePlan = () => {
    const activities = itineraryDays?.flatMap((d) =>
      d.activities?.map((a) => `${a.block}: ${a.title}`) ?? [],
    ) ?? []
    const result = onSaveItinerary({
      title: `${form.durationDays} Days in ${selectedName}`,
      destinationId: form.destinationId,
      travelers: Number(form.travelers),
      durationDays: Number(form.durationDays),
      pacing: form.pacing,
      budget: form.budget,
      activities,
      days: itineraryDays ?? [],
      notes: `Interests: ${form.interests.join(', ')}`,
    })
    setStatus(result.message)
  }

  const updateActivity = (dayIndex, activityIndex, field, value) => {
    setItineraryDays((prev) => {
      const next = prev?.map((d, di) => {
        if (di !== dayIndex) return d
        const activities = [...(d.activities ?? [])]
        activities[activityIndex] = { ...activities[activityIndex], [field]: value }
        return { ...d, activities }
      })
      return next ?? prev
    })
  }

  const addActivity = (dayIndex) => {
    setItineraryDays((prev) => {
      const next = prev?.map((d, di) => {
        if (di !== dayIndex) return d
        const activities = [...(d.activities ?? []), { block: 'Morning', time: '09:00', title: '', text: '', tag1: '', tag2: '' }]
        return { ...d, activities }
      })
      return next ?? prev
    })
  }

  const removeActivity = (dayIndex, activityIndex) => {
    setItineraryDays((prev) => {
      const next = prev?.map((d, di) => {
        if (di !== dayIndex) return d
        const activities = (d.activities ?? []).filter((_, i) => i !== activityIndex)
        return { ...d, activities }
      })
      return next ?? prev
    })
  }

  const dayCount = itineraryDays?.length ?? Math.min(Number(form.durationDays) || 7, 14)
  const dayTabs = Array.from({ length: dayCount }, (_, i) => `Day ${i + 1}`)
  const currentDayData = itineraryDays?.[selectedDay]
  const activities = currentDayData?.activities ?? (itineraryDays ? [] : [PLACEHOLDER_ACTIVITY])

  if (!currentUser) {
    return (
      <LoginGate
        title="Plan Your Trip to Vietnam"
        message="Please log in to save AI itineraries to your profile."
      />
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
                  max="14"
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
                {['Nature', 'Heritage', 'Beach', 'City', 'Food'].map((interest) => (
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

            <button
              type="button"
              onClick={handleGenerateItinerary}
              disabled={isGenerating}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-bold text-white disabled:opacity-70"
            >
              {isGenerating ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                  Generating...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-xl">auto_awesome</span>
                  Generate Itinerary
                </>
              )}
            </button>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-7">
          <div className="flex gap-2 rounded-2xl border border-primary/5 bg-white p-2 shadow-sm overflow-x-auto">
            {dayTabs.map((day, index) => (
              <button
                key={day}
                type="button"
                onClick={() => setSelectedDay(index)}
                className={
                  selectedDay === index
                    ? 'flex-1 min-w-0 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white'
                    : 'flex-1 min-w-0 rounded-xl px-4 py-3 text-sm font-bold text-slate-500 transition-colors hover:bg-primary/5 hover:text-slate-700'
                }
              >
                {day}
              </button>
            ))}
          </div>

          {generateError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {generateError}
            </div>
          ) : null}

          <div className="space-y-4">
            {activities.map((item, idx) =>
              isEditMode && itineraryDays ? (
                <article
                  key={`edit-${selectedDay}-${idx}`}
                  className="flex flex-col gap-4 rounded-2xl border-l-4 border-primary bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4 flex-1 flex-wrap">
                      <div className="w-32 shrink-0">
                        <label className="mb-1 block text-[10px] font-bold uppercase text-slate-500">Block</label>
                        <select
                          value={item.block}
                          onChange={(e) => updateActivity(selectedDay, idx, 'block', e.target.value)}
                          className="w-full rounded-lg border border-slate-200 py-2 px-3 text-sm"
                        >
                          {['Morning', 'Afternoon', 'Evening', 'Night'].map((b) => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                        </select>
                      </div>
                      <div className="w-24 shrink-0">
                        <label className="mb-1 block text-[10px] font-bold uppercase text-slate-500">Time</label>
                        <input
                          type="text"
                          value={item.time}
                          onChange={(e) => updateActivity(selectedDay, idx, 'time', e.target.value)}
                          placeholder="08:00"
                          className="w-full rounded-lg border border-slate-200 py-2 px-3 text-sm"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeActivity(selectedDay, idx)}
                      className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                      aria-label="Remove activity"
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-bold uppercase text-slate-500">Title</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => updateActivity(selectedDay, idx, 'title', e.target.value)}
                      placeholder="Activity name"
                      className="w-full rounded-lg border border-slate-200 py-2 px-3 text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-bold uppercase text-slate-500">Description</label>
                    <textarea
                      value={item.text}
                      onChange={(e) => updateActivity(selectedDay, idx, 'text', e.target.value)}
                      placeholder="Brief description"
                      rows={3}
                      className="w-full rounded-lg border border-slate-200 py-2 px-3 text-sm resize-none"
                    />
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    <div className="flex-1 min-w-[120px]">
                      <label className="mb-1 block text-[10px] font-bold uppercase text-slate-500">Tag 1</label>
                      <input
                        type="text"
                        value={item.tag1}
                        onChange={(e) => updateActivity(selectedDay, idx, 'tag1', e.target.value)}
                        placeholder="e.g. 2 Hours"
                        className="w-full rounded-lg border border-slate-200 py-2 px-3 text-sm"
                      />
                    </div>
                    <div className="flex-1 min-w-[120px]">
                      <label className="mb-1 block text-[10px] font-bold uppercase text-slate-500">Tag 2</label>
                      <input
                        type="text"
                        value={item.tag2}
                        onChange={(e) => updateActivity(selectedDay, idx, 'tag2', e.target.value)}
                        placeholder="e.g. History"
                        className="w-full rounded-lg border border-slate-200 py-2 px-3 text-sm"
                      />
                    </div>
                  </div>
                </article>
              ) : (
                <article
                  key={`${item.title}-${idx}`}
                  className="flex gap-6 rounded-2xl border-l-4 border-primary bg-white p-6 shadow-sm"
                >
                  <div className="w-16 shrink-0 text-center">
                    <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-400">{item.block}</p>
                    <p className="text-lg font-bold text-primary">{item.time}</p>
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                    <p className="mb-3 mt-2 text-sm text-slate-600">{item.text}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded bg-primary/10 px-2 py-1 text-[11px] font-bold text-primary">
                        {item.tag1}
                      </span>
                      <span className="rounded bg-orange-100 px-2 py-1 text-[11px] font-bold text-orange-500">
                        {item.tag2}
                      </span>
                    </div>
                  </div>
                </article>
              ),
            )}
            {isEditMode && itineraryDays && (
              <button
                type="button"
                onClick={() => addActivity(selectedDay)}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/30 py-4 text-sm font-semibold text-primary hover:bg-primary/5"
              >
                <span className="material-symbols-outlined">add</span>
                Add activity to this day
              </button>
            )}
          </div>

          <div className="flex flex-col gap-4 pt-2 sm:flex-row">
            <button
              type="button"
              onClick={() => setIsEditMode((prev) => !prev)}
              disabled={!itineraryDays}
              className="flex-1 rounded-xl border-2 border-primary/20 py-4 font-bold text-primary disabled:opacity-50"
            >
              {isEditMode ? 'Done Editing' : 'Edit'}
            </button>
            <button
              type="button"
              onClick={savePlan}
              disabled={!itineraryDays}
              className="flex-1 rounded-xl bg-primary py-4 font-bold text-white disabled:opacity-50"
            >
              Save Itinerary
            </button>
          </div>
          {status ? <p className="text-sm font-semibold text-primary">{status}</p> : null}
        </div>
      </div>
    </main>
  )
}
