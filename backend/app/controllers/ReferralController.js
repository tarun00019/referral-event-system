const { Referral, User } = require('../models');
const { Sequelize } = require('sequelize');

class ReferralController {

    static async getMyReferralCount(req, res) {
        try {
            const count = await Referral.count({
                where: { referrer_id: req.user.id }
            });

            res.json({
                success: true,
                referral_count: count
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async getMyReferredUsers(req, res) {
        try {
            const referrals = await Referral.findAll({
                where: { referrer_id: req.user.id },
                include: [{
                    model: User,
                    as: 'ReferredUser',
                    attributes: ['id', 'name', 'email']
                }]
            });

            res.json({
                success: true,
                data: referrals
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async getLeaderboard(req, res) {
        try {
            const leaderboard = await Referral.findAll({
                attributes: [
                    'referrer_id',
                    [Sequelize.fn('COUNT', Sequelize.col('referrer_id')), 'total_referrals']
                ],
                group: ['referrer_id'],
                order: [[Sequelize.literal('total_referrals'), 'DESC']]
            });

            res.json({
                success: true,
                data: leaderboard
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = ReferralController;