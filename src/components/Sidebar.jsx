// import React, { useContext } from 'react'
// import { Link, useLocation } from 'react-router-dom'
// import { HomeIcon, KeyIcon, CalendarIcon, UsersIcon, WrenchIcon, FireIcon } from '@heroicons/react/24/outline'
// import { AuthContext } from '../contexts/AuthContext'

// const items = [
//   { to: '/dashboard', label: 'Dashboard', icon: HomeIcon },
//   { to: '/rooms', label: 'Rooms', icon: KeyIcon },
//   { to: '/bookings', label: 'Bookings', icon: CalendarIcon },
//   { to: '/customers', label: 'Customers', icon: UsersIcon }
// ]

// const adminItems = [
//   { to: '/housekeeping', label: 'Housekeeping', icon: WrenchIcon },
//   { to: '/kitchen', label: 'Kitchen', icon: FireIcon }
// ]

// export default function Sidebar() {
//   const loc = useLocation()
//   const { user } = useContext(AuthContext)
//   return (
//     <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 h-screen p-4 fixed">
//       <div className="mb-6">
//         <h1 className="text-xl font-semibold">Hotel Manager</h1>
//         <p className="text-sm text-slate-500 dark:text-slate-300">Admin Panel</p>
//       </div>
//       <nav className="space-y-2">
//         {items.map(i => {
//           const Icon = i.icon
//           const active = loc.pathname.startsWith(i.to)
//           return (
//             <Link key={i.to} to={i.to} className={`flex items-center gap-3 p-2 rounded-md ${active ? 'bg-sky-100 dark:bg-sky-900/30' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
//               <Icon className="h-5 w-5 text-sky-600" />
//               <span className="font-medium">{i.label}</span>
//             </Link>
//           )
//         })}

//         {user?.role === 'admin' && adminItems.map(i => {
//           const Icon = i.icon
//           const active = loc.pathname.startsWith(i.to)
//           return (
//             <Link key={i.to} to={i.to} className={`flex items-center gap-3 p-2 rounded-md ${active ? 'bg-sky-100 dark:bg-sky-900/30' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
//               <Icon className="h-5 w-5 text-sky-600" />
//               <span className="font-medium">{i.label}</span>
//             </Link>
//           )
//         })}
//       </nav>
//     </aside>
//   )
// }
import React, { useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  HomeIcon,
  KeyIcon,
  CalendarIcon,
  UsersIcon,
  WrenchIcon,
  FireIcon
} from '@heroicons/react/24/outline'
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

  function linkClass(active) {
    return `
      flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition
      ${
        active
          ? 'bg-sky-600 text-white shadow'
          : 'text-slate-600 dark:text-slate-300 hover:bg-sky-100 dark:hover:bg-sky-900/30'
      }
    `
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 px-4 py-6">
      
      {/* LOGO / TITLE */}
      <div className="mb-8 px-2">
        <h1 className="text-xl font-bold text-sky-600">
          Hotel Manager
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Admin Panel
        </p>
      </div>

      {/* NAVIGATION */}
      <nav className="space-y-1">
        {items.map(i => {
          const Icon = i.icon
          const active = loc.pathname.startsWith(i.to)
          return (
            <Link key={i.to} to={i.to} className={linkClass(active)}>
              <Icon className={`h-5 w-5 ${active ? 'text-white' : 'text-sky-600'}`} />
              {i.label}
            </Link>
          )
        })}

        {user?.role === 'admin' && (
          <>
            <div className="my-3 border-t border-slate-200 dark:border-slate-700" />

            {adminItems.map(i => {
              const Icon = i.icon
              const active = loc.pathname.startsWith(i.to)
              return (
                <Link key={i.to} to={i.to} className={linkClass(active)}>
                  <Icon className={`h-5 w-5 ${active ? 'text-white' : 'text-sky-600'}`} />
                  {i.label}
                </Link>
              )
            })}
          </>
        )}
      </nav>
    </aside>
  )
}
