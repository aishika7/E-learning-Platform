const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const courseRoutes = require('./routes/course.routes');
const noteRoutes = require('./routes/note.routes');

const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/enrollments', require('./routes/enrollment.routes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const paymentRoutes = require('./routes/payment.routes');
app.use('/api/payment', paymentRoutes);
app.use('/api/enrollments', require('./routes/enrollments'));
