import React, { useContext, useState } from 'react'
import { DataContext } from '../contexts/DataContext'
import { AuthContext } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import './../styles/UserDashboard.css'

export default function OrderFood() {
  const { rooms } = useContext(DataContext)
  const { addFoodOrder } = useContext(DataContext)
  const { user } = useContext(AuthContext)
  const userName = user?.name || user?.email || 'Guest'

  const [roomId, setRoomId] = useState('')
  const [itemsText, setItemsText] = useState('')
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function reset() {
    setRoomId('')
    setItemsText('')
    setNote('')
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!roomId) {
      toast.error('Select room')
      return
    }

    const items = itemsText
      .split(/\n|,/)
      .map(s => s.trim())
      .filter(Boolean)

    if (items.length === 0) {
      toast.error('Add at least one item')
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch('http://localhost:5000/api/foodorders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId: Number(roomId),
          items,
          note,
          requestedBy: userName,
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to place order')
      }

      // update frontend state so admin dashboard sees the new order immediately
      addFoodOrder({ roomId: Number(roomId), items, note, requestedBy: userName })

      toast.success('Order placed successfully')
      reset()
    } catch (err) {
      toast.error('Server error. Please try again.')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4"
      
    >
      <div className="ud-card w-full max-w-2xl">
        <h3 className="ud-title">Order Room Service</h3>

        <form className="ud-form" onSubmit={handleSubmit}>
          <label>
            Room
            <select
              className="ud-select"
              value={roomId}
              onChange={e => setRoomId(e.target.value)}
            >
              <option value="">Select room</option>
              {rooms.map(r => (
                <option key={r.id} value={r.id}>
                  {r.number} — {r.type}
                </option>
              ))}
            </select>
          </label>

          <label>
            Items (one per line or comma separated)
            <textarea
              className="ud-textarea"
              value={itemsText}
              onChange={e => setItemsText(e.target.value)}
              placeholder="e.g. Club sandwich, Orange juice"
            />
          </label>

          <label>
            Special instructions
            <textarea
              className="ud-textarea"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="No onions, extra napkins..."
            />
          </label>

          <div className="ud-actions">
            <button className="ud-btn" type="submit" disabled={submitting}>
              {submitting ? 'Placing...' : 'Place Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
