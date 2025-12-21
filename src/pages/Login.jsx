import React, { useContext, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { ThemeContext } from '../contexts/ThemeContext'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'

const API_URL = 'http://localhost:5000/api/auth'

export default function Login() {
  const { login } = useContext(AuthContext)
  const { dark, setDark } = useContext(ThemeContext)

  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [role, setRole] = useState('user')
  const [mode, setMode] = useState('login')
  const [loading, setLoading] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (role === 'admin') {
        const res = await fetch(`${API_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })

        const data = await res.json()
        if (!res.ok) throw new Error(data.message)

        localStorage.setItem('token', data.token)
        localStorage.setItem('hms_user', JSON.stringify(data.user))
        login(data.user)
        return
      }

      if (mode === 'register') {
        if (!form.name || !form.email || !form.password) {
          throw new Error('All fields are required')
        }

        const res = await fetch(`${API_URL}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })

        const data = await res.json()
        if (!res.ok) throw new Error(data.message)

        alert('Account created successfully! Please login.')
        setMode('login')
        setForm({ name: '', email: '', password: '' })
        return
      }

      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      localStorage.setItem('token', data.token)
      localStorage.setItem('hms_user', JSON.stringify(data.user))
      login(data.user)
    } catch (err) {
      setError(err.message || 'Server error')
    } finally {
      setLoading(false)
    }
  }

  function fillAdmin() {
    setForm({ email: 'admin@admin.com', password: 'admin' })
  }

  return (
    <div
      className="min-h-screen w-full flex items-center px-10"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=80')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* GLASS CARD */}
      <div className="w-full max-w-md rounded-3xl bg-white/25 backdrop-blur-xl shadow-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <span className="rounded-full bg-black text-white px-4 py-1 text-xs">
            Hotel
          </span>

          <button
            onClick={() => setDark(!dark)}
            className="rounded-full bg-white/60 p-2"
          >
            {dark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          </button>
        </div>

        <h2 className="text-3xl font-serif mb-1">
          {role === 'admin'
            ? 'Admin Login'
            : mode === 'login'
            ? 'Welcome Back to Hotel'
            : 'Create Your Account'}
        </h2>

        <p className="text-sm text-slate-700 mb-6">
          Sign in to your account
        </p>

        {/* ROLE SWITCH */}
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => {
              setRole('user')
              setMode('login')
            }}
            className={`px-3 py-1 rounded text-sm ${
              role === 'user' ? 'bg-black text-white' : 'bg-white'
            }`}
          >
            User
          </button>

          <button
            onClick={() => setRole('admin')}
            className={`px-3 py-1 rounded text-sm ${
              role === 'admin' ? 'bg-black text-white' : 'bg-white'
            }`}
          >
            Admin
          </button>
        </div>

        {/* USER MODE */}
        {role === 'user' && (
          <div className="mb-4 flex gap-2 text-sm">
            <button
              onClick={() => setMode('login')}
              className={`px-3 py-1 rounded ${
                mode === 'login' ? 'bg-black text-white' : 'bg-white'
              }`}
            >
              Login
            </button>

            <button
              onClick={() => setMode('register')}
              className={`px-3 py-1 rounded ${
                mode === 'register' ? 'bg-black text-white' : 'bg-white'
              }`}
            >
              Register
            </button>
          </div>
        )}

        {/* FORM */}
        <form onSubmit={submit} className="space-y-4">
          {role === 'user' && mode === 'register' && (
            <input
              className="w-full rounded-md border px-3 py-2 bg-white/80"
              placeholder="Full Name"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            />
          )}

          <input
            className="w-full rounded-md border px-3 py-2 bg-white/80"
            placeholder="Email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          />

          <input
            type="password"
            className="w-full rounded-md border px-3 py-2 bg-white/80"
            placeholder="Password"
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
          />

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="flex items-center justify-between text-xs text-slate-700">
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              Remember me
            </label>
            <span className="cursor-pointer hover:underline">
             
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-black py-2 text-white"
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Register'}
          </button>
        </form>

        {role === 'admin' && (
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={fillAdmin}
              className="text-xs underline"
            >
              Fill Admin Credentials
            </button>
          </div>
        )}
      </div>

      
      
    </div>
  )
}
