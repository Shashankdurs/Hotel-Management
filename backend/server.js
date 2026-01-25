// require('dotenv').config()   // ✅ MUST BE FIRST

// const express = require('express')
// const mongoose = require('mongoose')
// const cors = require('cors')

// const authRoutes = require('./routes/authRoutes')
// const bookingRoutes = require('./routes/bookingRoutes')
// const problemRoutes = require('./routes/problemRoutes')
// const foodOrderRoutes = require('./routes/foodOrderRoutes')
// const customerRoutes = require('./routes/customerRoutes')

// const app = express()

// app.use(cors())
// app.use(express.json())

// // 🔍 DEBUG (temporary)
// console.log('PORT:', process.env.PORT)
// console.log('MONGO_URI:', process.env.MONGO_URI)

// // ✅ MongoDB connection
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.error('MongoDB error:', err))

// app.use('/api/auth', authRoutes)
// app.use('/api', bookingRoutes)
// app.use('/api/problems', problemRoutes)
// // use consistent route name (frontend expects /api/foodorders)
// app.use('/api/foodorders', foodOrderRoutes)
// app.use('/api/customers', customerRoutes)




// const PORT = process.env.PORT || 5000

// app.get('/', (req, res) => {
//   res.send('Backend running')
// })

// app.listen(PORT, () =>
//   console.log(`Server running on port ${PORT}`)
// )
// server.js
require('dotenv').config() // works locally, ignored by Render

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const authRoutes = require('./routes/authRoutes')
const bookingRoutes = require('./routes/bookingRoutes')
const problemRoutes = require('./routes/problemRoutes')
const foodOrderRoutes = require('./routes/foodOrderRoutes')
const customerRoutes = require('./routes/customerRoutes')

const app = express()

/* ================== MIDDLEWARE ================== */
app.use(cors({
  origin: '*', // change to frontend URL later
  credentials: true,
}))
app.use(express.json())

/* ================== ENV CHECK ================== */
if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI is missing')
  process.exit(1)
}

if (!process.env.JWT_SECRET) {
  console.warn('⚠️ JWT_SECRET not set – using fallback (NOT recommended)')
}

/* ================== DATABASE ================== */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message)
    process.exit(1)
  })

/* ================== ROUTES ================== */
app.get('/', (req, res) => {
  res.send('✅ Backend running successfully')
})

app.use('/api/auth', authRoutes)
app.use('/api', bookingRoutes)
app.use('/api/problems', problemRoutes)
app.use('/api/foodorders', foodOrderRoutes)
app.use('/api/customers', customerRoutes)

/* ================== SERVER ================== */
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
