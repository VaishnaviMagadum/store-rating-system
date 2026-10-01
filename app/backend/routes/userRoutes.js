const express = require('express');
const { authMiddleware, requireRole } = require('../middlewares/authMiddleware');
const Store = require('../models/Store');
const Rating = require('../models/Rating');
const { Op } = require('sequelize');

const router = express.Router();

router.use(authMiddleware);
router.use(requireRole(['NORMAL_USER']));

router.get('/stores', async (req, res) => {
  const { search, sortBy, sortOrder } = req.query;
  const where = {};
  if (search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { address: { [Op.like]: `%${search}%` } }
    ];
  }

  const order = [];
  if (sortBy && sortBy !== 'averageRating') {
    order.push([sortBy, sortOrder === 'desc' ? 'DESC' : 'ASC']);
  } else if (!sortBy) {
    order.push(['name', 'ASC']);
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
      
      const userRatingObj = s.Ratings.find(r => r.userId === req.user.id);
      
      s.averageRating = avgRating;
      s.userRating = userRatingObj ? userRatingObj.rating : null;
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

router.post('/stores/:storeId/rate', async (req, res) => {
  const { storeId } = req.params;
  const { rating } = req.body;
  if (rating < 1 || rating > 5) return res.status(400).json({ error: 'Rating must be between 1 and 5' });

  try {
    const store = await Store.findByPk(storeId);
    if (!store) return res.status(404).json({ error: 'Store not found' });

    let userRating = await Rating.findOne({ where: { storeId, userId: req.user.id } });
    if (userRating) {
      userRating.rating = rating;
      await userRating.save();
    } else {
      userRating = await Rating.create({ storeId, userId: req.user.id, rating });
    }

    res.json({ message: 'Rating submitted successfully', userRating });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
