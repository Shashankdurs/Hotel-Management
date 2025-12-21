import React, { useContext, useMemo, useState } from 'react'
import { DataContext } from '../contexts/DataContext'
import RoomCard from '../components/RoomCard'
import Modal from '../components/Modal'
import toast from 'react-hot-toast'

export default function Rooms() {
  const { rooms, addRoom, deleteRoom } = useContext(DataContext)
  const [filter, setFilter] = useState('All')
  const [open, setOpen] = useState(false)

  // NEW: currency state
  const [currency, setCurrency] = useState('INR') // 'INR' or 'USD'

  const [form, setForm] = useState({
    number: '',
    type: 'Single',
    price: '',
    status: 'Available',
  })

  const filteredRooms = useMemo(
    () => rooms.filter(r => (filter === 'All' ? true : r.status === filter)),
    [rooms, filter]
  )

  function submit() {
    if (!form.number || !form.price) {
      toast.error('Please fill in room number and price')
      return
    }

    const rawPrice = Number(form.price)
    if (Number.isNaN(rawPrice) || rawPrice <= 0) {
      toast.error('Enter a valid price')
      return
    }

    // 🔁 Simple static conversion rate
    const USD_TO_INR = 83 // change this whenever you want

    // Always store price in INR
    const priceInINR = currency === 'USD' ? rawPrice * USD_TO_INR : rawPrice

    addRoom({ ...form, price: priceInINR })
    toast.success(
      `Room added with price ₹${priceInINR.toLocaleString('en-IN')}`
    )
    setOpen(false)

    setForm({
      number: '',
      type: 'Single',
      price: '',
      status: 'Available',
    })
    setCurrency('INR')
  }

  function handleDelete(id) {
    if (confirm('Are you sure you want to delete this room?')) {
      deleteRoom(id)
      toast.success('Room deleted')
    }
  }

  return (
    <div className="space-y-6 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 text-slate-100 shadow-2xl ring-1 ring-slate-800">

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h3 className="text-2xl font-semibold tracking-tight">Rooms</h3>
          <p className="mt-1 text-sm text-slate-400">
            Manage available, occupied, and pending rooms.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2 text-sm text-slate-200 shadow focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option>All</option>
            <option>Available</option>
            <option>Occupied</option>
            <option>Pending</option>
          </select>

          <button
            onClick={() => setOpen(true)}
            className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow hover:bg-sky-400 transition"
          >
            Add Room
          </button>
        </div>
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredRooms.map(room => (
          <div
            key={room.id}
            className="relative rounded-2xl bg-slate-900/80 p-4 shadow-inner shadow-slate-950/60 ring-1 ring-slate-800 group"
          >
            {/* Delete Button - appears on hover */}
            <button
              onClick={() => handleDelete(room.id)}
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition bg-red-500 hover:bg-red-400 text-white text-xs px-3 py-1 rounded-lg shadow"
            >
              Delete
            </button>

            <RoomCard room={room} />
          </div>
        ))}

        {filteredRooms.length === 0 && (
          <p className="col-span-full text-center text-sm text-slate-500">
            No rooms found for this filter.
          </p>
        )}
      </div>

      {/* Modal */}
      <Modal open={open} onClose={() => setOpen(false)} title="Add Room">
        <div className="space-y-4 text-sm">
          <input
            className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-slate-100 shadow focus:outline-none focus:ring-1 focus:ring-sky-500"
            placeholder="Room Number"
            value={form.number}
            onChange={e => setForm(f => ({ ...f, number: e.target.value }))}
          />

          <select
            className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-slate-200 shadow focus:outline-none focus:ring-1 focus:ring-sky-500"
            value={form.type}
            onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
          >
            <option>Single</option>
            <option>Double</option>
            <option>Suite</option>
          </select>

          {/* Price + Currency Row */}
          <div className="flex gap-3">
            <input
              type="number"
              className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-slate-100 shadow focus:outline-none focus:ring-1 focus:ring-sky-500"
              placeholder={currency === 'INR' ? 'Price (₹)' : 'Price ($)'}
              value={form.price}
              onChange={e =>
                setForm(f => ({ ...f, price: e.target.value }))
              }
            />

            <select
              className="w-32 rounded-xl border border-slate-700 bg-slate-950/60 px-2 py-2 text-slate-200 shadow focus:outline-none focus:ring-1 focus:ring-sky-500 text-xs"
              value={currency}
              onChange={e => setCurrency(e.target.value)}
            >
              <option value="INR">INR ₹</option>
              <option value="USD">USD $</option>
            </select>
          </div>

          <select
            className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-slate-200 shadow focus:outline-none focus:ring-1 focus:ring-sky-500"
            value={form.status}
            onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
          >
            <option value="Available">Available</option>
            <option value="Occupied">Occupied</option>
            <option value="Pending">Pending</option>
          </select>

          <p className="text-[11px] text-slate-500">
            Prices are always saved in <span className="font-semibold">₹ INR</span>. If you choose
            USD, it will be converted using 1 USD ≈ ₹83.
          </p>

          <div className="flex justify-end">
            <button
              onClick={submit}
              className="rounded-xl bg-sky-500 px-5 py-2 text-sm font-semibold text-slate-900 shadow hover:bg-sky-400 transition"
            >
              Save Room
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
