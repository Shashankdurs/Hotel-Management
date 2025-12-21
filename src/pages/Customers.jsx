import React, { useEffect, useState } from 'react'
import Modal from '../components/Modal'
import toast from 'react-hot-toast'

const API_URL = 'http://localhost:5000/api/customers'

export default function Customers() {
  const [customers, setCustomers] = useState([])
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '' })

  // 🔹 Fetch customers from backend
  async function fetchCustomers() {
    try {
      const res = await fetch(API_URL)
      const data = await res.json()
      setCustomers(data)
    } catch (err) {
      toast.error('Failed to load customers')
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase())
  )

  // 🔹 Add customer (backend)
  async function submit() {
    if (!form.name) return toast.error('Name required')

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) throw new Error()

      toast.success('Customer added')
      setOpen(false)
      setForm({ name: '', email: '', phone: '' })
      fetchCustomers() // refresh list
    } catch (err) {
      toast.error('Failed to add customer')
    }
  }

  return (
    <div className="space-y-6 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 text-slate-100 shadow-2xl ring-1 ring-slate-800">

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h3 className="text-2xl font-semibold tracking-tight">Customers</h3>
          <p className="mt-1 text-sm text-slate-400">
            Manage customers and their contact information.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            placeholder="Search"
            className="rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-200 shadow"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />

          <button
            onClick={() => setOpen(true)}
            className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-900 shadow"
          >
            Add
          </button>
        </div>
      </div>

      {/* Customer List */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(c => (
          <div
            key={c._id}
            className="rounded-2xl bg-slate-900/80 p-4 shadow ring-1 ring-slate-800"
          >
            <div className="font-semibold">{c.name}</div>
            <div className="text-sm text-slate-400">{c.email}</div>
            <div className="text-sm text-slate-400">{c.phone}</div>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="col-span-full text-center text-sm text-slate-500">
            No customers found.
          </p>
        )}
      </div>

      {/* Modal */}
      <Modal open={open} onClose={() => setOpen(false)} title="Add Customer">
        <div className="space-y-4 text-sm">
          <input
            className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2"
            placeholder="Name"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          />

          <input
            className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2"
            placeholder="Email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          />

          <input
            className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2"
            placeholder="Phone"
            value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
          />

          <div className="flex justify-end">
            <button
              onClick={submit}
              className="rounded-xl bg-sky-500 px-5 py-2 text-sm font-semibold text-slate-900"
            >
              Save
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
