import React from 'react'
import { motion } from 'framer-motion'

export default function BookingCard({ b, customer, room }) {
  const guestName = customer?.name || b.guestName || 'Guest'
  const roomNumber = room?.number ?? b.roomNumber ?? b.roomId

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-2xl bg-slate-900/80 p-4 shadow-inner shadow-slate-950/60 ring-1 ring-slate-800"
    >
      <div className="flex justify-between items-start gap-4">

        {/* LEFT */}
        <div>
          <div className="text-sm text-slate-400">
            {guestName}
          </div>

          <div className="text-lg font-semibold text-slate-100">
            Room #{roomNumber}
          </div>
        </div>

        {/* RIGHT */}
        <div className="text-right">
          <div className="text-xs text-slate-400">
            {b.checkIn} → {b.checkOut}
          </div>

          {b.status && (
            <span
              className={`mt-2 inline-flex px-3 py-1 text-xs font-semibold rounded-full
                ${
                  b.status === 'Checked-in'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : b.status === 'Checked-out'
                    ? 'bg-slate-500/20 text-slate-300'
                    : 'bg-amber-500/20 text-amber-300'
                }`}
            >
              {b.status}
            </span>
          )}
        </div>

      </div>
    </motion.div>
  )
}
