import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import './../styles/UserDashboard.css'

export default function MyProblems() {
  const { user } = useContext(AuthContext)
  const userName = user?.name || user?.email || 'Guest'

  const [mine, setMine] = useState([])
  const [loading, setLoading] = useState(false)

  async function fetchMyProblems() {
    if (!userName) return

    setLoading(true)
    try {
      const res = await fetch(
        `http://localhost:5000/api/problems/my/${userName}`
      )
      const data = await res.json()
      setMine(data)
    } catch (err) {
      console.error('Failed to load problems', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMyProblems()
  }, [userName])

  async function deleteProblem(id) {
    if (!confirm('Delete this problem?')) return
    try {
      const res = await fetch(`http://localhost:5000/api/problems/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Delete failed')
      // remove from local state
      setMine(m => m.filter(p => p._id !== id))
    } catch (err) {
      console.error('Failed to delete problem', err)
      alert('Failed to delete problem')
    }
  }

  return (
    <div className="ud-card">
      <div className="ud-card-header">
        <h3 className="ud-title">My Problems</h3>
        <button onClick={fetchMyProblems} className="ud-btn-muted">
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="ud-empty">Loading...</div>
      ) : mine.length === 0 ? (
        <div className="ud-empty">
          You have not submitted any problems yet.
        </div>
      ) : (
        <div className="ud-list">
          {mine.map(p => (
            <div key={p._id} className="ud-item">
              <div className="ud-item-row">
                <strong>#{p._id.slice(-5)}</strong>
                <span className="ud-meta">{p.createdAt}</span>
              </div>

              <div className="ud-item-title">{p.title}</div>
              <div className="ud-item-desc">{p.description}</div>

              <div className="mt-2">
                <strong>Room:</strong> {p.roomNumber}
              </div>

              <div className="mt-1 text-sm">
                <strong>Room issues:</strong> {p.roomIssues}
              </div>

              <div className="mt-1">
                <strong>Food quality:</strong> {p.foodQuality}
              </div>

              <div className="ud-item-row">
                <span className="ud-pill">{p.category}</span>
                <span className="ud-pill">{p.priority}</span>
                <span className="ud-pill">{p.status}</span>
                <button
                  onClick={() => deleteProblem(p._id)}
                  className="ud-btn-muted"
                  style={{ marginLeft: 8 }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
