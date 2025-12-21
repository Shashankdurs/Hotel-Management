const express = require('express')
const Customer = require('../models/Customer')

const router = express.Router()

// 🔹 GET all customers
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 })
    res.json(customers)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch customers' })
  }
})

// 🔹 ADD customer
router.post('/', async (req, res) => {
  try {
    const customer = new Customer(req.body)
    const saved = await customer.save()
    res.status(201).json(saved)
  } catch (err) {
    res.status(400).json({ message: 'Failed to add customer' })
  }
})

module.exports = router
