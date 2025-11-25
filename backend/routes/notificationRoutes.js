import express from 'express';
import Notification from '../model/notificationModel.js';

const router = express.Router();

// DEBUG: Log when router is loaded
console.log('Notification routes module loaded');

// DEBUG: Show all routes in this router
router.use((req, res, next) => {
  console.log(`Notification router hit: ${req.method} ${req.originalUrl}`);
  next();
});

// TEST ROUTE - Add this first
router.get('/test', (req, res) => {
  console.log('GET /api/notifications/test hit');
  res.json({ message: 'Notification API is working!' });
});

// Get all notifications
// In your notificationRoutes.js, update the GET / route:
router.get('/', async (req, res) => {
  try {
    console.log('GET /api/notifications hit - INSIDE ROUTER');
    console.log('DEBUG: Attempting to fetch from MongoDB...');
    
    const notifications = await Notification.find().sort({ createdAt: -1 });
    console.log(`DEBUG: Found ${notifications.length} notifications`);
    
    res.json(notifications);
  } catch (error) {
    console.error(' Error in GET /api/notifications:', error);
    res.status(500).json({ 
      error: error.message,
      details: 'MongoDB query failed'
    });
  }
});

// Create new notification (admin only)
router.post('/', async (req, res) => {
  try {
    console.log('POST /api/notifications hit - INSIDE ROUTER');
    const { message, type, createdBy } = req.body;
    
    const newNotification = new Notification({
      message,
      type: type || 'announcement',
      createdBy
    });

    await newNotification.save();
    res.status(201).json(newNotification);
  } catch (error) {
    console.error('Error in POST /api/notifications:', error);
    res.status(400).json({ error: error.message });
  }
});

// DEBUG: Print the router's stack
console.log('Notification routes registered:');
router.stack.forEach((layer) => {
  if (layer.route) {
    const methods = Object.keys(layer.route.methods).join(', ').toUpperCase();
    const path = layer.route.path;
    console.log(`  ${methods} ${path}`);
  }
});

export default router;