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

  // 🔹 FETCH BOOKINGS FROM BACKEND
  async function fetchBookings() {
    try {
      const res = await fetch(API)
      const data = await res.json()
      setBookings(data)
    } catch (err) {
      toast.error('Failed to load bookings')
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  // 🔹 CREATE NEW BOOKING (ADMIN)
  async function submit() {
    if (!form.guestName || !form.roomId || !form.checkIn || !form.checkOut) {
      return toast.error('Fill all fields')
    }

    try {
      await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          status: 'Booked',
        }),
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

  // 🔹 UPDATE BOOKING STATUS
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
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-semibold">Bookings</h3>
          <p className="text-sm text-slate-400">
            Manage room bookings from users and admin
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-black hover:bg-sky-400"
        >
          New Booking
        </button>
      </div>

      {/* BOOKINGS LIST */}
      <div className="grid gap-4">
        {bookings.map(b => (
          <div
            key={b._id}
            className="rounded-2xl bg-slate-900/80 p-4 ring-1 ring-slate-800"
          >
            <BookingCard b={b} />

            <div className="mt-3 flex justify-between text-xs text-slate-400">
              <span>
                Guest:{' '}
                <span className="text-slate-200 font-semibold">
                  {b.guestName}
                </span>
              </span>

              <div className="flex gap-2">
                {b.status === 'Checked-in' && (
                  <button
                    onClick={() => updateStatus(b._id, 'Checked-out')}
                    className="bg-sky-500/20 px-3 py-1 rounded-full text-sky-200"
                  >
                    Check-out
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
        <div className="space-y-3">
          <input
            className="ud-input"
            placeholder="Guest Name"
            value={form.guestName}
            onChange={e => setForm(f => ({ ...f, guestName: e.target.value }))}
          />

          <input
            className="ud-input"
            placeholder="Phone"
            value={form.guestPhone}
            onChange={e => setForm(f => ({ ...f, guestPhone: e.target.value }))}
          />

          <input
            className="ud-input"
            placeholder="Email"
            value={form.guestEmail}
            onChange={e => setForm(f => ({ ...f, guestEmail: e.target.value }))}
          />

          <input
            className="ud-input"
            placeholder="Room ID"
            value={form.roomId}
            onChange={e => setForm(f => ({ ...f, roomId: e.target.value }))}
          />

          <input type="date" className="ud-input"
            value={form.checkIn}
            onChange={e => setForm(f => ({ ...f, checkIn: e.target.value }))} />

          <input type="date" className="ud-input"
            value={form.checkOut}
            onChange={e => setForm(f => ({ ...f, checkOut: e.target.value }))} />

          <button
            onClick={submit}
            className="w-full bg-sky-500 py-2 rounded-xl text-black font-semibold"
          >
            Save Booking
          </button>
        </div>
      </Modal>
    </div>
  )
}
