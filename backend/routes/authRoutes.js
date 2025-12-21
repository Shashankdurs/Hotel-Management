// const express = require('express')
// const User = require('../models/user')
// const router = express.Router()

// router.post('/register', async (req, res) => {
//   const user = new User(req.body)
//   await user.save()
//   res.json({ success: true })
// })

// router.post('/login', async (req, res) => {
//   const user = await User.findOne(req.body)
//   if (!user) {
//     return res.status(401).json({ success: false })
//   }
//   res.json({ success: true, user })
// })

// module.exports = router
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

// Use environment JWT secret when available; fall back to a development secret
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me'
if (!process.env.JWT_SECRET) {
  console.warn('WARNING: process.env.JWT_SECRET is not set. Using insecure default JWT secret for development.')
}

const router = express.Router()

/* ================= REGISTER ================= */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'user'
    })

    res.status(201).json({ message: 'User registered successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

/* ================= LOGIN ================= */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
      // Support a built-in admin test account (frontend shows test credentials)
      if (email === 'admin@admin.com' && password === 'admin') {
        const adminUser = { name: 'Admin', email, role: 'admin' }
        const token = jwt.sign({ id: 'admin', role: 'admin' }, JWT_SECRET, { expiresIn: '1d' })
        return res.json({ token, user: adminUser })
      }

      const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' })

    res.json({
      token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
