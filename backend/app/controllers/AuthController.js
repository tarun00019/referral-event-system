const AuthService = require('../services/AuthService');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

class AuthController {

    static register = asyncHandler(async (req, res) => {

        const user = await AuthService.register(req.body);

        if (!user) {
            throw new AppError('Registration failed', 400);
        }

        const { password, ...safeUser } = user.toJSON();

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: safeUser
        });
    });

    static login = asyncHandler(async (req, res) => {

        const result = await AuthService.login(req.body);

        if (!result) {
            throw new AppError('Invalid credentials', 401);
        }

        const { password, ...safeUser } = result.user.toJSON();

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token: result.token,
            user: safeUser
        });
    });
}

module.exports = AuthController;