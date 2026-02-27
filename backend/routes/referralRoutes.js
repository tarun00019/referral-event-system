const express = require('express');
const router = express.Router();
const authMiddleware = require('../app/middlewares/authMiddleware');
const ReferralController = require('../app/controllers/ReferralController');

router.get('/count', authMiddleware, ReferralController.getMyReferralCount);
router.get('/list', authMiddleware, ReferralController.getMyReferredUsers);
router.get('/leaderboard', ReferralController.getLeaderboard);

module.exports = router;