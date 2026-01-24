import React from 'react'

export default function StatCard({ title, value, delta }) {
  return (
    // <div className="p-4 bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700">
      <div className="rounded-2xl bg-[#2C666E] text-white p-4 shadow-lg">

      <div className="text-sm text-slate-500">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
      {delta && <div className="text-sm text-slate-400">{delta}</div>}
    </div>
  )
}
