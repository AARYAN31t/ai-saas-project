const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendLoginNotification = async (email, name) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.warn('Email credentials missing, skipping login notification.');
            return;
        }

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Login Alert - Promptify',
            text: `Hello ${name},\n\nWe noticed a new login on your account. If this wasn't you, please reset your password immediately.\n\nBest,\nPromptify Team`
        });
        console.log(`Login email sent to ${email}`);
    } catch (error) {
        console.error('Email Error:', error.message);
    }
};

const sendLogoutNotification = async (email, name) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.warn('Email credentials missing, skipping logout notification.');
            return;
        }

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Logout Alert - Promptify',
            text: `Hello ${name},\n\nYou have successfully logged out.\n\nBest,\nPromptify Team`
        });
        console.log(`Logout email sent to ${email}`);
    } catch (error) {
        console.error('Email Error:', error.message);
    }
};

module.exports = { sendLoginNotification, sendLogoutNotification };
