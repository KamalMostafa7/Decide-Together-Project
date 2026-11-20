const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const sequelize = require('./database/config');
const { User } = require('./models');

// Import routes
const authRoutes = require('./routes/authRoutes');
const reportRoutes = require('./routes/reportRoutes');
const commentRoutes = require('./routes/commentRoutes');
const voteRoutes = require('./routes/voteRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/notifications', notificationRoutes);

// Serve frontend pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/register.html'));
});

app.get('/browse.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/browse.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dashboard.html'));
});

app.get('/report', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/report.html'));
});

// 404 handler - must be last route
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '../frontend/404.html'));
});

// Database initialization and seed data
const initializeDatabase = async () => {
  try {
    await sequelize.sync({ force: false });
    console.log('Database synced successfully');

    // Create default admin user if not exists
    const adminExists = await User.findOne({ where: { email: 'admin@decidetogether.com' } });
    
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: 'admin@decidetogether.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('Default admin user created');
      console.log('Email: admin@decidetogether.com');
      console.log('Password: admin123');
    }

    // Create a test user if not exists
    const userExists = await User.findOne({ where: { email: 'user@test.com' } });
    
    if (!userExists) {
      await User.create({
        name: 'Test User',
        email: 'user@test.com',
        password: 'user123',
        role: 'user'
      });
      console.log('Test user created');
      console.log('Email: user@test.com');
      console.log('Password: user123');
    }

  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

// Start server
const startServer = async () => {
  await initializeDatabase();
  
  app.listen(PORT, () => {
    console.log(`\n✅ Decide Together server is running!`);
    console.log(`🌐 Open your browser and go to: http://localhost:${PORT}`);
    console.log(`\n📱 Frontend: http://localhost:${PORT}`);
    console.log(`🔧 API: http://localhost:${PORT}/api`);
    console.log(`\n👤 Admin Login:`);
    console.log(`   Email: admin@decidetogether.com`);
    console.log(`   Password: admin123\n`);
  });
};

startServer();

module.exports = app;
