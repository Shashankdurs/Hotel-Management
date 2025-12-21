import React from 'react'
import { motion } from 'framer-motion'

export default function RoomCard({ room }) {
  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-white dark:bg-slate-800 border rounded-md border-slate-200 dark:border-slate-700">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-sm text-slate-500">Room #{room.number}</div>
          <div className="text-lg font-semibold">{room.type}</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-500">₹{room.price}/night</div>
          <div className={`mt-2 inline-flex px-2 py-1 text-xs rounded-full ₹{room.status === 'Available' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>{room.status}</div>
        </div>
      </div>
    </motion.div>
  )
}
