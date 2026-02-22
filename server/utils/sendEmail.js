const nodemailer = require('nodemailer');
const dns = require('dns');

// Render sometimes has outbound IPv6 issues. This forces Node to prefer IPv4.
if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
}

const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER, // e.g., 'your-email@gmail.com'
                pass: process.env.EMAIL_PASS, // e.g., 'your-app-password'
            },
            connectionTimeout: 10000, // 10 seconds
            socketTimeout: 10000, // 10 seconds
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: subject,
            text: text,
        });

        console.log("Email sent successfully");
    } catch (error) {
        console.error("Email not sent", error);
        // Don't throw error to prevent crashing auth flow if email fails (dev mode)
    }
};

module.exports = sendEmail;
