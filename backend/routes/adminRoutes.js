const express = require('express');
const router = express.Router();
const AdminController = require('../app/controllers/AdminController');
const authMiddleware = require('../app/middlewares/authMiddleware');
const adminMiddleware = require('../app/middlewares/adminMiddleware');

router.use(authMiddleware, adminMiddleware);

router.get('/users', AdminController.getAllUsers);
router.get('/events', AdminController.getAllEvents);
router.get('/leaderboard', AdminController.getLeaderboard);
router.get('/stats', AdminController.getReferralStats);

module.exports = router;