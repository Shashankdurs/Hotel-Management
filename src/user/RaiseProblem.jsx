// src/components/RaiseProblem.jsx
import React, { useContext, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { ProblemsContext } from './ProblemsContext'
import toast from 'react-hot-toast'
import './../styles/UserDashboard.css'

export default function RaiseProblem() {
  const { user } = useContext(AuthContext)
  const { addProblem } = useContext(ProblemsContext)
  const userName = user?.name || user?.email || 'Guest'
  const userEmail = user?.email || ''

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [roomNumber, setRoomNumber] = useState('')
  const [roomIssues, setRoomIssues] = useState('')
  const [category, setCategory] = useState('Technical')
  const [priority, setPriority] = useState('Medium')
  const [foodQuality, setFoodQuality] = useState('Good')
  const [submitting, setSubmitting] = useState(false)

  function resetForm() {
    setTitle('')
    setDescription('')
    setRoomNumber('')
    setRoomIssues('')
    setCategory('Technical')
    setPriority('Medium')
    setFoodQuality('Good')
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!title || !description || !roomNumber || !roomIssues) {
      toast.error('All required fields must be filled')
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch('http://localhost:5000/api/problems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName,
          userEmail,
          title,
          description,
          roomNumber,
          roomIssues,
          category,
          priority,
          foodQuality,
          status: 'Open',
        }),
      })

      if (!res.ok) throw new Error()

      const saved = await res.json().catch(() => null)
      // Persist to local storage so Admin dashboard (which reads localStorage)
      // can immediately display the new problem.
      try {
        const p = saved || {
          userName,
          userEmail,
          title,
          description,
          roomNumber,
          roomIssues,
          category,
          priority,
          foodQuality,
          status: 'Open',
          createdAt: new Date().toLocaleString(),
        }
        addProblem(p)
      } catch (e) {
        // ignore
      }

      toast.success('Problem submitted successfully')
      resetForm()
    } catch (err) {
      console.error(err)
      toast.error('Server error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 bg-slate-100 dark:bg-slate-900">
      {/* FORM CARD */}
      <div className="ud-card w-full max-w-3xl shadow-xl">
        <h3 className="ud-title">Raise a Problem</h3>

        <form onSubmit={handleSubmit} className="ud-form">
          <label>
            Title <span className="ud-required">*</span>
            <input
              className="ud-input"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </label>

          <label>
            Description <span className="ud-required">*</span>
            <textarea
              className="ud-textarea"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </label>

          <label>
            Room Number <span className="ud-required">*</span>
            <input
              className="ud-input"
              placeholder="e.g. 101"
              value={roomNumber}
              onChange={e => setRoomNumber(e.target.value)}
            />
          </label>

          <label>
            Room Issues <span className="ud-required">*</span>
            <textarea
              className="ud-textarea"
              placeholder="Plumbing, AC, cleanliness, etc."
              value={roomIssues}
              onChange={e => setRoomIssues(e.target.value)}
            />
          </label>

          <div className="ud-row">
            <label>
              Category
              <select
                className="ud-select"
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                <option>Technical</option>
                <option>Billing</option>
                <option>Other</option>
              </select>
            </label>

            <label>
              Priority
              <select
                className="ud-select"
                value={priority}
                onChange={e => setPriority(e.target.value)}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </label>
          </div>

          <label>
            Food Quality
            <select
              className="ud-select"
              value={foodQuality}
              onChange={e => setFoodQuality(e.target.value)}
            >
              <option>Excellent</option>
              <option>Good</option>
              <option>Average</option>
              <option>Poor</option>
            </select>
          </label>

          <div className="ud-actions">
            <button className="ud-btn" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
