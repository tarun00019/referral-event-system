const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Referral } = require('../models');

class AuthService {

    static generateReferralCode() {
        return 'REF' + Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    static async register(data) {
        const { name, email, password, referral_code } = data;

        // Check existing user
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            throw new Error('Email already registered');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate referral code
        const newReferralCode = this.generateReferralCode();

        // Create user
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            referral_code: newReferralCode
        });

        // If user registered using referral code
        if (referral_code) {
            const referrer = await User.findOne({
                where: { referral_code }
            });

            if (referrer) {
                await Referral.create({
                    referrer_id: referrer.id,
                    referred_id: newUser.id
                });
            }
        }

        return newUser;
    }

    static async login(data) {
    const { email, password } = data;

    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    return { user, token };
}
}

module.exports = AuthService;