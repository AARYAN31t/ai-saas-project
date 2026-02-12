const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma');
const { sendLoginNotification, sendLogoutNotification } = require('../services/emailService');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await prisma.user.findUnique({ where: { email } });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
        data: { name, email, password: hashedPassword }
    });

    if (user) {
        res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            tokens: user.tokens,
            token: generateToken(user.id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
        // Send login notification
        sendLoginNotification(user.email, user.name);

        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            tokens: user.tokens,
            plan: user.plan,
            token: generateToken(user.id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
};

const getProfile = async (req, res) => {
    const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { id: true, name: true, email: true, tokens: true, plan: true }
    });

    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
};

const logoutUser = async (req, res) => {
    // Assuming 'protect' middleware adds req.user
    if (req.user) {
        sendLogoutNotification(req.user.email, req.user.name);
        res.json({ message: 'Logged out successfully' });
    } else {
        res.status(401).json({ message: 'Not authorized' });
    }
};

module.exports = { registerUser, loginUser, getProfile, logoutUser };
