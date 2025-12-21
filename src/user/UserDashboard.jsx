// src/components/UserDashboard.jsx
import React, { useState, useContext } from 'react'
import ProblemsProvider from './ProblemsContext'
import RaiseProblem from './RaiseProblem'
import MyProblems from './MyProblems'
import OrderFood from './OrderFood'
import UserHome from './UserHome'
import RoomBooking from './RoomBooking'

import { AuthContext } from '../contexts/AuthContext'
import { ThemeContext } from '../contexts/ThemeContext'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import './../styles/UserDashboard.css'

export default function UserDashboard({ onLogout }) {
  // tabs: home | book | raise | order | my
  const [tab, setTab] = useState('home')

  const { user, logout } = useContext(AuthContext)
  const { dark, setDark } = useContext(ThemeContext)

  const userName = user?.name || user?.email || 'Guest'

  const handleLogout = () => {
    if (onLogout) onLogout()
    else logout()
  }

  return (
    <ProblemsProvider>
      <div className="ud-wrapper">

        {/* ================= TOP BAR ================= */}
        <div className="ud-topbar">
          <div className="ud-welcome">Welcome, {userName}</div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setDark(!dark)}
              className="ud-btn-muted"
              aria-label="Toggle theme"
            >
              {dark ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button>

            <button className="ud-btn-muted" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {/* ================= NAV TABS ================= */}
        <div className="ud-nav">
          <button
            className={`ud-tab ${tab === 'home' ? 'active' : ''}`}
            onClick={() => setTab('home')}
          >
            Home
          </button>

          <button
            className={`ud-tab ${tab === 'book' ? 'active' : ''}`}
            onClick={() => setTab('book')}
          >
            Book Room
          </button>

          <button
            className={`ud-tab ${tab === 'raise' ? 'active' : ''}`}
            onClick={() => setTab('raise')}
          >
            Raise Problem
          </button>

          <button
            className={`ud-tab ${tab === 'order' ? 'active' : ''}`}
            onClick={() => setTab('order')}
          >
            Order Food
          </button>

          <button
            className={`ud-tab ${tab === 'my' ? 'active' : ''}`}
            onClick={() => setTab('my')}
          >
            My Problems
          </button>
        </div>

        {/* ================= CONTENT ================= */}
        <div
          className={`ud-content ${
            tab === 'home' || tab === 'book' ? 'userhome-wide' : ''
          }`}
        >
          {tab === 'home' && (
            <UserHome
              onGoRaise={() => setTab('raise')}
              onGoOrder={() => setTab('order')}
              onGoBook={() => setTab('book')}
            />
          )}

          {tab === 'book' && <RoomBooking />}

          {tab === 'raise' && <RaiseProblem />}

          {tab === 'order' && <OrderFood />}

          {tab === 'my' && <MyProblems />}
        </div>
        {/* FOOTER */}
      <footer className="mt-8 rounded-2xl overflow-hidden shadow-lg">
        <div className="bg-[#0F3D3E] text-slate-100 px-6 md:px-10 py-8">
          <div className="grid gap-6 md:grid-cols-3">

            <div>
              <h3 className="text-sm font-semibold tracking-widest uppercase mb-2">
                Hotel
              </h3>
              <p className="text-xs text-slate-300">
                Comfort, service, and luxury — designed for your perfect stay.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase mb-3">Quick Links</h4>
              <ul className="space-y-2 text-xs text-slate-300">
                <li>
                  <button type="button" className="hover:underline" onClick={() => setTab('home')}>
                    Home
                  </button>
                </li>
                <li>
                  <button type="button" className="hover:underline" onClick={() => setTab('book')}>
                    Book Room
                  </button>
                </li>
                <li>
                  <button type="button" className="hover:underline" onClick={() => setTab('raise')}>
                    Raise Problem
                  </button>
                </li>
                <li>
                  <button type="button" className="hover:underline" onClick={() => setTab('order')}>
                    Order Food
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase mb-3">Support</h4>
              <ul className="space-y-2 text-xs text-slate-300">
                <li>Help Center: Get help with room booking, food orders, and service requests.</li>
                <li>Privacy Policy: We protect your personal data and use it only to improve your stay.</li>
                <li>Terms & Conditions: Rules and guidelines for using Hotel Canvas services.</li>
                <li>Contact Us:987654321</li>
              </ul>
            </div>

          </div>
        </div>

        <div className="bg-[#2C666E] text-center py-3">
          <p className="text-[11px] text-slate-100">
            © {new Date().getFullYear()} Hotel. All rights reserved.
          </p>
        </div>
      </footer>

      </div>
    </ProblemsProvider>
  )
}
