import React, { useContext, useEffect, useState } from 'react'
import { DataContext } from '../contexts/DataContext'
import toast from 'react-hot-toast'
import StatCard from '../components/StatCard'
import BookingCard from '../components/BookingCard'
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
    } catch (e) {
      return []
    }
  }

  useEffect(() => {
    // initial load: try backend first, fall back to localStorage
    async function fetchFromServer() {
      try {
        const res = await fetch('http://localhost:5000/api/problems')
        if (!res.ok) throw new Error('no-api')
        const data = await res.json()
        // normalize ids so UI can rely on `id`
        const norm = data.map(p => ({ id: p.id || p._id || String(Date.now() + Math.random()), ...p }))
        setProblems(norm)
        try {
          localStorage.setItem('problems', JSON.stringify(norm))
          const ev = new CustomEvent('problems-updated', { detail: { problems: norm } })
          window.dispatchEvent(ev)
        } catch (e) {}
        return
      } catch (e) {
        // ignore and fall back to localStorage
      }
      setProblems(loadProblems())
    }

    fetchFromServer()

    function onUpdated(e) {
      if (e?.detail?.problems) setProblems(e.detail.problems)
      else setProblems(loadProblems())
    }

    function onStorage(e) {
      if (e.key === 'problems') setProblems(JSON.parse(e.newValue || '[]'))
    }

    window.addEventListener('problems-updated', onUpdated)
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener('problems-updated', onUpdated)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  function deleteProblem(id) {
    if (!window.confirm('Delete this problem? This action cannot be undone.')) return
    try {
      const next = problems.filter(p => p.id !== id)
      localStorage.setItem('problems', JSON.stringify(next))
      setProblems(next)
      try {
        const ev = new CustomEvent('problems-updated', { detail: { problems: next } })
        window.dispatchEvent(ev)
      } catch (e) {}
      toast.success('Problem deleted')
    } catch (e) {
      console.error('Failed to delete problem', e)
      toast.error('Failed to delete problem')
    }
  }

  const totalRooms = rooms.length
  const available = rooms.filter(r => r.status === 'Available').length
  const occupied = totalRooms - available

  const today = new Date().toISOString().slice(0, 10)
  const todaysBookings = bookings.filter(
    b => b.checkIn === today || b.checkOut === today
  )

  const chartData = [
    { name: 'Mon', bookings: 3 },
    { name: 'Tue', bookings: 5 },
    { name: 'Wed', bookings: 2 },
    { name: 'Thu', bookings: 6 },
    { name: 'Fri', bookings: 4 },
    { name: 'Sat', bookings: 7 }
  ]

  // Build dynamic chart data for the last 7 days based on bookings
  // We count bookings by their check-in date for each day.
  const [dynamicChartData, setDynamicChartData] = React.useState([])

  React.useEffect(() => {
    // create array of last 7 days (including today)
    const days = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const iso = d.toISOString().slice(0, 10)
      const weekday = d.toLocaleDateString(undefined, { weekday: 'short' })
      const count = bookings.filter(b => b.checkIn === iso).length
      days.push({ name: weekday, bookings: count })
    }
    setDynamicChartData(days)
  }, [bookings])

  // 🧾 DOWNLOAD REPORT AS PDF
  function handleDownloadReport() {
    if (!window.jspdf || !window.jspdf.jsPDF) {
      alert('PDF library not loaded. Please check jsPDF script.')
      return
    }

    const { jsPDF } = window.jspdf
    const doc = new jsPDF()

    let y = 10

    // Title
    doc.setFontSize(16)
    doc.text('Hotel Dashboard Report', 10, y)
    y += 8

    // Date
    doc.setFontSize(10)
    doc.text(`Date: ${today}`, 10, y)
    y += 6

    // Summary
    y += 2
    doc.setFontSize(12)
    doc.text('Summary', 10, y)
    y += 6
    doc.setFontSize(10)

    const summaryLines = [
      `Total Rooms: ${totalRooms}`,
      `Available Rooms: ${available}`,
      `Occupied Rooms: ${occupied}`,
      `Total Customers: ${customers.length}`,
      `Total Bookings: ${bookings.length}`,
      `Problems Count: ${problems.length}`
    ]

    summaryLines.forEach(line => {
      doc.text(line, 10, y)
      y += 5
    })

    // Today's Bookings section
    y += 4
    if (y > 270) {
      doc.addPage()
      y = 10
    }

    doc.setFontSize(12)
    doc.text(`Today's Bookings (${todaysBookings.length})`, 10, y)
    y += 6
    doc.setFontSize(9)

    if (todaysBookings.length === 0) {
      doc.text('No bookings today.', 10, y)
      y += 5
    } else {
      todaysBookings.forEach(b => {
        if (y > 270) {
          doc.addPage()
          y = 10
        }
        const line1 = `Booking #${b.id} | Room: ${b.roomId} | Customer: ${b.customerId || '-'}`
        const line2 = `Check-in: ${b.checkIn || '-'} | Check-out: ${b.checkOut || '-'} | Status: ${
          b.status || '-'
        } | Total: ₹${b.total ?? 0}`

        doc.text(line1, 10, y)
        y += 4
        doc.text(line2, 10, y)
        y += 6
      })
    }

    // Recent Problems section
    y += 4
    if (y > 270) {
      doc.addPage()
      y = 10
    }
    doc.setFontSize(12)
    doc.text(`Recent Problems (${Math.min(problems.length, 6)})`, 10, y)
    y += 6
    doc.setFontSize(9)

    if (problems.length === 0) {
      doc.text('No problems reported.', 10, y)
      y += 5
    } else {
      problems.slice(0, 6).forEach(p => {
        if (y > 270) {
          doc.addPage()
          y = 10
        }

        doc.text(`[#${p.id}] ${p.title}`, 10, y)
        y += 4
        doc.text(`By: ${p.userName || '-'} | Room: ${p.roomNumber || 'N/A'} | ${p.createdAt || ''}`, 10, y)
        y += 4

        const desc = p.description || ''
        const splitDesc = doc.splitTextToSize(desc, 180)
        doc.text(splitDesc, 10, y)
        y += splitDesc.length * 4

        const metaLine = `Room issues: ${p.roomIssues || 'N/A'} | Food quality: ${
          p.foodQuality || 'N/A'
        }`
        doc.text(metaLine, 10, y)
        y += 4

        const tagsLine = `Category: ${p.category || '-'} | Priority: ${
          p.priority || '-'
        } | Status: ${p.status || '-'}`
        doc.text(tagsLine, 10, y)
        y += 6
      })
    }

    // Save
    doc.save(`hotel-dashboard-report-${today}.pdf`)
  }

  return (
    <div className="space-y-6 rounded-3xl bg-slate-950/90 p-6 text-slate-100 shadow-xl ring-1 ring-slate-800">
      {/* Top header like the design */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
          <p className="mt-1 text-sm text-slate-400">
            Overview of room occupancy and bookings
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-slate-300">
            Today • {today}
          </span>
          <button
            onClick={handleDownloadReport}
            className="rounded-full bg-sky-500 px-4 py-1.5 text-xs font-semibold text-slate-950 shadow hover:bg-sky-400 transition"
          >
            Download report
          </button>
        </div>
      </div>

      {/* KPI cards row */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-2xl bg-slate-900/70 p-4 shadow-inner shadow-slate-900/40 ring-1 ring-slate-800">
          <StatCard title="Total Rooms" value={totalRooms} />
        </div>
        <div className="rounded-2xl bg-slate-900/70 p-4 shadow-inner shadow-slate-900/40 ring-1 ring-slate-800">
          <StatCard title="Available" value={available} />
        </div>
        <div className="rounded-2xl bg-slate-900/70 p-4 shadow-inner shadow-slate-900/40 ring-1 ring-slate-800">
          <StatCard title="Occupied" value={occupied} />
        </div>
        <div className="rounded-2xl bg-slate-900/70 p-4 shadow-inner shadow-slate-900/40 ring-1 ring-slate-800">
          <StatCard title="Customers" value={customers.length} />
        </div>
      </div>

      {/* Chart + side panel like the example */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Big chart card */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-900/80 p-5 shadow-inner shadow-slate-900/50 ring-1 ring-slate-800">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
                Daily Line Chart
              </h3>
              <p className="text-xs text-slate-500">
                Bookings activity across the week
              </p>
            </div>
            <div className="flex gap-2 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full bg-sky-400" />
                Bookings
              </span>
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#020617',
                    border: '1px solid #1f2937',
                    borderRadius: '0.5rem',
                    fontSize: '0.75rem'
                  }}
                  labelStyle={{ color: '#e5e7eb' }}
                />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="#fb923c"
                  strokeWidth={2}
                  dot={{ r: 3, strokeWidth: 1 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right side mini panel with Today's Bookings and Recent Problems */}
        <div className="rounded-2xl bg-slate-900/80 p-5 shadow-inner shadow-slate-900/50 ring-1 ring-slate-800 space-y-4">
        

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-300">
              Recent Problems
            </h3>
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {problems.length === 0 && (
                <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/40 p-4 text-xs text-slate-500">
                  No problems reported
                </div>
              )}

              {problems.slice(0, 6).map(p => (
                <div
                  key={p.id}
                  className="rounded-xl bg-slate-950/40 p-3 ring-1 ring-slate-800 text-xs"
                >
                  <div className="flex justify-between items-center gap-3">
                    <div className="font-semibold">{p.title}</div>
                    <div className="flex items-center gap-2">
                      <div className="text-slate-400">#{p.id}</div>
                      <button
                        onClick={() => deleteProblem(p.id)}
                        className="text-red-400 hover:text-red-600 text-xs px-2 py-0.5 rounded"
                        aria-label={`Delete problem ${p.id}`}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="text-slate-300">
                    by {p.userName} • {p.createdAt}
                  </div>
                  <div className="mt-1 text-sm">
                    <strong>Room:</strong> {p.roomNumber || 'N/A'}
                  </div>
                  <div className="mt-2 text-slate-200">
                    {p.description}
                  </div>
                  <div className="mt-1 text-sm">
                    <strong>Room issues:</strong> {p.roomIssues || 'N/A'}
                  </div>
                  <div className="mt-1 text-sm">
                    <strong>Food quality:</strong> {p.foodQuality || 'N/A'}
                  </div>
                  <div className="mt-2 flex gap-2">
                    <div className="inline-block px-2 py-0.5 text-[11px] rounded bg-sky-800/40">
                      {p.category}
                    </div>
                    <div className="inline-block px-2 py-0.5 text-[11px] rounded bg-amber-800/30">
                      {p.priority}
                    </div>
                    <div className="inline-block px-2 py-0.5 text-[11px] rounded bg-emerald-800/20">
                      {p.status}
                    </div>
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
