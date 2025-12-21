const mongoose = require('mongoose')

const FoodOrderSchema = new mongoose.Schema(
  {
    roomId: Number,
    items: [String],
    note: String,
    requestedBy: String,
    status: { type: String, default: 'New' },
  },
  { timestamps: true }
)

module.exports = mongoose.model('FoodOrder', FoodOrderSchema)
