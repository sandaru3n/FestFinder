const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const Event = require('./models/Event');
const User = require('./models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/festfinder';

app.use(cors());
app.use(express.json());

// Serve static files from the uploads directory
app.use('/uploads', express.static('uploads'));

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('FestFinder backend is running!');
});

app.get('/events', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Public route to get a single event by ID (no auth required)
app.get('/events/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// Public route to get related events by category (excluding the current event)
app.get('/events/:id/related', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    const relatedEvents = await Event.find({
      _id: { $ne: event._id },
      'category.name': event.category.name
    })
      .limit(4);
    res.json(relatedEvents);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch related events' });
  }
});

// Route to get all events (filtered by user or admin)
app.get('/api/events', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
      }

      let query = {};
      // If not admin, filter by user who created the event (assuming user ID is in token)
      if (decoded.role !== 'admin') {
        query = { createdBy: decoded.userId };
      }

      const events = await Event.find(query);
      res.json(events);
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to get a single event by ID
app.get('/api/events/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
      }

      const event = await Event.findById(req.params.id);
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      // Check if user is admin or the creator of the event
      if (decoded.role !== 'admin' && event.createdBy.toString() !== decoded.userId) {
        return res.status(403).json({ error: 'Forbidden: You do not have permission to view this event' });
      }

      res.json(event);
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to update an existing event
app.put('/api/events/:id', upload.single('image'), async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
      }

      const event = await Event.findById(req.params.id);
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      // Check if user is admin or the creator of the event
      if (decoded.role !== 'admin' && event.createdBy.toString() !== decoded.userId) {
        return res.status(403).json({ error: 'Forbidden: You do not have permission to update this event' });
      }

      const { name, dateTime, location, description, country, city, tags, organizedBy, is_free, ticket_price } = req.body;
      if (!name || !dateTime || !location || !country || !city || !organizedBy) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      let finalIsFree = is_free === true || is_free === 'true';
      let finalTicketPrice = finalIsFree ? 'Free' : (ticket_price || '');

      const eventData = {
        name,
        description,
        start: { local: dateTime, timezone: 'UTC' },
        venue: { name: location, address: { localized_address_display: `${city}, ${country}` } },
        category: { name: req.body.category || '' },
        is_free: finalIsFree,
        ticket_price: finalTicketPrice
      };

      // If a new image was uploaded, update the path
      if (req.file) {
        eventData.logo = { url: `/uploads/${req.file.filename}` };
      }

      const updatedEvent = await Event.findByIdAndUpdate(req.params.id, eventData, { new: true });
      res.json(updatedEvent);
    });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to delete an event
app.delete('/api/events/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
      }

      const event = await Event.findById(req.params.id);
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      // Check if user is admin or the creator of the event
      if (decoded.role !== 'admin' && event.createdBy.toString() !== decoded.userId) {
        return res.status(403).json({ error: 'Forbidden: You do not have permission to delete this event' });
      }

      await Event.findByIdAndDelete(req.params.id);
      res.json({ message: 'Event deleted successfully' });
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to create a new event
app.post('/api/events', upload.single('image'), async (req, res) => {
  try {
    // Verify JWT token for authentication
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
      }

      const { name, dateTime, location, description, country, city, tags, organizedBy, is_free, ticket_price } = req.body;
      if (!name || !dateTime || !location || !country || !city || !organizedBy) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      let finalIsFree = is_free === true || is_free === 'true';
      let finalTicketPrice = finalIsFree ? 'Free' : (ticket_price || '');

      const eventData = {
        name,
        description,
        start: { local: dateTime, timezone: 'UTC' },
        venue: { name: location, address: { localized_address_display: `${city}, ${country}` } },
        category: { name: req.body.category || '' },
        createdBy: decoded.userId,
        is_free: finalIsFree,
        ticket_price: finalTicketPrice
      };

      // If an image was uploaded, add the path to the event data
      if (req.file) {
        eventData.logo = { url: `/uploads/${req.file.filename}` };
      }

      const newEvent = new Event(eventData);
      const savedEvent = await newEvent.save();
      res.status(201).json(savedEvent);
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Signup route
app.post('/api/auth/signup', async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, role: role || 'user' });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Signup failed' });
  }
});

