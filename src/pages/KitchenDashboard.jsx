import React, { useContext } from 'react'
import { DataContext } from '../contexts/DataContext'

export default function KitchenDashboard() {
  const { foodOrders, updateFoodOrderStatus, rooms } = useContext(DataContext)

  // Only show active orders
  const activeOrders = foodOrders.filter(
    o => o.status !== 'Delivered'
  )

  function getRoomNumber(roomId) {
    const room = rooms.find(r => r.id === roomId)
    return room ? room.number : 'N/A'
  }

  function timeAgo(timestamp) {
    const diff = Math.floor((Date.now() - timestamp) / 60000)
    if (diff < 1) return 'Just now'
    return `${diff} min ago`
  }

  return (
    <div className="space-y-6 rounded-3xl bg-gradient-to-br 
    from-slate-950 via-slate-900 to-slate-950 p-6 text-slate-100 
    shadow-2xl ring-1 ring-slate-800">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Kitchen Dashboard
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          View active room service orders and update their status.
        </p>

        {/* sample add removed */}
      </div>

      {/* Order List */}
      <div className="space-y-4">
        {activeOrders.length === 0 && (
          <p className="text-sm text-slate-500 text-center">
            No active food orders.
          </p>
        )}

        {activeOrders.map(order => (
          <div key={order.id}
            className="rounded-2xl bg-slate-900/80 p-4 shadow-inner 
            shadow-slate-950/60 ring-1 ring-slate-800">

            {/* Header Row */}
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <div className="text-sm text-slate-400">
                  Order #{order.id}
                </div>
                <div className="text-lg font-semibold">
                  Room {getRoomNumber(order.roomId)}
                </div>
              </div>

              <span className={
                'rounded-full px-3 py-1 text-xs font-medium ' +
                (order.status === 'New'
                  ? 'bg-amber-500/20 text-amber-300'
                  : order.status === 'Cooking'
                  ? 'bg-sky-500/20 text-sky-300'
                  : 'bg-emerald-500/20 text-emerald-300')
              }>
                {order.status}
              </span>
            </div>

            {/* Items */}
            <div className="mt-4">
              <h3 className="text-sm text-slate-400 mb-1">Items:</h3>
              <ul className="text-sm list-disc ml-6 text-slate-200">
                {order.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Notes */}
            {order.note && (
              <div className="mt-3">
                <h3 className="text-sm text-slate-400 mb-1">Special Instructions:</h3>
                <div className="text-sm text-slate-300 italic">
                  {order.note}
                </div>
              </div>
            )}

            {/* Time */}
            <div className="mt-3 text-xs text-slate-500">
              Ordered: {timeAgo(order.createdAt)}
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex gap-2">
              {order.status === 'New' && (
                <button
                  onClick={() => updateFoodOrderStatus(order.id, 'Cooking')}
                  className="rounded-lg bg-amber-500 px-4 py-1 text-xs font-semibold 
                  text-slate-950 hover:bg-amber-400 transition"
                >
                  Start Cooking
                </button>
              )}

              {order.status === 'Cooking' && (
                <button
                  onClick={() => updateFoodOrderStatus(order.id, 'Ready')}
                  className="rounded-lg bg-sky-500 px-4 py-1 text-xs font-semibold 
                  text-slate-950 hover:bg-sky-400 transition"
                >
                  Ready to Serve
                </button>
              )}

              {order.status === 'Ready' && (
                <button
                  onClick={() => updateFoodOrderStatus(order.id, 'Delivered')}
                  className="rounded-lg bg-emerald-500 px-4 py-1 text-xs font-semibold 
                  text-slate-950 hover:bg-emerald-400 transition"
                >
                  Delivered
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
