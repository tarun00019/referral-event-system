const { User, Event, Referral } = require('../models');
const { Op, fn, col } = require('sequelize');

class DashboardController {

    // 👤 My Profile
    static async getProfile(req, res) {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'referral_code'],
      include: [
        {
          model: Referral,
          as: 'ReferralsGiven',
          include: [
            {
              model: User,
              as: 'ReferredUser',   // 🔥 MUST MATCH index.js
              attributes: ['id', 'name', 'email']
            }
          ]
        }
      ]
    });

    res.json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

    // 👤 My Events
    static async getMyEvents(req, res) {
        try {
            const events = await Event.findAll({
                where: { user_id: req.user.id }
            });

            res.json({
                success: true,
                total: events.length,
                data: events
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // 👤 My Referral Count
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

    // 👤 Referred Users List
    static async getMyReferrals(req, res) {
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
                total: referrals.length,
                data: referrals
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // 🛠 Admin: All Users (with pagination)
    static async getAllUsers(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 5;
            const offset = (page - 1) * limit;

            const { count, rows } = await User.findAndCountAll({
                attributes: { exclude: ['password'] },
                limit,
                offset
            });

            res.json({
                success: true,
                total: count,
                page,
                totalPages: Math.ceil(count / limit),
                data: rows
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // 🛠 Admin: All Events
    static async getAllEvents(req, res) {
        try {
            const events = await Event.findAll({
                include: [{
                    model: User,
                    attributes: ['id', 'name']
                }]
            });

            res.json({
                success: true,
                total: events.length,
                data: events
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // 🛠 Admin: Referral Statistics
    static async getReferralStats(req, res) {
        try {
            const totalUsers = await User.count();
            const totalReferrals = await Referral.count();
            const totalEvents = await Event.count();

            res.json({
                success: true,
                data: {
                    totalUsers,
                    totalReferrals,
                    totalEvents
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = DashboardController;