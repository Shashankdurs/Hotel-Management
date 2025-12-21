import React, { createContext, useEffect, useState } from 'react'

export const ProblemsContext = createContext()

const STORAGE_KEY = 'problems'

function loadProblems() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch (e) {
    return []
  }
}

export function ProblemsProvider({ children }) {
  const [problems, setProblems] = useState(() => loadProblems())

  // Persist problems to localStorage and broadcast an update event so other parts
  // of the app (including Admin dashboard) can react to new problems.
  useEffect(() => {
    try {
      const raw = JSON.stringify(problems)
      localStorage.setItem(STORAGE_KEY, raw)
      // Dispatch a custom event for same-window listeners
      try {
        const ev = new CustomEvent('problems-updated', { detail: { problems } })
        window.dispatchEvent(ev)
      } catch (e) {
        // ignore if CustomEvent not supported
      }
    } catch (e) {}
  }, [problems])

  // If another tab/window updates localStorage, reload the problems
  useEffect(() => {
    function onStorage(e) {
      if (e.key === STORAGE_KEY) {
        try {
          setProblems(JSON.parse(e.newValue || '[]'))
        } catch (err) {
          setProblems([])
        }
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  function addProblem(p) {
    const newP = { id: Date.now(), ...p }
    setProblems(prev => [newP, ...prev])
    return newP
  }

  function reloadFromStorage() {
    setProblems(loadProblems())
  }

  return (
    <ProblemsContext.Provider value={{ problems, addProblem, reloadFromStorage }}>
      {children}
    </ProblemsContext.Provider>
  )
}

export default ProblemsProvider

/*
LocalStorage key used: 'problems'
Admin dashboard should read from the same localStorage key to show all problems.
*/
