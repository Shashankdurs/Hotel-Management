// import React, { useContext } from 'react'
// import { ThemeContext } from '../contexts/ThemeContext'
// import { AuthContext } from '../contexts/AuthContext'
// import { SunIcon, MoonIcon, BellIcon } from '@heroicons/react/24/outline'

// export default function Topbar() {
//   const { dark, setDark } = useContext(ThemeContext)
//   const { user, logout } = useContext(AuthContext)

//   return (
//     <header className="h-16 flex items-center justify-between px-6 bg-transparent border-b border-slate-200 dark:border-slate-700">
//       <div className="flex items-center gap-4">
//         <button onClick={() => setDark(!dark)} className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700">
//           {dark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
//         </button>
//         <h2 className="text-lg font-semibold">Welcome{user ? `, ${user.name}` : ''}</h2>
//       </div>
//       <div className="flex items-center gap-4">
//         {/* <button className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"><BellIcon className="h-5 w-5" /></button> */}
//         <div className="flex items-center gap-2">
//           <div className="text-sm">{user?.email}</div>
//           <button onClick={logout} className="text-sm px-3 py-1 bg-red-500 text-white rounded-md">Logout</button>
//         </div>
//       </div>
//     </header>
//   )
// }
import React, { useContext } from 'react'
import { ThemeContext } from '../contexts/ThemeContext'
import { AuthContext } from '../contexts/AuthContext'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'

export default function Topbar() {
  const { dark, setDark } = useContext(ThemeContext)
  const { user, logout } = useContext(AuthContext)

  return (
    <header className="sticky top-0 z-10 h-16 flex items-center justify-between px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      
      {/* LEFT SIDE */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setDark(!dark)}
          className="p-2 rounded-lg transition hover:bg-sky-100 dark:hover:bg-sky-900/40"
          aria-label="Toggle theme"
        >
          {dark ? (
            <SunIcon className="h-5 w-5 text-yellow-400" />
          ) : (
            <MoonIcon className="h-5 w-5 text-sky-600" />
          )}
        </button>

        <div>
          <h2 className="text-sm text-slate-500 dark:text-slate-400">
            Welcome
          </h2>
          <div className="text-base font-semibold text-slate-800 dark:text-slate-100">
            {user?.name || 'User'}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4">
        <div className="text-sm text-slate-500 dark:text-slate-400 hidden sm:block">
          {user?.email}
        </div>

        <button
          onClick={logout}
          className="rounded-lg bg-red-500 px-4 py-1.5 text-sm font-medium text-white shadow hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </header>
  )
}
