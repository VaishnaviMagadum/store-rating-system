require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./db');
const User = require('./models/User');
const Store = require('./models/Store');
const Rating = require('./models/Rating');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const storeRoutes = require('./routes/storeRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stores', storeRoutes);

const PORT = process.env.PORT || 5000;

sequelize.sync().then(() => {
  console.log('Database synced');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to sync database', err);
});
