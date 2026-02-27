const { User, Event, Referral } = require('../models');
const { Sequelize } = require('sequelize');

class AdminController {

    // Pagination Users
    static async getAllUsers(req, res) {
        const page = parseInt(req.query.page) || 1;
        const limit = 5;
        const offset = (page - 1) * limit;

        const { count, rows } = await User.findAndCountAll({
            limit,
            offset,
            attributes: ['id', 'name', 'email', 'role']
        });

        res.json({
            success: true,
            total: count,
            page,
            totalPages: Math.ceil(count / limit),
            data: rows
        });
    }

    // All Events
    static async getAllEvents(req, res) {
        const events = await Event.findAll({
            include: [{
                model: User,
                attributes: ['name']
            }]
        });

        res.json({
            success: true,
            data: events
        });
    }

    // Leaderboard With User Names
    static async getLeaderboard(req, res) {
        const leaderboard = await Referral.findAll({
            attributes: [
                'referrer_id',
                [Sequelize.fn('COUNT', Sequelize.col('referrer_id')), 'referral_count']
            ],
            include: [{
                model: User,
                as: 'Referrer',
                attributes: ['name', 'email']
            }],
            group: ['referrer_id', 'Referrer.id'],
            order: [[Sequelize.literal('referral_count'), 'DESC']]
        });

        res.json({
            success: true,
            data: leaderboard
        });
    }

    static async getReferralStats(req, res) {
        const totalReferrals = await Referral.count();
        const totalUsers = await User.count();

        res.json({
            success: true,
            totalUsers,
            totalReferrals
        });
    }
}

module.exports = AdminController;