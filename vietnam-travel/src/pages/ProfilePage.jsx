import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LoginGate } from '../components/LoginGate'

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

export function ProfilePage({ currentUser, itineraries, favorites, destinations, onRemoveFromFavorites, onUpdateProfile, onDeleteItinerary, onUpdateItinerary }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editName, setEditName] = useState(currentUser?.name ?? '')
  const [viewingItinerary, setViewingItinerary] = useState(null)
  const [editingItinerary, setEditingItinerary] = useState(null)
  const [editSelectedDay, setEditSelectedDay] = useState(1)

  const destinationById = Object.fromEntries(destinations.map((item) => [item.id, item]))

  const updateEditItinerary = (field, value) => {
    setEditingItinerary((prev) => ({ ...prev, [field]: value }))
  }

  const updateEditActivity = (dayNum, activityIdx, field, value) => {
    setEditingItinerary((prev) => {
      const next = { ...prev, days: [...(prev.days ?? [])] }
      const dayIdx = next.days.findIndex((d) => d.day === dayNum)
      if (dayIdx < 0) return prev
      const day = { ...next.days[dayIdx], activities: [...(next.days[dayIdx].activities ?? [])] }
      const act = { ...day.activities[activityIdx], [field]: value }
      day.activities[activityIdx] = act
      next.days[dayIdx] = day
      return next
    })
  }

  const addEditActivity = (dayNum) => {
    setEditingItinerary((prev) => {
      const next = { ...prev, days: [...(prev.days ?? [])] }
      const dayIdx = next.days.findIndex((d) => d.day === dayNum)
      if (dayIdx < 0) return prev
      const day = { ...next.days[dayIdx], activities: [...(next.days[dayIdx].activities ?? [])] }
      day.activities = [...day.activities, { block: 'Morning', time: '09:00', title: '', text: '', tag1: '', tag2: '' }]
      next.days[dayIdx] = day
      return next
    })
  }

  const removeEditActivity = (dayNum, activityIdx) => {
    setEditingItinerary((prev) => {
      const next = { ...prev, days: [...(prev.days ?? [])] }
      const dayIdx = next.days.findIndex((d) => d.day === dayNum)
      if (dayIdx < 0) return prev
      const day = { ...next.days[dayIdx], activities: [...(next.days[dayIdx].activities ?? [])] }
      day.activities.splice(activityIdx, 1)
      next.days[dayIdx] = day
      return next
    })
  }

  const favoriteDestinations = favorites
    .map((id) => destinationById[id])
    .filter(Boolean)

  if (!currentUser) {
    return (
      <LoginGate
        title="My Profile"
        message="Please log in to see favorite destinations and itineraries."
      />
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
          <p className="font-medium text-slate-500">Travel Enthusiast</p>
          <div className="mt-2 flex gap-4">
            <div className="flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-sm text-accent">
              <span className="material-symbols-outlined text-xs">grade</span>
              <span>{itineraries.length} Trips Planned</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditName(currentUser.name)
            setModalOpen(true)
          }}
          className="flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-8 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary/90"
        >
          <span className="material-symbols-outlined text-lg">edit</span>
          <span>Edit Profile</span>
        </button>
      </section>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-profile-title"
        >
          <div
            className="w-full max-w-md rounded-2xl border border-primary/10 bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="edit-profile-title" className="mb-6 text-xl font-bold text-slate-900">
              Edit Profile
            </h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Email</label>
                <input
                  type="email"
                  readOnly
                  value={currentUser.email}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 px-4 text-slate-500"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Your name"
                  className="w-full rounded-xl border border-slate-200 py-3 px-4 text-slate-900"
                />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onUpdateProfile({ name: editName })
                  setModalOpen(false)
                }}
                className="flex-1 rounded-xl bg-primary py-3 text-sm font-bold text-white hover:bg-primary/90"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="flex flex-col gap-6">
        <SectionHeader icon="favorite" title="Favorite Destinations" />

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {favoriteDestinations.length === 0 ? (
            <div className="col-span-full rounded-xl border border-primary/10 bg-white p-4">
              <p className="text-sm text-slate-600">No favorite destinations yet. Add destinations from the Destinations page.</p>
            </div>
          ) : (
            favoriteDestinations.map((item) => (
              <article key={item.id} className="group relative overflow-hidden rounded-lg border border-primary/5 bg-white shadow-sm transition-all hover:shadow-md">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onRemoveFromFavorites(item.id)
                  }}
                  className="absolute right-2 top-2 z-10 flex size-6 items-center justify-center rounded-full bg-white/90 text-red-500 shadow-sm hover:bg-white"
                >
                  <span className="material-symbols-outlined text-base">delete</span>
                </button>
                <Link to={`/destinations/${item.id}`} className="block">
                  <div className="h-28 w-full overflow-hidden">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <div className="flex flex-col gap-1 p-3">
                    <div className="flex items-start justify-between gap-1">
                      <h3 className="text-sm font-bold leading-tight text-primary line-clamp-1">{item.name}</h3>
                      <span className="flex shrink-0 items-center gap-0.5 text-xs font-bold text-accent">
                        <span className="material-symbols-outlined text-xs">star</span>
                        {item.rating}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      <span className="rounded bg-primary/5 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary">
                        {item.region}
                      </span>
                      <span className="rounded bg-accent/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-accent">
                        {item.category}
                      </span>
                    </div>
                    <p className="line-clamp-2 text-xs text-slate-500">{item.longDescription}</p>
                  </div>
                </Link>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="flex flex-col gap-6 pt-2">
        <SectionHeader icon="event_note" title="Saved Itineraries" />

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {itineraries.length === 0 ? (
            <div className="col-span-full rounded-xl border border-primary/10 bg-white p-4">
              <p className="text-sm text-slate-600">No itineraries saved yet. Create one from the Plan Your Trip page.</p>
            </div>
          ) : (
            itineraries.map((itinerary) => (
              <article key={itinerary.id} className="group relative overflow-hidden rounded-lg border border-primary/5 bg-white shadow-sm transition-all hover:shadow-md">
                <div className="h-28 w-full overflow-hidden">
                  <img
                    src={destinationById[itinerary.destinationId]?.image || itineraryThumb}
                    alt={itinerary.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="flex flex-col gap-1 p-3">
                  <h3 className="text-sm font-bold leading-tight text-primary line-clamp-1">{itinerary.title}</h3>
                  <p className="line-clamp-1 text-xs text-slate-500">
                    {destinationById[itinerary.destinationId]?.name || itinerary.destinationId}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1 text-[10px] text-slate-500">
                    <span>{itinerary.pacing}</span>
                    <span>·</span>
                    <span>{itinerary.travelers} travelers</span>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setViewingItinerary(itinerary)}
                      className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20"
                      aria-label="View itinerary"
                    >
                      <span className="material-symbols-outlined text-base">visibility</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingItinerary(JSON.parse(JSON.stringify(itinerary)))
                        setEditSelectedDay(1)
                      }}
                      className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20"
                      aria-label="Edit itinerary"
                    >
                      <span className="material-symbols-outlined text-base">edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteItinerary(itinerary.id)}
                      className="flex size-8 items-center justify-center rounded-full bg-white/90 text-red-500 shadow-sm hover:bg-white"
                      aria-label="Delete itinerary"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      {viewingItinerary && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setViewingItinerary(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="view-itinerary-title"
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-primary/10 bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {destinationById[viewingItinerary.destinationId]?.image && (
              <div className="relative h-40 w-full overflow-hidden rounded-t-2xl">
                <img
                  src={destinationById[viewingItinerary.destinationId].image}
                  alt={viewingItinerary.title}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <div className="sticky top-0 border-b border-slate-100 bg-white p-6">
              <div className="flex items-start justify-between gap-4">
                <h2 id="view-itinerary-title" className="text-xl font-bold text-slate-900">
                  {viewingItinerary.title}
                </h2>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingItinerary(JSON.parse(JSON.stringify(viewingItinerary)))
                      setEditSelectedDay(1)
                      setViewingItinerary(null)
                    }}
                    className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary/20"
                    aria-label="Edit itinerary"
                  >
                    <span className="material-symbols-outlined text-xl">edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewingItinerary(null)}
                    className="flex size-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-800"
                    aria-label="Close"
                  >
                    <span className="material-symbols-outlined text-2xl">close</span>
                  </button>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-500">
                <span>{destinationById[viewingItinerary.destinationId]?.name || viewingItinerary.destinationId}</span>
                <span>{viewingItinerary.durationDays} days</span>
                <span>{viewingItinerary.travelers} travelers</span>
                <span>{viewingItinerary.pacing} pacing</span>
                <span>{viewingItinerary.budget}</span>
                {viewingItinerary.notes && (
                  <span>{viewingItinerary.notes}</span>
                )}
              </div>
            </div>
            <div className="p-6 pt-4">
              {viewingItinerary.days?.length > 0 ? (
                <div className="space-y-6">
                  {viewingItinerary.days.map((dayData, dayIdx) => (
                    <div key={dayIdx}>
                      <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-primary">
                        Day {dayData.day}
                      </h4>
                      <div className="space-y-3">
                        {(dayData.activities ?? []).map((activity, idx) => (
                          <article
                            key={idx}
                            className="flex gap-4 rounded-xl border-l-4 border-primary/30 bg-primary/5 p-4"
                          >
                            <div className="w-14 shrink-0 text-center">
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                {activity.block}
                              </p>
                              <p className="text-base font-bold text-primary">{activity.time}</p>
                            </div>
                            <div className="min-w-0 flex-1">
                              <h5 className="font-bold text-slate-900">{activity.title}</h5>
                              {activity.text ? (
                                <p className="mt-1 text-sm text-slate-600">{activity.text}</p>
                              ) : null}
                              {(activity.tag1 || activity.tag2) && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {activity.tag1 && (
                                    <span className="rounded bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                                      {activity.tag1}
                                    </span>
                                  )}
                                  {activity.tag2 && (
                                    <span className="rounded bg-orange-100 px-2 py-0.5 text-[11px] font-bold text-orange-500">
                                      {activity.tag2}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </article>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : viewingItinerary.activities?.length > 0 ? (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-primary">Itinerary</h4>
                  <ul className="space-y-3">
                    {viewingItinerary.activities.map((activity, idx) => (
                      <li key={idx} className="flex gap-3 rounded-xl border-l-4 border-primary/30 bg-primary/5 py-3 pl-4 pr-4">
                        <span className="text-sm font-medium text-slate-700">{activity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {editingItinerary && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setEditingItinerary(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-itinerary-title"
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-primary/10 bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 border-b border-slate-100 bg-white p-6">
              <div className="flex items-start justify-between gap-4">
                <h2 id="edit-itinerary-title" className="text-xl font-bold text-slate-900">
                  Edit Itinerary
                </h2>
                <button
                  type="button"
                  onClick={() => setEditingItinerary(null)}
                  className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-800"
                  aria-label="Close"
                >
                  <span className="material-symbols-outlined text-2xl">close</span>
                </button>
              </div>
              <div className="mt-4">
                <label className="mb-1 block text-[10px] font-bold uppercase text-slate-500">Itinerary Title</label>
                <input
                  type="text"
                  value={editingItinerary.title ?? ''}
                  onChange={(e) => updateEditItinerary('title', e.target.value)}
                  placeholder="Your trip title"
                  className="w-full rounded-lg border border-slate-200 py-2 px-3 text-sm"
                />
              </div>
              <p className="mt-2 text-sm text-slate-500">
                {destinationById[editingItinerary.destinationId]?.name || editingItinerary.destinationId}
              </p>
            </div>

            {editingItinerary.days?.length > 0 ? (
              <>
                <div className="flex gap-2 border-b border-slate-100 px-6 pt-4">
                  {editingItinerary.days.map((d) => (
                    <button
                      key={d.day}
                      type="button"
                      onClick={() => setEditSelectedDay(d.day)}
                      className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                        editSelectedDay === d.day
                          ? 'bg-primary text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Day {d.day}
                    </button>
                  ))}
                </div>

                <div className="p-6">
                  {editingItinerary.days
                    .filter((d) => d.day === editSelectedDay)
                    .map((dayData) => (
                      <div key={dayData.day} className="space-y-4">
                        {(dayData.activities ?? []).map((activity, idx) => (
                          <article
                            key={`edit-${dayData.day}-${idx}`}
                            className="flex flex-col gap-4 rounded-2xl border-l-4 border-primary bg-white p-6 shadow-sm"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex gap-4 flex-1 flex-wrap">
                                <div className="w-32 shrink-0">
                                  <label className="mb-1 block text-[10px] font-bold uppercase text-slate-500">Block</label>
                                  <select
                                    value={activity.block ?? 'Morning'}
                                    onChange={(e) => updateEditActivity(dayData.day, idx, 'block', e.target.value)}
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
                                    value={activity.time ?? ''}
                                    onChange={(e) => updateEditActivity(dayData.day, idx, 'time', e.target.value)}
                                    placeholder="08:00"
                                    className="w-full rounded-lg border border-slate-200 py-2 px-3 text-sm"
                                  />
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeEditActivity(dayData.day, idx)}
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
                                value={activity.title ?? ''}
                                onChange={(e) => updateEditActivity(dayData.day, idx, 'title', e.target.value)}
                                placeholder="Activity name"
                                className="w-full rounded-lg border border-slate-200 py-2 px-3 text-sm"
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-[10px] font-bold uppercase text-slate-500">Description</label>
                              <textarea
                                value={activity.text ?? ''}
                                onChange={(e) => updateEditActivity(dayData.day, idx, 'text', e.target.value)}
                                placeholder="Brief description"
                                rows={3}
                                className="w-full resize-none rounded-lg border border-slate-200 py-2 px-3 text-sm"
                              />
                            </div>
                            <div className="flex gap-3 flex-wrap">
                              <div className="min-w-[120px] flex-1">
                                <label className="mb-1 block text-[10px] font-bold uppercase text-slate-500">Tag 1</label>
                                <input
                                  type="text"
                                  value={activity.tag1 ?? ''}
                                  onChange={(e) => updateEditActivity(dayData.day, idx, 'tag1', e.target.value)}
                                  placeholder="e.g. 2 Hours"
                                  className="w-full rounded-lg border border-slate-200 py-2 px-3 text-sm"
                                />
                              </div>
                              <div className="min-w-[120px] flex-1">
                                <label className="mb-1 block text-[10px] font-bold uppercase text-slate-500">Tag 2</label>
                                <input
                                  type="text"
                                  value={activity.tag2 ?? ''}
                                  onChange={(e) => updateEditActivity(dayData.day, idx, 'tag2', e.target.value)}
                                  placeholder="e.g. History"
                                  className="w-full rounded-lg border border-slate-200 py-2 px-3 text-sm"
                                />
                              </div>
                            </div>
                          </article>
                        ))}
                        <button
                          type="button"
                          onClick={() => addEditActivity(dayData.day)}
                          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/30 py-4 text-sm font-bold text-primary hover:bg-primary/5"
                        >
                          <span className="material-symbols-outlined">add</span>
                          Add activity
                        </button>
                      </div>
                    ))}
                </div>

                <div className="flex gap-3 border-t border-slate-100 p-6">
                  <button
                    type="button"
                    onClick={() => setEditingItinerary(null)}
                    className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateItinerary(editingItinerary.id, {
                        title: editingItinerary.title,
                        destinationId: editingItinerary.destinationId,
                        travelers: editingItinerary.travelers,
                        durationDays: editingItinerary.durationDays,
                        pacing: editingItinerary.pacing,
                        budget: editingItinerary.budget,
                        activities: editingItinerary.activities,
                        days: editingItinerary.days,
                        notes: editingItinerary.notes,
                      })
                      setEditingItinerary(null)
                    }}
                    className="flex-1 rounded-xl bg-primary py-3 text-sm font-bold text-white hover:bg-primary/90"
                  >
                    Save
                  </button>
                </div>
              </>
            ) : (
              <div className="p-6">
                <p className="text-sm text-slate-600">
                  This itinerary uses an older format and cannot be edited here. You can view it or create a new one from the Plan Your Trip page.
                </p>
                <button
                  type="button"
                  onClick={() => setEditingItinerary(null)}
                  className="mt-4 rounded-xl bg-primary px-6 py-2 text-sm font-bold text-white hover:bg-primary/90"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
