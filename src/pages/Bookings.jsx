// src/pages/Bookings.jsx
import React, { useEffect, useState } from 'react'
import BookingCard from '../components/BookingCard'
import Modal from '../components/Modal'
import toast from 'react-hot-toast'

const API = 'http://localhost:5000/api/bookings'

export default function Bookings() {
  const [bookings, setBookings] = useState([])
  const [open, setOpen] = useState(false)

  const [form, setForm] = useState({
    guestName: '',
    guestPhone: '',
    guestEmail: '',
    roomId: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
  })

  async function fetchBookings() {
    try {
      const res = await fetch(API)
      const data = await res.json()
      setBookings(data)
    } catch {
      toast.error('Failed to load bookings')
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  async function submit() {
    if (!form.guestName || !form.roomId || !form.checkIn || !form.checkOut) {
      return toast.error('Fill all fields')
    }

    try {
      await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, status: 'Booked' }),
      })

      toast.success('Booking added')
      setOpen(false)
      fetchBookings()

      setForm({
        guestName: '',
        guestPhone: '',
        guestEmail: '',
        roomId: '',
        checkIn: '',
        checkOut: '',
        guests: 1,
      })
    } catch {
      toast.error('Failed to add booking')
    }
  }

  async function updateStatus(id, status) {
    try {
      await fetch(`${API}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      toast.success(`Status updated to ${status}`)
      fetchBookings()
    } catch {
      toast.error('Failed to update status')
    }
  }

  return (
    <div className="space-y-6 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 text-slate-100 shadow-2xl ring-1 ring-slate-800">

      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h3 className="text-2xl font-semibold tracking-tight">Bookings</h3>
          <p className="mt-1 text-sm text-slate-400">
            Manage room bookings from users and admin
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow hover:bg-sky-400 transition"
        >
          New Booking
        </button>
      </div>

      {/* BOOKINGS LIST */}
      <div className="grid grid-cols-1 gap-4">
        {bookings.map(b => (
          <div
            key={b._id}
            className="rounded-2xl bg-slate-900/80 p-4 shadow-inner shadow-slate-950/60 ring-1 ring-slate-800"
          >
            <BookingCard b={b} />

            <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
              <span>
                Guest:{' '}
                <span className="font-semibold text-slate-200">
                  {b.guestName}
                </span>
              </span>

              <div className="flex gap-2">
                {b.status === 'Booked' && (
                  <button
                    onClick={() => updateStatus(b._id, 'Checked-in')}
                    className="rounded-full bg-emerald-500/20 px-3 py-1 text-emerald-200 hover:bg-emerald-500/30 transition"
                  >
                    {/* Check-in */}
                  </button>
                )}

                {b.status === 'Checked-in' && (
                  <button
                    onClick={() => updateStatus(b._id, 'Checked-out')}
                    className="rounded-full bg-sky-500/20 px-3 py-1 text-sky-200 hover:bg-sky-500/30 transition"
                  >
                    {/* Check-out */}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {bookings.length === 0 && (
          <p className="text-center text-sm text-slate-500">
            No bookings found
          </p>
        )}
      </div>

      {/* MODAL */}
      <Modal open={open} onClose={() => setOpen(false)} title="New Booking">
        <div className="space-y-4 text-sm">

          {[
            ['Guest Name', 'guestName'],
            ['Phone', 'guestPhone'],
            ['Email', 'guestEmail'],
            ['Room ID', 'roomId'],
          ].map(([label, key]) => (
            <input
              key={key}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-slate-100 shadow focus:outline-none focus:ring-1 focus:ring-sky-500"
              placeholder={label}
              value={form[key]}
              onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
            />
          ))}

          <input
            type="date"
            className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-slate-100 shadow focus:outline-none focus:ring-1 focus:ring-sky-500"
            value={form.checkIn}
            onChange={e => setForm(f => ({ ...f, checkIn: e.target.value }))}
          />

          <input
            type="date"
            className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-slate-100 shadow focus:outline-none focus:ring-1 focus:ring-sky-500"
            value={form.checkOut}
            onChange={e => setForm(f => ({ ...f, checkOut: e.target.value }))}
          />

          <button
            onClick={submit}
            className="w-full rounded-xl bg-sky-500 py-2 text-sm font-semibold text-slate-900 shadow hover:bg-sky-400 transition"
          >
            Save Booking
          </button>
        </div>
      </Modal>
    </div>
  )
}
