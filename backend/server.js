import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import usersRoutes from './routes/usersRoutes.js';
import authRoutes from './routes/authRoutes.js';
import bookingRoutes from "./routes/bookingRoutes.js";
import notificationRoutes from './routes/notificationRoutes.js'; // ADD THIS

dotenv.config();
const app = express();

const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI;

// ENABLE CORS - UNCOMMENT THIS
app.use(cors({
  origin: "http://127.0.0.1:5501",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Add this right after the CORS middleware for testing
app.get('/api/test-simple', (req, res) => {
  console.log('SIMPLE TEST ROUTE HIT!');
  res.json({ message: 'Simple test route works!' });
});


app.use(express.json());
app.use(cookieParser());

import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'SOEN-287-PROJECT')));

// Serve the css/js folder at the /css or /js URL path
app.use("/pages", express.static(path.join(__dirname, "..", "pages")));
app.use("/css", express.static(path.join(__dirname, "..", "css")));
app.use("/js", express.static(path.join(__dirname, "..", "js")));

// Root route FIRST
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});

// Root route FIRST

// API routes - ADD NOTIFICATION ROUTES HERE
app.use('/api', usersRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/notifications', notificationRoutes); // ADD THIS LINE

// Booking Routes
app.use(express.urlencoded({ extended: true }));
app.use("/", bookingRoutes);

// Page doesn't exist (404) (Must be placed last)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../pages/page404.html"));
});

// MongoDB connection
mongoose.connect(MONGO_URI, { dbName: 'ConcoHub_db' })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});