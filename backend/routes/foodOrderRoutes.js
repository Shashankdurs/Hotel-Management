const express = require('express')
const FoodOrder = require('../models/FoodOrder')

const router = express.Router()

// GET all food orders
router.get('/', async (req, res) => {
  try {
    const orders = await FoodOrder.find().sort({ createdAt: -1 })
    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch food orders' })
  }
})

// POST food order
router.post('/', async (req, res) => {
  try {
    const order = new FoodOrder(req.body)
    const saved = await order.save()
    res.status(201).json(saved)
  } catch (err) {
    console.error('Failed to place food order', err)
    res.status(500).json({ message: 'Failed to place food order', error: err?.message || String(err) })
  }
})

module.exports = router
