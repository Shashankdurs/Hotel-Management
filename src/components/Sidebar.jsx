import React, { useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { HomeIcon, KeyIcon, CalendarIcon, UsersIcon, WrenchIcon, FireIcon } from '@heroicons/react/24/outline'
import { AuthContext } from '../contexts/AuthContext'

const items = [
  { to: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  { to: '/rooms', label: 'Rooms', icon: KeyIcon },
  { to: '/bookings', label: 'Bookings', icon: CalendarIcon },
  { to: '/customers', label: 'Customers', icon: UsersIcon }
]

const adminItems = [
  { to: '/housekeeping', label: 'Housekeeping', icon: WrenchIcon },
  { to: '/kitchen', label: 'Kitchen', icon: FireIcon }
]

export default function Sidebar() {
  const loc = useLocation()
  const { user } = useContext(AuthContext)
  return (
    <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 h-screen p-4 fixed">
      <div className="mb-6">
        <h1 className="text-xl font-semibold">Hotel Manager</h1>
        <p className="text-sm text-slate-500 dark:text-slate-300">Admin Panel</p>
      </div>
      <nav className="space-y-2">
        {items.map(i => {
          const Icon = i.icon
          const active = loc.pathname.startsWith(i.to)
          return (
            <Link key={i.to} to={i.to} className={`flex items-center gap-3 p-2 rounded-md ${active ? 'bg-sky-100 dark:bg-sky-900/30' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
              <Icon className="h-5 w-5 text-sky-600" />
              <span className="font-medium">{i.label}</span>
            </Link>
          )
        })}

        {user?.role === 'admin' && adminItems.map(i => {
          const Icon = i.icon
          const active = loc.pathname.startsWith(i.to)
          return (
            <Link key={i.to} to={i.to} className={`flex items-center gap-3 p-2 rounded-md ${active ? 'bg-sky-100 dark:bg-sky-900/30' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
              <Icon className="h-5 w-5 text-sky-600" />
              <span className="font-medium">{i.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
