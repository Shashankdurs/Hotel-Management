// src/contexts/DataContext.jsx
import React, { createContext, useEffect, useState } from 'react'
import roomsData from '../data/rooms.json'
import bookingsData from '../data/bookings.json'
import customersData from '../data/customers.json'

export const DataContext = createContext()

// ====== OPTIONAL: seed rooms if rooms.json is empty ======
const initialRooms = [
  // SINGLE ROOMS (6)
  { id: 101, number: 'S-101', type: 'Single Room', price: 1500, status: 'Available',
    description: 'Cozy single with comfortable bed and workspace.',
    image: 'https://lh6.googleusercontent.com/proxy/Vxm2z2GCnaK5rt24N97lDeZIcskyC6aubvEatTfXxmj4wESfbUhW3sgbAx59Q9dGXqWTogHi2FwLLdDo7cGcYAWFwbZAlDf54j6vZ3EnelK7uuckDt28uAs' },
  { id: 102, number: 'S-102', type: 'Single Room', price: 1500, status: 'Available',
    description: 'Cozy single with comfortable bed and workspace.',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80' },
  { id: 103, number: 'S-103', type: 'Single Room', price: 1400, status: 'Available',
    description: 'Budget single with essential amenities.',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80' },
  { id: 104, number: 'S-104', type: 'Single Room', price: 1600, status: 'Available',
    description: 'Single room with city view.',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80' },
  { id: 105, number: 'S-105', type: 'Single Room', price: 1550, status: 'Available',
    description: 'Comfortable single, quiet floor.',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80' },
  { id: 106, number: 'S-106', type: 'Single Room', price: 1500, status: 'Available',
    description: 'Single room with modern bathroom.',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80' },

  // DOUBLE ROOMS (6)
  { id: 201, number: 'D-201', type: 'Double Room', price: 2500, status: 'Available',
    description: 'Spacious double with queen bed and seating area.',
    image: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=900&q=80' },
  { id: 202, number: 'D-202', type: 'Double Room', price: 2600, status: 'Available',
    description: 'Deluxe double with balcony.',
    image: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=900&q=80' },
  { id: 203, number: 'D-203', type: 'Double Room', price: 2450, status: 'Available',
    description: 'Double with extra seating and workspace.',
    image: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=900&q=80' },
  { id: 204, number: 'D-204', type: 'Double Room', price: 2550, status: 'Available',
    description: 'Double with city view and minibar.',
    image: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=900&q=80' },
  { id: 205, number: 'D-205', type: 'Double Room', price: 2700, status: 'Available',
    description: 'Premium double with king bed.',
    image: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=900&q=80' },
  { id: 206, number: 'D-206', type: 'Double Room', price: 2400, status: 'Available',
    description: 'Cozy double, high floor.',
    image: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=900&q=80' },

  // LUXURY ROOMS (6)
  { id: 301, number: 'L-301', type: 'Luxury Room', price: 6500, status: 'Available',
    description: 'Large suite with living room and premium amenities.',
    image: 'https://images.unsplash.com/photo-1542314831-1ff5b89a6b5e?auto=format&fit=crop&w=900&q=80' },
  { id: 302, number: 'L-302', type: 'Luxury Room', price: 7000, status: 'Available',
    description: 'Corner suite with panoramic view.',
    image: 'https://images.unsplash.com/photo-1542314831-1ff5b89a6b5e?auto=format&fit=crop&w=900&q=80' },
  { id: 303, number: 'L-303', type: 'Luxury Room', price: 6800, status: 'Available',
    description: 'Luxury room with jacuzzi and balcony.',
    image: 'https://images.unsplash.com/photo-1542314831-1ff5b89a6b5e?auto=format&fit=crop&w=900&q=80' },
  { id: 304, number: 'L-304', type: 'Luxury Room', price: 7200, status: 'Available',
    description: 'Executive suite with workspace.',
    image: 'https://images.unsplash.com/photo-1542314831-1ff5b89a6b5e?auto=format&fit=crop&w=900&q=80' },
  { id: 305, number: 'L-305', type: 'Luxury Room', price: 6600, status: 'Available',
    description: 'Luxury with city skyline view.',
    image: 'https://images.unsplash.com/photo-1542314831-1ff5b89a6b5e?auto=format&fit=crop&w=900&q=80' },
  { id: 306, number: 'L-306', type: 'Luxury Room', price: 6900, status: 'Available',
    description: 'Signature suite with premium service.',
    image: 'https://images.unsplash.com/photo-1542314831-1ff5b89a6b5e?auto=format&fit=crop&w=900&q=80' },
]

export function DataProvider({ children }) {
  const [rooms, setRooms] = useState([])
  const [bookings, setBookings] = useState([])
  const [customers, setCustomers] = useState([])

  // housekeeping
  const [tasks, setTasks] = useState([])
  const [maintenanceRequests, setMaintenanceRequests] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('maintenanceRequests') || '[]')
    } catch (e) {
      return []
    }
  })

  // 🆕 user-raised issues (support/problems)
  const [issues, setIssues] = useState([])

  // 🆕 food orders for kitchen dashboard
  const [foodOrders, setFoodOrders] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('foodOrders') || '[]')
    } catch (e) {
      return []
    }
  })

  const today = new Date().toISOString().slice(0, 10)

  // Load initial data
  useEffect(() => {
    // if rooms.json has entries use it, otherwise seed with initialRooms
    setRooms(Array.isArray(roomsData) && roomsData.length ? roomsData : initialRooms)

    // load bookings: prefer backend data, fall back to localStorage/mock data
    async function loadBookingsFromServer() {
      try {
        const res = await fetch('http://localhost:5000/api/bookings')
        if (res.ok) {
          const data = await res.json()
          const norm = Array.isArray(data)
            ? data.map(b => ({ id: b.id || b._id || String(Date.now() + Math.random()), ...b }))
            : []
          setBookings(norm)
          try {
            localStorage.setItem('bookings', JSON.stringify(norm))
            const ev = new CustomEvent('bookings-updated', { detail: { bookings: norm } })
            window.dispatchEvent(ev)
          } catch (e) {}
          return
        }
      } catch (e) {
        // ignore and fall back to localStorage
      }

      try {
        const stored = JSON.parse(localStorage.getItem('bookings') || 'null')
        if (stored && Array.isArray(stored)) {
          setBookings(stored)
        } else {
          setBookings(bookingsData)
        }
      } catch (e) {
        setBookings(bookingsData)
      }
    }

    loadBookingsFromServer()

    try {
      const storedCustomers = JSON.parse(localStorage.getItem('customers') || 'null')
      if (storedCustomers && Array.isArray(storedCustomers)) setCustomers(storedCustomers)
      else setCustomers(customersData)
    } catch (e) {
      setCustomers(customersData)
    }

    // create cleaning tasks for initial rooms (based on final rooms we will set)
    const baseRooms = Array.isArray(roomsData) && roomsData.length ? roomsData : initialRooms
    const initialTasks = baseRooms.map(room => ({
      roomId: room.id,
      roomNumber: room.number,
      type: room.type,
      status: 'Pending',
      staffId: '',
      scheduledFor: today,
    }))

    setTasks(initialTasks)
  }, [])

  // ADD ROOM
  function addRoom(room) {
    const newRoom = { id: Date.now(), ...room }
    setRooms(prev => [...prev, newRoom])

    // also create a cleaning task
    setTasks(prev => [
      ...prev,
      {
        roomId: newRoom.id,
        roomNumber: newRoom.number,
        type: newRoom.type,
        status: 'Pending',
        staffId: '',
        scheduledFor: today,
      },
    ])
  }

  // DELETE ROOM
  function deleteRoom(id) {
    setRooms(prev => prev.filter(r => r.id !== id))
    // remove housekeeping task for deleted room
    setTasks(prev => prev.filter(t => t.roomId !== id))
  }

  // ADD CUSTOMER
  function addCustomer(customer) {
    setCustomers(prev => [...prev, { id: Date.now(), ...customer }])
  }

  // ADD BOOKING — now also mark room status as 'Booked'
  function addBooking(booking) {
    const newBooking = { id: Date.now(), ...booking }
    setBookings(prev => [...prev, newBooking])

    // mark booked room status so it won't be double booked (shows in UI)
    if (newBooking.roomId) {
      setRooms(prev => prev.map(r => (r.id === Number(newBooking.roomId) ? { ...r, status: 'Booked' } : r)))
    }

    // If booking contains guest info, create or update customer record
    try {
      const guestEmail = (newBooking.guestEmail || '').toLowerCase()
      const guestPhone = newBooking.guestPhone || ''
      const guestName = newBooking.guestName || ''

      if (guestEmail || guestPhone || guestName) {
        setCustomers(prev => {
          const idx = prev.findIndex(c => (guestEmail && (c.email || '').toLowerCase() === guestEmail) || (guestPhone && c.phone === guestPhone))
          if (idx !== -1) {
            const updated = [...prev]
            updated[idx] = {
              ...updated[idx],
              name: guestName || updated[idx].name,
              email: newBooking.guestEmail || updated[idx].email,
              phone: guestPhone || updated[idx].phone,
            }
            return updated
          }
          return [...prev, { id: Date.now(), name: guestName || 'Guest', email: newBooking.guestEmail || '', phone: guestPhone || '' }]
        })
      }
    } catch (e) {
      // ignore customer sync failures
      console.error('Failed to sync customer from booking', e)
    }

    return newBooking
  }

  // 🔁 UPDATE BOOKING STATUS (Booked / Checked-in / Checked-out / Cancelled)
  function updateBookingStatus(id, status) {
    setBookings(prev =>
      prev.map(b => (b.id === id ? { ...b, status } : b))
    )
  }

  // 🔁 UPDATE ROOM STATUS (Available / Occupied / Pending / etc.)
  function updateRoomStatus(roomId, status) {
    setRooms(prev =>
      prev.map(r => (r.id === roomId ? { ...r, status } : r))
    )
  }

  // UPDATE HOUSEKEEPING TASK
  function updateTask(roomId, updates) {
    setTasks(prev =>
      prev.map(t => (t.roomId === roomId ? { ...t, ...updates } : t))
    )
  }

  // ADD MAINTENANCE REQUEST
  function addMaintenanceRequest(request) {
    setMaintenanceRequests(prev => [
      {
        id: Date.now(),
        ...request,
        status: 'Open',
        createdAt: new Date().toLocaleString(),
      },
      ...prev,
    ])
  }

  function deleteMaintenanceRequest(id) {
    setMaintenanceRequests(prev => prev.filter(r => r.id !== id))
  }

  // 🆕 ADD ISSUE (raised by user)
  // issue = { title, message, userEmail, userName }
  function addIssue(issue) {
    setIssues(prev => [
      {
        id: Date.now(),
        ...issue,
        status: 'Open',
        createdAt: new Date().toLocaleString(),
      },
      ...prev,
    ])
  }

  // 🆕 UPDATE ISSUE STATUS (Open / In Progress / Resolved)
  function updateIssueStatus(id, status) {
    setIssues(prev =>
      prev.map(i => (i.id === id ? { ...i, status } : i))
    )
  }

  // 🆕 ADD FOOD ORDER (for kitchen)
  // order = { roomId, items: [], note }
  function addFoodOrder(order) {
    const newOrder = {
      id: Date.now(),
      ...order,
      status: 'New', // New → Cooking → Ready → Delivered
      createdAt: Date.now(),
    }
    setFoodOrders(prev => [newOrder, ...prev])
    return newOrder
  }

  // 🆕 UPDATE FOOD ORDER STATUS
  function updateFoodOrderStatus(id, status) {
    setFoodOrders(prev =>
      prev.map(o => (o.id === id ? { ...o, status } : o))
    )
  }

  // persist food orders to localStorage and broadcast events
  useEffect(() => {
    try {
      const raw = JSON.stringify(foodOrders)
      localStorage.setItem('foodOrders', raw)
      try {
        const ev = new CustomEvent('foodOrders-updated', { detail: { foodOrders } })
        window.dispatchEvent(ev)
      } catch (e) {}
    } catch (e) {}
  }, [foodOrders])

  // persist maintenanceRequests to localStorage and broadcast events
  useEffect(() => {
    try {
      const raw = JSON.stringify(maintenanceRequests)
      localStorage.setItem('maintenanceRequests', raw)
      try {
        const ev = new CustomEvent('maintenanceRequests-updated', { detail: { maintenanceRequests } })
        window.dispatchEvent(ev)
      } catch (e) {}
    } catch (e) {}
  }, [maintenanceRequests])

  // persist bookings to localStorage and broadcast events
  useEffect(() => {
    try {
      const raw = JSON.stringify(bookings)
      localStorage.setItem('bookings', raw)
      try {
        const ev = new CustomEvent('bookings-updated', { detail: { bookings } })
        window.dispatchEvent(ev)
      } catch (e) {}
    } catch (e) {}
  }, [bookings])

  // persist customers to localStorage and broadcast events
  useEffect(() => {
    try {
      const raw = JSON.stringify(customers)
      localStorage.setItem('customers', raw)
      try {
        const ev = new CustomEvent('customers-updated', { detail: { customers } })
        window.dispatchEvent(ev)
      } catch (e) {}
    } catch (e) {}
  }, [customers])

  // listen for storage updates from other tabs
  useEffect(() => {
    function onStorage(e) {
      if (e.key === 'foodOrders') {
        try {
          setFoodOrders(JSON.parse(e.newValue || '[]'))
        } catch (err) {
          setFoodOrders([])
        }
      }
      if (e.key === 'bookings') {
        try {
          setBookings(JSON.parse(e.newValue || '[]'))
        } catch (err) {
          setBookings([])
        }
      }
      if (e.key === 'rooms') {
        try {
          setRooms(JSON.parse(e.newValue || '[]'))
        } catch (err) {
          // ignore
        }
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  // Periodically refresh bookings from server so admin views get updates
  useEffect(() => {
    let cancelled = false
    async function poll() {
      try {
        const res = await fetch('http://localhost:5000/api/bookings')
        if (!res.ok) return
        const data = await res.json()
        const norm = Array.isArray(data)
          ? data.map(b => ({ id: b.id || b._id || String(Date.now() + Math.random()), ...b }))
          : []
        if (!cancelled) {
          // only update if different length (simple diff) to avoid excessive renders
          try {
            const current = JSON.parse(localStorage.getItem('bookings') || '[]')
            if (!Array.isArray(current) || current.length !== norm.length) {
              setBookings(norm)
              localStorage.setItem('bookings', JSON.stringify(norm))
              try {
                const ev = new CustomEvent('bookings-updated', { detail: { bookings: norm } })
                window.dispatchEvent(ev)
              } catch (e) {}
            }
          } catch (e) {
            setBookings(norm)
            localStorage.setItem('bookings', JSON.stringify(norm))
          }
        }
      } catch (e) {
        // ignore polling errors
      }
    }

    const id = setInterval(poll, 8000)
    // run immediately once
    poll()
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [])

  return (
    <DataContext.Provider
      value={{
        rooms,
        bookings,
        customers,
        tasks,
        maintenanceRequests,
        issues,
        foodOrders,

        addRoom,
        deleteRoom,
        addCustomer,
        addBooking,

        updateBookingStatus,
        updateRoomStatus,

        updateTask,
        addMaintenanceRequest,
        deleteMaintenanceRequest,

        addIssue,
        updateIssueStatus,

        addFoodOrder,
        updateFoodOrderStatus,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}
