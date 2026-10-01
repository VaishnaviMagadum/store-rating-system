const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Store = require('../models/Store');
const Rating = require('../models/Rating');
const { authMiddleware, requireRole } = require('../middlewares/authMiddleware');
const { validateName, validateEmail, validatePassword, validateAddress } = require('../utils/validations');
const { Op } = require('sequelize');
const sequelize = require('../db');

const router = express.Router();

router.use(authMiddleware);
router.use(requireRole(['SYSTEM_ADMIN']));

router.get('/dashboard', async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();
    res.json({ totalUsers, totalStores, totalRatings });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/users', async (req, res) => {
  const { name, email, password, address, role } = req.body;
  if (!validateName(name)) return res.status(400).json({ error: 'Name must be 20-60 chars.' });
  if (!validateEmail(email)) return res.status(400).json({ error: 'Invalid email.' });
  if (!validatePassword(password)) return res.status(400).json({ error: 'Invalid password.' });
  if (!validateAddress(address)) return res.status(400).json({ error: 'Invalid address.' });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, address, role: role || 'NORMAL_USER' });
    res.status(201).json({ message: 'User created' });
  } catch (error) {
    res.status(500).json({ error: 'Error creating user' });
  }
});

router.post('/stores', async (req, res) => {
  const { name, email, address, ownerId } = req.body;
  try {
    const store = await Store.create({ name, email, address, ownerId });
    res.status(201).json(store);
  } catch (error) {
    res.status(500).json({ error: 'Error creating store' });
  }
});

router.get('/users', async (req, res) => {
  const { search, role, sortBy, sortOrder } = req.query;
  const where = {};
  if (search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
      { address: { [Op.like]: `%${search}%` } }
    ];
  }
  if (role) {
    where.role = role;
  }

  const order = [];
  if (sortBy) {
    order.push([sortBy, sortOrder === 'desc' ? 'DESC' : 'ASC']);
  } else {
    order.push(['createdAt', 'DESC']);
  }

  try {
    const users = await User.findAll({ where, order, attributes: { exclude: ['password'] } });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
});

router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, { attributes: { exclude: ['password'] } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    let response = user.toJSON();

    if (user.role === 'STORE_OWNER') {
      const store = await Store.findOne({ where: { ownerId: user.id } });
      if (store) {
        const ratings = await Rating.findAll({ where: { storeId: store.id } });
        const avgRating = ratings.length > 0 ? ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length : 0;
        response.store = { ...store.toJSON(), averageRating: avgRating };
      }
    }
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user' });
  }
});

router.get('/stores', async (req, res) => {
  const { search, sortBy, sortOrder } = req.query;
  const where = {};
  if (search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
      { address: { [Op.like]: `%${search}%` } }
    ];
  }

  const order = [];
  if (sortBy && sortBy !== 'averageRating') {
    order.push([sortBy, sortOrder === 'desc' ? 'DESC' : 'ASC']);
  } else if (!sortBy) {
    order.push(['createdAt', 'DESC']);
  }

  try {
    const stores = await Store.findAll({
      where,
      order,
      include: [{ model: Rating }]
    });

    let storeData = stores.map(store => {
      const s = store.toJSON();
      const avgRating = s.Ratings.length > 0 ? s.Ratings.reduce((acc, r) => acc + r.rating, 0) / s.Ratings.length : 0;
      s.averageRating = avgRating;
      delete s.Ratings;
      return s;
    });

    if (sortBy === 'averageRating') {
      storeData.sort((a, b) => {
        if (sortOrder === 'desc') return b.averageRating - a.averageRating;
        return a.averageRating - b.averageRating;
      });
    }

    res.json(storeData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching stores' });
  }
});

module.exports = router;
