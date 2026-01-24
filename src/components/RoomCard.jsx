// import React from 'react'
// import { motion } from 'framer-motion'

// export default function RoomCard({ room }) {
//   return (
//     <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-white dark:bg-slate-800 border rounded-md border-slate-200 dark:border-slate-700">
//       <div className="flex justify-between items-start">
//         <div>
//           <div className="text-sm text-slate-500">Room #{room.number}</div>
//           <div className="text-sm text-slate-500">{room.type}</div>
//         </div>
//         <div className="text-right">
//           <div className="text-sm text-slate-500">₹{room.price}/night</div>
//           <div className={`mt-2 inline-flex px-2 py-1 text-xs rounded-full ₹{room.status === 'Available' ? 'text-sm text-slate-500' : 'text-sm text-slate-500'}`}>{room.status}</div>
//         </div>
//       </div>
//     </motion.div>
//   )
// }
import React from 'react'
import { motion } from 'framer-motion'

export default function RoomCard({ room }) {
  const statusStyles = {
    Available: 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/30',
    Occupied: 'bg-rose-500/20 text-rose-300 ring-1 ring-rose-500/30',
    Pending: 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/30',
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="
        rounded-xl
        bg-slate-900/70
        p-4
        ring-1 ring-slate-800
        shadow-inner shadow-slate-900/40
      "
    >
      <div className="flex justify-between items-start gap-4">
        {/* LEFT */}
        <div>
          <div className="text-xs text-slate-400">
            Room #{room.number}
          </div>
          <div className="mt-1 text-sm font-semibold text-slate-100">
            {room.type}
          </div>
        </div>

        {/* RIGHT */}
        <div className="text-right">
          <div className="text-sm font-semibold text-sky-400">
            ₹{room.price?.toLocaleString()}
            <span className="text-xs text-slate-400 font-normal"> / night</span>
          </div>

          <div
            className={`
              mt-2 inline-flex items-center px-2.5 py-1
              text-[11px] font-medium rounded-full
              ${statusStyles[room.status] || 'bg-slate-500/20 text-slate-300'}
            `}
          >
            {room.status}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
