const express = require('express');
const router = express.Router();
const DashboardController = require('../app/controllers/DashboardController');
const authMiddleware = require('../app/middlewares/authMiddleware');
const roleMiddleware = require('../app/middlewares/roleMiddleware');

// 👤 User Dashboard
router.get('/profile', authMiddleware, DashboardController.getProfile);
router.get('/my-events', authMiddleware, DashboardController.getMyEvents);
router.get('/my-referral-count', authMiddleware, DashboardController.getMyReferralCount);
router.get('/my-referrals', authMiddleware, DashboardController.getMyReferrals);

// 🛠 Admin Dashboard
router.get('/admin/users', authMiddleware, roleMiddleware('admin'), DashboardController.getAllUsers);
router.get('/admin/events', authMiddleware, roleMiddleware('admin'), DashboardController.getAllEvents);
router.get('/admin/referral-stats', authMiddleware, roleMiddleware('admin'), DashboardController.getReferralStats);

module.exports = router;