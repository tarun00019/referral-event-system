const User = require('./User');
const Referral = require('./Referral');
const Event = require('./Event');
const Image = require('./Image');

const applyAssociations = () => {

    // User → Events
    User.hasMany(Event, { foreignKey: 'user_id' });
    Event.belongsTo(User, { foreignKey: 'user_id' });

    // Event → Images
    Event.hasMany(Image, { foreignKey: 'event_id' });
    Image.belongsTo(Event, { foreignKey: 'event_id' });

    // Referral → User (Referrer & Referred)
    Referral.belongsTo(User, {
        foreignKey: 'referrer_id',
        as: 'Referrer'
    });

    Referral.belongsTo(User, {
        foreignKey: 'referred_id',
        as: 'ReferredUser'
    });

    User.hasMany(Referral, {
        foreignKey: 'referrer_id',
        as: 'ReferralsGiven'
    });

    User.hasMany(Referral, {
        foreignKey: 'referred_id',
        as: 'ReferralsReceived'
    });
};
module.exports = {
    User,
    Referral,
    Event,
    Image,
    applyAssociations
};