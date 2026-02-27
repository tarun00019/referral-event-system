const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Image = sequelize.define('Image', {
    event_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    image_url: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true
});

module.exports = Image;