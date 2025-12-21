import React, { createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  // 🔹 Load user from localStorage on refresh
  useEffect(() => {
    const rawUser = localStorage.getItem('hms_user')
    const token = localStorage.getItem('token')

    if (rawUser && token) {
      setUser(JSON.parse(rawUser))
    }
  }, [])

  // 🔹 Called AFTER successful backend login
  function login(userData) {
    setUser(userData)

    // navigate based on role
    if (userData.role === 'admin') {
      navigate('/dashboard')
    } else {
      navigate('/user')
    }
  }

  // 🔹 Logout
  function logout() {
    setUser(null)
    localStorage.removeItem('hms_user')
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
