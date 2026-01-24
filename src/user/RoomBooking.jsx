// src/components/RoomBooking.jsx
import React, { useContext, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { DataContext } from '../contexts/DataContext'
import toast from 'react-hot-toast'

export default function RoomBooking() {
  const { user } = useContext(AuthContext)
  const { rooms, addBooking, updateRoomStatus } = useContext(DataContext)

  const userName = user?.name || ''
  const userEmail = user?.email || ''

  /* ================= CUSTOMER DETAILS ================= */
  const [customer, setCustomer] = useState({
    name: userName,
    phone: '',
    email: userEmail,
  })

  const customerValid =
    customer.name.trim() &&
    customer.phone.trim() &&
    customer.email.trim()

  /* ================= BOOKING STATES ================= */
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(1)
  const [search, setSearch] = useState('')
  const [bookingRoomId, setBookingRoomId] = useState(null)

  /* ================= BOOK ROOM ================= */
  async function handleBookRoom(room) {
    if (room.status === 'Occupied') return

    if (!customerValid) {
      toast.error('Please fill customer details first')
      return
    }

    if (!checkIn || !checkOut) {
      toast.error('Select check-in and check-out dates')
      return
    }

    const inDate = new Date(checkIn)
    const outDate = new Date(checkOut)

    if (outDate <= inDate) {
      toast.error('Check-out must be after check-in')
      return
    }

    setBookingRoomId(room.id)

    const nights = Math.max(
      1,
      Math.round((outDate - inDate) / (1000 * 60 * 60 * 24))
    )
    const total = (room.price || 0) * nights

    try {
      await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: room.id,
          checkIn,
          checkOut,
          guests,
          total,
          status: 'Booked',
          guestName: customer.name,
          guestPhone: customer.phone,
          guestEmail: customer.email,
        }),
      })

      addBooking({
        roomId: room.id,
        checkIn,
        checkOut,
        guests,
        total,
        status: 'Booked',
        guestName: customer.name,
        guestPhone: customer.phone,
        guestEmail: customer.email,
      })

      // 🔴 IMPORTANT: mark room as Occupied
      updateRoomStatus(room.id, 'Occupied')

      toast.success(`Room ${room.number} booked successfully`)
    } catch {
      toast.error('Booking failed')
    } finally {
      setBookingRoomId(null)
    }
  }

  /* ================= FILTER ROOMS ================= */
  const visibleRooms = rooms.filter(r => {
    const type = (r.type || '').toLowerCase()
    const number = String(r.number || '').toLowerCase()
    const q = search.toLowerCase()
    return !q || type.includes(q) || number.includes(q)
  })

  return (
    <div className="flex flex-col lg:flex-row gap-4">

      {/* ================= LEFT: ROOMS ================= */}
      <div className="flex-1 space-y-4">

        {/* SEARCH + DATES */}
        <div className="rounded-2xl bg-slate-900 text-white p-4 shadow">
          <div className="flex flex-wrap gap-4 items-end">

            <div className="flex flex-col">
              <label className="text-xs text-slate-300 mb-1">Search Room</label>
              <input
                placeholder="Room number / type"
                className="ud-input !bg-slate-950 !text-white"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs text-slate-300 mb-1">Check-in Date</label>
              <input
                type="date"
                className="ud-input !bg-slate-950 !text-white"
                value={checkIn}
                onChange={e => setCheckIn(e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs text-slate-300 mb-1">Check-out Date</label>
              <input
                type="date"
                className="ud-input !bg-slate-950 !text-white"
                value={checkOut}
                onChange={e => setCheckOut(e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs text-slate-300 mb-1">Guests</label>
              <input
                type="number"
                min="1"
                className="ud-input !bg-slate-950 !text-white w-24"
                value={guests}
                onChange={e => setGuests(Number(e.target.value))}
              />
            </div>

          </div>
        </div>

        {/* ROOM GRID */}
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {visibleRooms.map(room => (
            <div
              key={room.id}
              className="rounded-2xl bg-white shadow ring-1 ring-slate-200 overflow-hidden"
            >
              <img
                src={room.image}
                alt="Room"
                className="h-36 w-full object-cover"
              />

              <div className="p-3">
                <div className="flex justify-between items-center">
                  <div className="font-semibold text-slate-800">
                    Room {room.number} ({room.type})
                  </div>

                  {room.status === 'Occupied' && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                      Booked
                    </span>
                  )}
                </div>

                <div className="text-emerald-600 font-bold mt-1">
                  ₹ {room.price?.toLocaleString()}
                </div>

                <button
                  onClick={() => handleBookRoom(room)}
                  disabled={
                    !customerValid ||
                    bookingRoomId === room.id ||
                    room.status === 'Occupied'
                  }
                  className={`mt-3 w-full rounded-full text-xs py-2 transition
                    ${
                      room.status === 'Occupied'
                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                        : 'bg-sky-500 text-white hover:bg-sky-400'
                    }
                  `}
                >
                  {room.status === 'Occupied'
                    ? 'Booked'
                    : bookingRoomId === room.id
                    ? 'Booking...'
                    : 'Book Room'}
                </button>
              </div>
            </div>
          ))}

          {visibleRooms.length === 0 && (
            <div className="col-span-full text-center text-sm text-slate-500">
              No rooms found
            </div>
          )}
        </div>
      </div>

      {/* ================= RIGHT: CUSTOMER DETAILS ================= */}
      <div className="w-full lg:max-w-xs">
        <div className="lg:sticky lg:top-6 rounded-2xl bg-white p-4 shadow ring-1 ring-slate-200">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">
            Customer Details
          </h3>

          <div className="space-y-3">
            <input
              placeholder="Full Name"
              className="ud-input"
              value={customer.name}
              onChange={e =>
                setCustomer(c => ({ ...c, name: e.target.value }))
              }
            />

            <input
              placeholder="Phone Number"
              className="ud-input"
              value={customer.phone}
              onChange={e =>
                setCustomer(c => ({ ...c, phone: e.target.value }))
              }
            />

            <input
              placeholder="Email Address"
              className="ud-input"
              value={customer.email}
              onChange={e =>
                setCustomer(c => ({ ...c, email: e.target.value }))
              }
            />
          </div>

          {!customerValid && (
            <p className="mt-3 text-xs text-rose-500">
              Fill all details to book a room
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
