// src/components/UserHome.jsx
import React, { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'

export default function UserHome({ onGoRaise, onGoOrder, onGoBook }) {
  const { user } = useContext(AuthContext)
  const userName = user?.name || user?.email || 'Guest'

  return (
    <div className="flex flex-col gap-6">

      {/* HERO SECTION */}
      <section
        className="
          relative rounded-2xl overflow-hidden shadow-xl
          min-h-[260px] md:min-h-[360px]
          bg-slate-900 text-white
          flex flex-col
        "
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.45), rgba(0,0,0,0.25)),
            url('https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?fm=jpg&q=60&w=3000')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* TOP BAR */}
        <header className="flex items-center justify-between px-6 md:px-10 pt-4 text-xs md:text-sm tracking-[0.2em] uppercase">
          <div className="flex items-center gap-2 font-semibold">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQy04rhtA8pnw27tSSrTBoLqxbEEn3LZtafbQ&s"
              alt="Hotel Logo"
              className="w-8 h-8 object-cover rounded-full shadow-md"
            />
            <span>Hotel</span>
          </div>
        </header>

        {/* HERO CONTENT */}
        <div className="px-6 md:px-10 pb-6 md:pb-10 h-full flex flex-col justify-center">
          <h1 className="text-2xl md:text-4xl font-bold tracking-[0.35em] uppercase">
            Hotel
          </h1>

          <p className="mt-2 text-xs md:text-sm tracking-[0.3em] uppercase text-sky-100/90">
            Your unforgettable getaway
          </p>

          <p className="mt-4 max-w-xl text-sm md:text-base text-sky-50/95">
            Welcome, <span className="font-semibold">{userName}</span>.  
            Use this portal to book rooms, report problems, give food feedback, or order food.
          </p>
        </div>
      </section>

      {/* FEATURE CARDS */}
      <section className="bg-slate-50 rounded-2xl shadow-md p-5 md:p-6">
        <h2 className="text-lg md:text-xl font-semibold text-slate-900 mb-1">
          Manage your stay
        </h2>
        <p className="text-xs md:text-sm text-slate-500 mb-4">
          Everything you need in one place.
        </p>

        <div className="grid gap-4 md:gap-6 md:grid-cols-3">

          {/* BOOK ROOM */}
          <div className="rounded-xl bg-[#E6F1F2] border border-slate-200 shadow-sm p-4 flex flex-col">
            <img
              src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80"
              alt="Book Room"
              className="w-full h-32 object-cover rounded-md mb-3"
            />
            <p className="text-xs md:text-sm text-slate-600 flex-1">
              Choose your room, select dates, and confirm your stay in a few steps.
            </p>
            <button
              onClick={onGoBook}
              className="mt-3 px-4 py-1.5 rounded-full bg-sky-500 hover:bg-sky-600 text-white text-xs font-medium transition"
            >
              Go to Room Booking
            </button>
          </div>

          {/* RAISE PROBLEM */}
          <div className="rounded-xl bg-[#E6F1F2] border border-slate-200 shadow-sm p-4 flex flex-col">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80"
              alt="Raise Problem"
              className="w-full h-32 object-cover rounded-md mb-3"
            />
            <p className="text-xs md:text-sm text-slate-600 flex-1">
              Report AC, plumbing, cleanliness, or other room-related issues.
            </p>
            <button
              onClick={onGoRaise}
              className="mt-3 px-4 py-1.5 rounded-full bg-sky-600 hover:bg-sky-700 text-white text-xs font-medium transition"
            >
              Go to Raise Problem
            </button>
          </div>

          {/* ORDER FOOD */}
          <div className="rounded-xl bg-[#E6F1F2] border border-slate-200 shadow-sm p-4 flex flex-col">
            <img
              src="https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=900&q=80"
              alt="Order Food"
              className="w-full h-32 object-cover rounded-md mb-3"
            />
            <p className="text-xs md:text-sm text-slate-600 flex-1">
              Order meals, snacks, drinks, and enjoy room service.
            </p>
            <button
              onClick={onGoOrder}
              className="mt-3 px-4 py-1.5 rounded-full bg-sky-600 hover:bg-sky-700 text-white text-xs font-medium transition"
            >
              Go to Order Food
            </button>
          </div>

        </div>
      </section>

      

    </div>
  )
}
