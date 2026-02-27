require('dotenv').config();

const express = require('express');

const sequelize = require('./config/db');
const models = require('./app/models');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS MUST COME BEFORE ROUTES
const cors = require("cors");

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://referral-event-system.netlify.app"
  ],
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static('public/uploads'));

const authRoutes = require('./routes/authRoutes');
const referralRoutes = require('./routes/referralRoutes');
const eventRoutes = require('./routes/eventRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);

// ✅ Root Route
app.get('/', (req, res) => {
    res.send('Referral & Event System API Running 🚀');
});

// ✅ Error Middleware (MUST be after routes)
const errorMiddleware = require('./app/middlewares/errorMiddleware');
app.use(errorMiddleware);



// ✅ Database Connection & Sync
sequelize.authenticate()
    .then(() => {
        console.log('Database connected successfully');

        models.applyAssociations();

        return sequelize.sync();
    })
    .then(() => {
        console.log('All models synced successfully');

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Unable to connect to database:', err);
    });