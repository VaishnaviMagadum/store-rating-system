const sequelize = require('./db');
const User = require('./models/User');
const Store = require('./models/Store');
const Rating = require('./models/Rating');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    await sequelize.sync();
    
    const hashed = await bcrypt.hash('Password@123', 10);
    
    // Admins
    await User.findOrCreate({
      where: { email: 'admin@system.com' },
      defaults: { name: 'System Administrator', password: hashed, address: 'Central Admin Headquarters, Building 1', role: 'SYSTEM_ADMIN' }
    });

    // Owners
    const owners = [
      { email: 'john.owner@stores.com', name: 'Johnathan Store Owner', password: hashed, address: '123 Business Avenue, Tech District', role: 'STORE_OWNER' },
      { email: 'sarah.smith@retail.com', name: 'Sarah Smith Retail Owner', password: hashed, address: '456 Commerce Blvd, Market Square', role: 'STORE_OWNER' },
      { email: 'mike.jones@shops.com', name: 'Michael Jones Shop Owner', password: hashed, address: '789 Enterprise Road, Industrial Park', role: 'STORE_OWNER' },
      { email: 'emma.davis@market.com', name: 'Emma Davis Market Owner', password: hashed, address: '12 Uptown Avenue', role: 'STORE_OWNER' },
      { email: 'liam.wilson@bookstore.com', name: 'Liam Wilson Bookstore Owner', password: hashed, address: '45 Library Lane', role: 'STORE_OWNER' }
    ];

    const createdOwners = [];
    for (const owner of owners) {
      const [u] = await User.findOrCreate({ where: { email: owner.email }, defaults: owner });
      createdOwners.push(u);
    }

    // Normal Users
    const users = [
      { email: 'alice.customer@mail.com', name: 'Alice Customer Shopper', password: hashed, address: '321 Residential Lane, Suburbia', role: 'NORMAL_USER' },
      { email: 'bob.reviewer@mail.com', name: 'Robert Reviewer Expert', password: hashed, address: '654 Apartment Complex, Downtown', role: 'NORMAL_USER' },
      { email: 'charlie.buyer@mail.com', name: 'Charles Buyer Consumer', password: hashed, address: '987 Housing Estate, Uptown', role: 'NORMAL_USER' },
      { email: 'diana.shopper@mail.com', name: 'Diana Shopper Enthusiast', password: hashed, address: '147 Villa Drive, Countryside', role: 'NORMAL_USER' },
      { email: 'evan.shopper@mail.com', name: 'Evan Shopper Enthusiast Buyer', password: hashed, address: '123 Test Ave', role: 'NORMAL_USER' },
      { email: 'fiona.buyer@mail.com', name: 'Fiona Buyer Regular Customer', password: hashed, address: '456 Sample St', role: 'NORMAL_USER' }
    ];

    const createdUsers = [];
    for (const user of users) {
      const [u] = await User.findOrCreate({ where: { email: user.email }, defaults: user });
      createdUsers.push(u);
    }

    // Stores
    const stores = [
      { name: 'Tech Haven Superstore', email: 'contact@techhaven.com', address: '100 Silicon Valley Road', ownerId: createdOwners[0].id },
      { name: 'Fresh Groceries Market', email: 'hello@freshmarket.com', address: '200 Organic Farming Lane', ownerId: createdOwners[1].id },
      { name: 'Fashion Boutique Central', email: 'style@fashionboutique.com', address: '300 High Street Fashion Ave', ownerId: createdOwners[2].id },
      { name: 'Gadget World Emporium', email: 'info@gadgetworld.com', address: '400 Digital Display Way', ownerId: createdOwners[0].id },
      { name: 'Daily Essentials Shop', email: 'support@dailyessentials.com', address: '500 Community Plaza Center', ownerId: createdOwners[1].id },
      { name: 'Computer Components Pro', email: 'sales@computerpro.com', address: '600 Tech Boulevard', ownerId: createdOwners[3].id },
      { name: 'City Central Cafe', email: 'hello@citycafe.com', address: '700 Coffee Street', ownerId: createdOwners[4].id },
      { name: 'Read & Relax Books', email: 'contact@readrelax.com', address: '800 Library Lane', ownerId: createdOwners[4].id },
      { name: 'Urban Fashion Outlet', email: 'outlet@urbanfashion.com', address: '900 High Fashion Road', ownerId: createdOwners[2].id },
      { name: 'Organic Fresh Bites', email: 'healthy@freshbites.com', address: '1000 Green Way', ownerId: createdOwners[1].id }
    ];

    const createdStores = [];
    for (const store of stores) {
      const [s] = await Store.findOrCreate({ where: { email: store.email }, defaults: store });
      createdStores.push(s);
    }

    // Ratings
    for (const store of createdStores) {
      for (const user of createdUsers) {
        // Random 3 to 5 stars
        const randomRating = Math.floor(Math.random() * 3) + 3;
        await Rating.findOrCreate({
          where: { userId: user.id, storeId: store.id },
          defaults: { rating: randomRating }
        });
      }
    }

    console.log('Massive seeding complete! Lots of users, stores, and ratings added.');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    process.exit();
  }
}

seed();
