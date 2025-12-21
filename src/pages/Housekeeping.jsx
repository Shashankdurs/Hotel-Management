// // src/pages/Housekeeping.jsx
import React, { useContext, useEffect, useState } from 'react'
import { DataContext } from '../contexts/DataContext'

const STATUSES = ['Pending', 'In Progress', 'Done']

export default function Housekeeping() {
  const { rooms, maintenanceRequests: maintenanceRequestsCtx = [], addMaintenanceRequest, deleteMaintenanceRequest } = useContext(DataContext)

  const [tasks, setTasks] = useState([])

  // dummy staff – you can replace with real staff later
  const staffList = [
    { id: 1, name: 'John (HK)' },
    { id: 2, name: 'Maria (HK)' },
    { id: 3, name: 'Ahmed (HK)' }
  ]

  const today = new Date().toISOString().slice(0, 10)

  // 🔄 keep cleaning tasks in sync with rooms from DataContext
  useEffect(() => {
    setTasks(prev => {
      const prevByRoomId = new Map(prev.map(t => [t.roomId, t]))

      // for each room from context, ensure we have a task
      return rooms.map(room => {
        const existing = prevByRoomId.get(room.id)

        if (existing) {
          // keep old status/staff/date, but update label/type if room changed
          return {
            ...existing,
            roomNumber:
              room.number || room.roomNumber || existing.roomNumber,
            type: room.type || existing.type
          }
        }

        // new room → create default cleaning task
        return {
          roomId: room.id,
          roomNumber: room.number || room.roomNumber || `Room ${room.id}`,
          type: room.type || 'Standard',
          status: 'Pending',
          staffId: '',
          scheduledFor: today
        }
      })
    })
  }, [rooms]) // runs whenever you add a room in Rooms.jsx

  const updateTask = (roomId, patch) => {
    setTasks(prev =>
      prev.map(t => (t.roomId === roomId ? { ...t, ...patch } : t))
    )
  }

  // ------- maintenance form state -------
  const [mRoomId, setMRoomId] = useState('')
  const [mTitle, setMTitle] = useState('')
  const [mDescription, setMDescription] = useState('')
  const [mPriority, setMPriority] = useState('Medium')

  const handleMaintenanceSubmit = e => {
    e.preventDefault()
    if (!mRoomId || !mTitle) return

    const room =
      rooms.find(r => String(r.id) === String(mRoomId)) || {}
    const roomLabel =
      room.number || room.roomNumber || `Room ${mRoomId}`

    addMaintenanceRequest({
      roomId: mRoomId,
      roomLabel,
      title: mTitle,
      description: mDescription,
      priority: mPriority,
      status: 'Open',
    })

    setMRoomId('')
    setMTitle('')
    setMDescription('')
    setMPriority('Medium')
  }

  return (
    <div className="space-y-6 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 text-slate-100 shadow-2xl ring-1 ring-slate-800">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Housekeeping
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Room cleaning schedule, staff assignments, and maintenance
            requests.
          </p>
        </div>

        <span className="rounded-full bg-slate-900/80 px-3 py-1 text-xs font-medium text-slate-300">
          Today • {today}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Cleaning schedule */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-900/90 p-5 shadow-inner shadow-slate-950/60 ring-1 ring-slate-800">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
                Room Cleaning Schedule
              </h2>
              <p className="text-xs text-slate-500">
                Assign staff and update cleaning status for each room.
              </p>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto rounded-xl border border-slate-800/60 bg-slate-950/40">
            <table className="min-w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Room</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Staff</th>
                  <th className="px-4 py-3 font-medium">Scheduled For</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => (
                  <tr
                    key={task.roomId}
                    className="border-t border-slate-800/60 hover:bg-slate-900/60"
                  >
                    <td className="px-4 py-3 text-slate-100">
                      {task.roomNumber}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {task.type}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-2 py-1 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
                        value={task.status}
                        onChange={e =>
                          updateTask(task.roomId, {
                            status: e.target.value
                          })
                        }
                      >
                        {STATUSES.map(s => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-2 py-1 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
                        value={task.staffId}
                        onChange={e =>
                          updateTask(task.roomId, {
                            staffId: e.target.value
                          })
                        }
                      >
                        <option value="">Unassigned</option>
                        {staffList.map(s => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="date"
                        className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-2 py-1 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
                        value={task.scheduledFor}
                        onChange={e =>
                          updateTask(task.roomId, {
                            scheduledFor: e.target.value
                          })
                        }
                      />
                    </td>
                  </tr>
                ))}

                {tasks.length === 0 && (
                  <tr>
                    <td
                      className="px-4 py-6 text-center text-slate-500"
                      colSpan={5}
                    >
                      No rooms available. Add rooms first.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Maintenance request form + list */}
        <div className="space-y-5 rounded-2xl bg-slate-900/90 p-5 shadow-inner shadow-slate-950/60 ring-1 ring-slate-800">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
              Maintenance Request
            </h2>
            <p className="text-xs text-slate-500">
              Create a maintenance ticket for any room.
            </p>

            <form
              onSubmit={handleMaintenanceSubmit}
              className="mt-4 space-y-3 text-xs"
            >
              <div>
                <label className="mb-1 block text-slate-300">Room</label>
                <select
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  value={mRoomId}
                  onChange={e => setMRoomId(e.target.value)}
                >
                  <option value="">Select room</option>
                  {rooms.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.number || r.roomNumber || `Room ${r.id}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-slate-300">Title</label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  value={mTitle}
                  onChange={e => setMTitle(e.target.value)}
                  placeholder="Example: AC not working"
                />
              </div>

              <div>
                <label className="mb-1 block text-slate-300">
                  Description
                </label>
                <textarea
                  rows={3}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  value={mDescription}
                  onChange={e => setMDescription(e.target.value)}
                  placeholder="Add more details about the issue..."
                />
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex-1">
                  <label className="mb-1 block text-slate-300">
                    Priority
                  </label>
                  <select
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    value={mPriority}
                    onChange={e => setMPriority(e.target.value)}
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="mt-5 rounded-full bg-sky-500 px-4 py-1.5 text-xs font-semibold text-slate-950 shadow hover:bg-sky-400 transition"
                >
                  Create
                </button>
              </div>
            </form>
          </div>

          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Recent Requests
            </h3>
            <div className="max-h-48 space-y-2 overflow-y-auto">
              {maintenanceRequestsCtx.length === 0 && (
                <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/40 p-3 text-[11px] text-slate-500">
                  No maintenance requests yet.
                </div>
              )}

              {maintenanceRequestsCtx.map(req => (
                <div
                  key={req.id}
                  className="rounded-xl bg-slate-950/40 p-3 text-[11px] ring-1 ring-slate-800"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-100">
                      {req.roomLabel}
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                      className={`rounded-full px-2 py-0.5 text-[10px] ${
                        req.priority === 'High'
                          ? 'bg-red-500/20 text-red-300'
                          : req.priority === 'Medium'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {req.priority}
                    </span>
                      <button
                        onClick={() => {
                          if (window.confirm('Delete this maintenance request?')) {
                            deleteMaintenanceRequest(req.id)
                          }
                        }}
                        className="text-red-400 hover:text-red-600 text-xs px-2 py-0.5 rounded"
                        aria-label={`Delete request ${req.id}`}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="mt-1 text-slate-300">{req.title}</div>
                  {req.description && (
                    <div className="mt-1 text-slate-400">
                      {req.description}
                    </div>
                  )}
                  <div className="mt-1 text-[10px] text-slate-500">
                    {req.createdAt} • Status: {req.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
