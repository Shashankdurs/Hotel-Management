import React, { useContext } from 'react'
import { ThemeContext } from '../contexts/ThemeContext'
import { AuthContext } from '../contexts/AuthContext'
import { SunIcon, MoonIcon, BellIcon } from '@heroicons/react/24/outline'

export default function Topbar() {
  const { dark, setDark } = useContext(ThemeContext)
  const { user, logout } = useContext(AuthContext)

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-transparent border-b border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-4">
        <button onClick={() => setDark(!dark)} className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700">
          {dark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
        </button>
        <h2 className="text-lg font-semibold">Welcome{user ? `, ${user.name}` : ''}</h2>
      </div>
      <div className="flex items-center gap-4">
        {/* <button className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"><BellIcon className="h-5 w-5" /></button> */}
        <div className="flex items-center gap-2">
          <div className="text-sm">{user?.email}</div>
          <button onClick={logout} className="text-sm px-3 py-1 bg-red-500 text-white rounded-md">Logout</button>
        </div>
      </div>
    </header>
  )
}
