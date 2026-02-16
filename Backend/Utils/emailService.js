import sgMail from "@sendgrid/mail";

// Initialize SendGrid with API key from environment variables
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendNotificationEmail = async (email, subject, htmlContent) => {
    try {
        // Construct the email message
        const msg = {
            to: email,
            from: `"TourGuy Support" <${process.env.ADMIN_EMAIL}>`,
            subject: subject,
            html: htmlContent,
        };

        await sgMail.send(msg);

        console.log(`Email sent to ${email} with subject: ${subject}`);
    } catch (error) {
        console.error("Email Service Error:", error.message);
        throw new Error("Failed to send email");
    }
};