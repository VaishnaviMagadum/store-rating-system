const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validatePassword, validateName, validateAddress, validateEmail } = require('../utils/validations');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { name, email, password, address } = req.body;

  if (!validateName(name)) return res.status(400).json({ error: 'Name must be 20-60 characters.' });
  if (!validateEmail(email)) return res.status(400).json({ error: 'Invalid email.' });
  if (!validatePassword(password)) return res.status(400).json({ error: 'Password must be 8-16 characters with >=1 uppercase and >=1 special char.' });
  if (!validateAddress(address)) return res.status(400).json({ error: 'Address must be max 400 characters.' });

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'Email already exists.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, address });
    
    res.status(201).json({ message: 'User created successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Invalid email or password.' });

    if (user.role !== role) {
      return res.status(403).json({ error: 'Account does not have the selected role.' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid email or password.' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, role: user.role, name: user.name, id: user.id });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/change-password', authMiddleware, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!validatePassword(newPassword)) return res.status(400).json({ error: 'New password does not meet requirements.' });

  try {
    const user = await User.findByPk(req.user.id);
    const validPassword = await bcrypt.compare(oldPassword, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid old password.' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
