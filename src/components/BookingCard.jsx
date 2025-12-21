import React from 'react'
import { motion } from 'framer-motion'

export default function BookingCard({ b, customer, room }) {
  return (
    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-white dark:bg-slate-800 border rounded-md border-slate-200 dark:border-slate-700">
      <div className="flex justify-between">
        <div>
          <div className="text-sm text-slate-500">{customer?.name || 'Unknown'}</div>
          <div className="font-semibold">Room #{room?.number || b.roomId}</div>
        </div>
        <div className="text-right">
          <div className="text-sm">{b.checkIn} → {b.checkOut}</div>
          <div className={`mt-2 inline-flex px-2 py-1 text-xs rounded-full ${b.status === 'Checked-in' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{b.status}</div>
        </div>
      </div>
    </motion.div>
  )
}
