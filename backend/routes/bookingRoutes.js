const express = require('express')
const router = express.Router()
const Booking = require('../models/booking')
const Customer = require('../models/Customer')

// CREATE BOOKING (called from frontend)
router.post('/bookings', async (req, res) => {
  try {
    const booking = new Booking(req.body)
    await booking.save()
    // If booking contains guest info, create or update customer in DB
    try {
      const guestEmail = (req.body.guestEmail || '').toLowerCase()
      const guestPhone = req.body.guestPhone || ''
      const guestName = req.body.guestName || ''

      if (guestEmail || guestPhone || guestName) {
        const query = {}
        if (guestEmail) query.email = guestEmail
        else if (guestPhone) query.phone = guestPhone

        const update = {
          name: guestName || undefined,
          email: guestEmail || undefined,
          phone: guestPhone || undefined,
        }

        await Customer.findOneAndUpdate(query, update, { upsert: true, new: true, setDefaultsOnInsert: true })
      }
    } catch (e) {
      console.error('Failed to sync customer from booking', e)
    }
    return res.status(201).json({ success: true, booking })
  } catch (err) {
    console.error('Failed to create booking', err)
    return res.status(500).json({ success: false, message: 'Failed to create booking' })
  }
})

// GET ALL BOOKINGS (admin)
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find()
    res.json(bookings)
  } catch (err) {
    res.status(500).json({ message: 'Error fetching bookings' })
  }
})

module.exports = router
