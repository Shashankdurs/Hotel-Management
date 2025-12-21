import React from 'react'

export function Skeleton({ className = 'h-6 w-full bg-slate-200 rounded' }) {
  return <div className={className + ' animate-pulse'} />
}
