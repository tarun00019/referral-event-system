const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Referral = sequelize.define('Referral', {
    referrer_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    referred_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: true
});

module.exports = Referral;