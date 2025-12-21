const mongoose = require('mongoose')

const ProblemSchema = new mongoose.Schema({
  userName: String,
  userEmail: String,
  title: String,
  description: String,
  roomNumber: String,
  roomIssues: String,
  category: String,
  priority: String,
  foodQuality: String,
  status: {
    type: String,
    default: 'Open',
  },
  createdAt: {
    type: String,
  },
})

module.exports = mongoose.model('Problem', ProblemSchema)
