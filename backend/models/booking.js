const mongoose = require('mongoose')

const BookingSchema = new mongoose.Schema({
  guestName: String,
  guestPhone: String,
  guestEmail: String,
  roomId: Number,
  checkIn: String,
  checkOut: String,
  guests: Number,
  total: Number,
  status: String
})

module.exports = mongoose.model('Booking', BookingSchema)
