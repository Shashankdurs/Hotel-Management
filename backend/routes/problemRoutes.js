const express = require('express')
const router = express.Router()
const Problem = require('../models/Problem')

// 📥 Get all problems (for admin)
router.get('/', async (req, res) => {
  try {
    const problems = await Problem.find().sort({ _id: -1 })
    res.json(problems)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch problems' })
  }
})

// ➕ Create problem
router.post('/', async (req, res) => {
  try {
    const problem = new Problem({
      ...req.body,
      createdAt: new Date().toLocaleString(),
    })
    await problem.save()
    res.status(201).json(problem)
  } catch (err) {
    res.status(500).json({ message: 'Failed to create problem' })
  }
})

// 📥 Get problems by user
router.get('/my/:userName', async (req, res) => {
  try {
    const problems = await Problem.find({
      userName: req.params.userName,
    }).sort({ _id: -1 })

    res.json(problems)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch problems' })
  }
})

// 🗑️ Delete problem by id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Problem.findByIdAndDelete(req.params.id)
    if (!deleted) return res.status(404).json({ message: 'Problem not found' })
    res.json({ message: 'Problem deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete problem' })
  }
})

module.exports = router
