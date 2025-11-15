import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import usersRoutes from './routes/usersRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();
const app = express();

const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI;
app.use(cors({
  origin: "http://127.0.0.1:5501",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());



// Root route FIRST
app.get('/', (req, res) => {
  res.send('ConcoHub Backend Server is running');
});

// Then API routes
app.use('/api', usersRoutes);
app.use('/api/auth', authRoutes);

// Booking Routes
import bookingRoutes from "./routes/bookingRoutes.js";
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use("/", bookingRoutes);

// MongoDB connection
mongoose.connect(MONGO_URI, {dbName: 'ConcoHub_db'})
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
