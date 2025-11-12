import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import usersRoutes from './routes/usersRoutes.js';

dotenv.config();
const app = express();

const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());


// Root route FIRST
app.get('/', (req, res) => {
  res.send('ConcoHub Backend Server is running');
});

// Then API routes
app.use('/api', usersRoutes);

// MongoDB connection
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});