// Login route
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Admin dashboard statistics
app.get('/api/admin/stats', async (req, res) => {
  try {
    // Verify JWT token and admin role
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }

    const userCount = await User.countDocuments();
    const eventCount = await Event.countDocuments();
    // For revenue, this is a placeholder. In a real app, you'd calculate based on transactions
    const revenue = 12345;

    // Calculate percentage changes (placeholder logic)
    const userGrowth = 5.2;
    const eventGrowth = -2.1;
    const revenueGrowth = 8.7;

    res.json({
      users: {
        count: userCount,
        growth: userGrowth
      },
      events: {
        count: eventCount,
        growth: eventGrowth
      },
      revenue: {
        amount: revenue,
        growth: revenueGrowth
      }
    });
  } catch (err) {
    console.error('Error fetching admin stats:', err);
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Recent user activity for admin dashboard
app.get('/api/admin/recent-activity', async (req, res) => {
  try {
    // Verify JWT token and admin role
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }

    // Get recent users (this could be expanded to include more activity types)
    const recentUsers = await User.find()
      .sort({ _id: -1 })
      .limit(5)
      .select('email createdAt');

    const activities = recentUsers.map(user => ({
      type: 'user_registered',
      email: user.email,
      timestamp: user.createdAt || new Date()
    }));

    res.json(activities);
  } catch (err) {
    console.error('Error fetching recent activity:', err);
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
    res.status(500).json({ error: 'Failed to fetch recent activity' });
  }
});

// Get all users (admin only)
app.get('/api/admin/users', async (req, res) => {
  try {
    // Verify JWT token and admin role
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }

    const { page = 1, limit = 10, search = '' } = req.query;
    const query = search ? { email: { $regex: search, $options: 'i' } } : {};
    
    const users = await User.find(query)
      .select('-password')
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));
    const total = await User.countDocuments(query);
    
    res.json({
      users,
      total,
      pages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page)
    });
  } catch (err) {
    console.error('Error fetching users:', err);
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Update user (admin only)
app.put('/api/admin/users/:id', async (req, res) => {
  try {
    // Verify JWT token and admin role
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }

    const { role, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, email },
      { new: true, select: '-password' }
    );
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    console.error('Error updating user:', err);
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete/Suspend user (admin only)
app.delete('/api/admin/users/:id', async (req, res) => {
  try {
    // Verify JWT token and admin role
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Get all events (admin only)
app.get('/api/admin/events', async (req, res) => {
  try {
    // Verify JWT token and admin role
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }

    const { page = 1, limit = 10, search = '' } = req.query;
    const query = search ? { name: { $regex: search, $options: 'i' } } : {};
    
    const events = await Event.find(query)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));
    const total = await Event.countDocuments(query);
    
    res.json({
      events,
      total,
      pages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page)
    });
  } catch (err) {
    console.error('Error fetching events:', err);
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Create new event (admin only)
app.post('/api/admin/events', async (req, res) => {
  try {
    // Verify JWT token and admin role
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }

    const eventData = req.body;
    const event = new Event(eventData);
    await event.save();
    
    res.status(201).json(event);
  } catch (err) {
    console.error('Error creating event:', err);
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// Update event (admin only)
app.put('/api/admin/events/:id', async (req, res) => {
  try {
    // Verify JWT token and admin role
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }

    const eventData = req.body;
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      eventData,
      { new: true }
    );
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json(event);
  } catch (err) {
    console.error('Error updating event:', err);
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// Delete event (admin only)
app.delete('/api/admin/events/:id', async (req, res) => {
  try {
    // Verify JWT token and admin role
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }

    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    console.error('Error deleting event:', err);
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

// Create admin user if not exists
(async () => {
  try {
    const adminEmail = 'admin@gmail.com';
    const adminPassword = 'Sandaru2002@';
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const adminUser = new User({ email: adminEmail, password: hashedPassword, role: 'admin' });
      await adminUser.save();
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }
  } catch (err) {
    console.error('Error creating admin user:', err);
  }
})();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 