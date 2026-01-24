import React, { useContext, useEffect, useState } from 'react'
import { DataContext } from '../contexts/DataContext'
import toast from 'react-hot-toast'
import StatCard from '../components/StatCard'
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts'

export default function Dashboard() {
  const { rooms, bookings, customers } = useContext(DataContext)
  const [problems, setProblems] = useState([])

  function loadProblems() {
    try {
      return JSON.parse(localStorage.getItem('problems') || '[]')
    } catch {
      return []
    }
  }

  useEffect(() => {
    async function fetchFromServer() {
      try {
        const res = await fetch('http://localhost:5000/api/problems')
        if (!res.ok) throw new Error()
        const data = await res.json()
        const normalized = data.map(p => ({
          id: p.id || p._id || String(Date.now() + Math.random()),
          ...p
        }))
        setProblems(normalized)
        localStorage.setItem('problems', JSON.stringify(normalized))
        window.dispatchEvent(
          new CustomEvent('problems-updated', { detail: { problems: normalized } })
        )
      } catch {
        setProblems(loadProblems())
      }
    }

    fetchFromServer()

    function onUpdated(e) {
      setProblems(e?.detail?.problems || loadProblems())
    }

    window.addEventListener('problems-updated', onUpdated)
    return () => window.removeEventListener('problems-updated', onUpdated)
  }, [])

  // ✅ DELETE PROBLEM
  function deleteProblem(id) {
    if (!window.confirm('Are you sure you want to delete this problem?')) return

    const updated = problems.filter(p => p.id !== id)
    setProblems(updated)
    localStorage.setItem('problems', JSON.stringify(updated))

    window.dispatchEvent(
      new CustomEvent('problems-updated', { detail: { problems: updated } })
    )

    toast.success('Problem deleted')
  }

  const totalRooms = rooms.length
  const available = rooms.filter(r => r.status === 'Available').length
  const occupied = totalRooms - available
  const today = new Date().toISOString().slice(0, 10)

  const chartData = [
    { name: 'Mon', bookings: 3 },
    { name: 'Tue', bookings: 5 },
    { name: 'Wed', bookings: 2 },
    { name: 'Thu', bookings: 6 },
    { name: 'Fri', bookings: 4 },
    { name: 'Sat', bookings: 7 }
  ]

  return (
    <div className="space-y-6 rounded-3xl bg-slate-50 dark:bg-[#020617] p-6 text-slate-900 dark:text-slate-100 shadow-xl ring-1 ring-slate-200 dark:ring-slate-800">

      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold">Analytics</h1>
          <p className="mt-1 text-sm text-slate-500">
            Overview of room occupancy and bookings
          </p>
        </div>

        <span className="rounded-full bg-[#2C666E]/10 px-3 py-1 text-xs font-medium text-[#2C666E]">
          Today • {today}
        </span>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-2xl bg-[#0F3D3E] p-4 text-white shadow-lg">
          <StatCard title="Total Rooms" value={totalRooms} />
        </div>
        <div className="rounded-2xl bg-[#0F3D3E] p-4 text-white shadow-lg">
          <StatCard title="Available" value={available} />
        </div>
        <div className="rounded-2xl bg-[#0F3D3E] p-4 text-white shadow-lg">
          <StatCard title="Occupied" value={occupied} />
        </div>
        <div className="rounded-2xl bg-[#0F3D3E] p-4 text-white shadow-lg">
          <StatCard title="Customers" value={customers.length} />
        </div>
      </div>

      {/* CHART + PROBLEMS */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

        {/* LINE CHART */}
        <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-[#020617] p-5 shadow-lg ring-1 ring-slate-200 dark:ring-slate-800">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Weekly Bookings
          </h3>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#405e82" />
                <XAxis dataKey="name" stroke="#3d516d" />
                <YAxis stroke="#1e314b" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="#143e44"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RECENT PROBLEMS */}
        <div className="rounded-2xl bg-white dark:bg-[#020617] p-5 shadow-lg ring-1 ring-slate-200 dark:ring-slate-800">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Recent Problems
          </h3>

          <div className="space-y-2 max-h-72 overflow-y-auto">
            {problems.length === 0 && (
              <div className="text-sm text-slate-400">
                No problems reported
              </div>
            )}

            {problems.slice(0, 6).map(p => (
              <div
                key={p.id}
                className="rounded-xl bg-slate-100 dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-800"
              >
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <div className="font-semibold">{p.title}</div>
                    <div className="text-xs text-slate-500">
                      {p.userName} • {p.createdAt}
                    </div>
                  </div>

                  <button
                    onClick={() => deleteProblem(p.id)}
                    className="text-xs text-red-500 hover:text-red-700 font-medium"
                  >
                    Delete
                  </button>
                </div>

                <div className="mt-2 flex gap-2">
                  <span className="px-2 py-0.5 text-[11px] rounded bg-[#2C666E]/20 text-[#2C666E]">
                    {p.category}
                  </span>
                  <span className="px-2 py-0.5 text-[11px] rounded bg-amber-100 text-amber-700">
                    {p.priority}
                  </span>
                  <span className="px-2 py-0.5 text-[11px] rounded bg-emerald-100 text-emerald-700">
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
