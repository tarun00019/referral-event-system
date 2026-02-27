const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Event = sequelize.define('Event', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING,
        unique: true
    },
    description: {
        type: DataTypes.TEXT
    },
    meta_title: {
        type: DataTypes.STRING
    },
    meta_description: {
        type: DataTypes.TEXT
    }
}, {
    timestamps: true
});

module.exports = Event;