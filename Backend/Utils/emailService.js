import nodemailer from 'nodemailer';

export const sendNotificationEmail = async (email, subject, htmlContent) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.ADMIN_EMAIL,
                pass: process.env.PASSWORD,
            },
        });

        const mailOptions = {
            from: `"TourGuy Support" <${process.env.EMAIL}>`,
            to: email,
            subject: subject,
            html: htmlContent,
        };

        return await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Email Service Error:", error.message);
        throw new Error("Failed to send email");
    }
};