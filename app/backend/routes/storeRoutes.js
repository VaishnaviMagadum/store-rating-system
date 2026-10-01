const express = require('express');
const { authMiddleware, requireRole } = require('../middlewares/authMiddleware');
const Store = require('../models/Store');
const Rating = require('../models/Rating');
const User = require('../models/User');

const router = express.Router();

router.use(authMiddleware);
router.use(requireRole(['STORE_OWNER']));

router.get('/dashboard', async (req, res) => {
  try {
    const store = await Store.findOne({ where: { ownerId: req.user.id } });
    if (!store) {
      return res.status(404).json({ error: 'Store not found for this owner.' });
    }

    const ratings = await Rating.findAll({
      where: { storeId: store.id },
      include: [{ model: User, attributes: ['id', 'name', 'email'] }]
    });

    const averageRating = ratings.length > 0 ? ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length : 0;
    
    res.json({
      store,
      averageRating,
      ratings
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
