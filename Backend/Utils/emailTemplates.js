// Template 1: Registration
export const getRegistrationTemplate = (fullName, email, username, password) => `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; border: 1px solid #eee; padding: 20px;">
        <h2 style="color: #2c3e50;">Welcome to the Team, ${fullName}!</h2>
        <p>Your application for <strong>Tour Guide</strong> has been successfully submitted.</p>
        <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #3498db;">
            <p><strong>Your Login Credentials:</strong></p>
            <p style="margin: 5px 0;">Email: ${email}</p>
            <p style="margin: 5px 0;">Username: ${username}</p>
            <p style="margin: 5px 0;">Password: <code style="background: #eee; padding: 2px 4px;">${password}</code></p>
        </div>
        <p>Please wait while our admin team reviews your documents. We will notify you once you are verified.</p>
        <p>Best Regards,<br/>The Support Team</p>
    </div>
`;

// Template 2: Update Status
export const getStatusUpdateTemplate = (fullName, status) => {
    const isApproved = status === 'approved';
    return `
    <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
        <h2 style="color: ${isApproved ? '#27ae60' : '#c0392b'};">Application ${status.toUpperCase()}</h2>
        <p>Dear ${fullName},</p>
        <p>Your status has been updated to: <strong>${status}</strong>.</p>
        ${isApproved
            ? '<p>You can now log in and start creating your tour profiles!</p>'
            : '<p>Unfortunately, your application did not meet our requirements at this time. Your uploaded data has been removed for privacy.</p>'}

        <p>Best Regards,<br/>The Support Team</p>
    </div>
`;
};

// Template 3: Deletion Request
export const getDeletionTemplate = (fullName, expiryDate) => `
    <div style="font-family: Arial, sans-serif; border-top: 5px solid #e74c3c; padding: 20px;">
        <h2 style="color: #c0392b;">Account Deletion Warning</h2>
        <p>Hello ${fullName},</p>
        <p>Your request to delete your account is being processed. It will be permanently wiped on:</p>
        <h3 style="background: #fdf2f2; display: inline-block; padding: 10px;">${expiryDate}</h3>
        <p>If you change your mind, you can reactivate your account by logging in within the next 7 days.</p>
        <p>Best Regards,<br/>The Support Team</p>
    </div>
`;

// Template 4: Reactivation Request
export const getReactivationTemplate = (fullName) => `
    <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: #27ae60;">Account Reactivated!</h2>
        <p>Hello ${fullName},</p>
        <p>Your account has been successfully reactivated. Your 7-day deletion countdown has been cancelled.</p>
        <p>You can continue using your account as usual.</p>
        <p>Best Regards,<br/>The Support Team</p>
    </div>
`;

// Template 5: Final Deletion
export const getFinalDeletionTemplate = (fullName) => `
    <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: #e74c3c;">Account Permanently Deleted</h2>
        <p>Hello ${fullName},</p>
        <p>As requested, your Guide Profile and all associated legal documents have been permanently deleted from our servers and storage.</p>
        <p>Your account has been reverted to a standard <strong>tourist</strong> role. If you wish to become a guide again in the future, you will need to submit a new application.</p>
        <p>Thank you for being part of our community.</p>
    </div>
`;

// Template 6: OTP send template
export const getOTPTemplate = (username, otp) => `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; border: 1px solid #eee; padding: 20px;">
        <h2 style="color: #2c3e50;">Password Reset Request</h2>
        <p>Hello ${username},</p>
        <p>You requested to reset your password. Use the 6-digit code below to proceed:</p>
        <div style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #3498db; border-radius: 8px;">
            ${otp}
        </div>
        <p>This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
        <p>Best Regards,<br/>The Support Team</p>
    </div>
`;

/* -------Booking Templates------- */
// Template 7: Booking Pending Confirmation for User
export const getBookingConfirmationTemplate = (booking, guide, destinationName) => `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; border: 1px solid #eee; padding: 20px;">
        <div style="text-align: center; border-bottom: 2px solid #00C4CC; padding-bottom: 10px;">
            <h2 style="color: #0F172A;">Payment Received!</h2>
            <p style="color: #e67e22; font-weight: bold;">Status: Awaiting Guide Confirmation</p>
        </div>
        <p>Dear ${booking.fullName},</p>
        <p>Your payment for the trip to <strong>${destinationName}</strong> was successful. We have notified your guide, <strong>${guide.fullName}</strong>, to confirm the availability.</p>
        
        <div style="background: #e0fbfc; padding: 20px; border-radius: 12px; margin: 20px 0; border: 2px dashed #00C4CC; text-align: center;">
            <h3 style="margin: 0; color: #0F172A; font-size: 16px;">YOUR TOUR COMPLETION PIN</h3>
            <div style="font-size: 32px; font-weight: bold; color: #00C4CC; margin: 10px 0; letter-spacing: 5px;">
                ${booking.completionPin}
            </div>
            <p style="font-size: 12px; color: #555; margin: 0;">
                <strong>IMPORTANT:</strong> Only provide this 6-digit PIN to your guide 
                <u>at the very end</u> of your tour once you are satisfied with the service.
            </p>
        </div>

        <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #ddd;">
            <h4 style="margin-top: 0; color: #00C4CC;">Booking Summary:</h4>
            <p style="margin: 5px 0;"><strong>Check-in:</strong> ${new Date(booking.checkIn).toDateString()}</p>
            <p style="margin: 5px 0;"><strong>Check-out:</strong> ${new Date(booking.checkOut).toDateString()}</p>
            <p style="margin: 5px 0;"><strong>Total Paid:</strong> ₹${booking.totalAmount}</p>
            <p style="margin: 5px 0;"><strong>Transaction ID:</strong> ${booking.transactionId}</p>
        </div>

        <p style="font-size: 14px; background: #fff4e5; padding: 10px; border-radius: 5px; border-left: 4px solid #e67e22;">
            <strong>What happens next?</strong> Once the guide accepts the request, you will receive a final confirmation email.
        </p>

        <p>Best Regards,<br/>The TourGuy Team</p>
    </div>
`;

// Template 8: New Booking Notification for Guide
export const getGuideAssignmentTemplate = (guide, booking, destinationName) => `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; border: 1px solid #eee; padding: 20px;">
        <h2 style="color: #27ae60;">Action Required: New Booking Request!</h2>
        <p>Hello ${guide.fullName},</p>
        <p>You have been assigned a new tour at <strong>${destinationName}</strong>.</p>
        
        <div style="background: #f4f4f4; padding: 15px; border-left: 4px solid #27ae60;">
            <p><strong>Tourist Details:</strong></p>
            <p style="margin: 5px 0;">Name: ${booking.fullName}</p>
            <p style="margin: 5px 0;">Email: ${booking.email}</p>
            <p style="margin: 5px 0;">Phone: ${booking.phoneNumber.countryCode} ${booking.phoneNumber.number}</p>
            <p style="margin: 5px 0;">Address: ${booking.address}</p>
            <p style="margin: 5px 0;">Adults & Children: ${booking.adults} adults, ${booking.children} children</p>
        </div>

        <p><strong>Tour Dates:</strong> ${new Date(booking.checkIn).toLocaleDateString()} to ${new Date(booking.checkOut).toLocaleDateString()}</p>
        
        <p>Please reach out to the tourist to introduce yourself and discuss any special requests.</p>
        <p>Best Regards,<br/>The Admin Team</p>
    </div>
`;

// Template 9: Admin Alert for New Booking
export const getAdminBookingAlertTemplate = (booking, guide) => `
    <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; border: 1px solid #ddd;">
        <h2 style="color: #2c3e50;">Payment Received - New Booking</h2>
        <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Booking ID:</strong></td><td>${booking._id}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Amount:</strong></td><td>₹${booking.totalAmount}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Tourist:</strong></td><td>${booking.fullName}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Guide:</strong></td><td>${guide.fullName}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Phone Number:</strong></td><td>${guide.phoneNumber.countryCode} ${guide.phoneNumber.number}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Transaction:</strong></td><td>${booking.transactionId}</td></tr>
        </table>
    </div>
`;

// Template 10: Email to Tourist when their guide is changed (Reassigned)
export const getGuideReassignmentTouristTemplate = (booking, newGuide, destinationName) => `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; border: 1px solid #eee; padding: 20px;">
        <div style="text-align: center; border-bottom: 2px solid #f39c12; padding-bottom: 10px;">
            <h2 style="color: #0F172A;">Trip Update: New Guide Assigned</h2>
        </div>
        <p>Dear ${booking.fullName},</p>
        <p>We are writing to inform you of a small update regarding your upcoming trip to <strong>${destinationName}</strong>.</p>
        <p>Your previously assigned guide is no longer available. To ensure your experience remains seamless, we have matched you with a new certified professional.</p>
        
        <div style="border: 1px solid #f39c12; padding: 15px; border-radius: 8px; background: #fffdf9;">
            <h4 style="margin-top: 0; color: #0F172A;">Your New Guide:</h4>
            <img src="${newGuide.profilePhoto.url}" alt="${newGuide.fullName}" style="width: 50px; height: 50px; border-radius: 50%; margin: 10px;">
            <p><strong>Name:</strong> ${newGuide.fullName}<br/>
            <strong>City:</strong> ${newGuide.city}<br/>
            <strong>Languages:</strong> ${newGuide.languages.join(", ")}<br/>
            <strong>Phone:</strong> ${newGuide.phoneNumber.countryCode} ${newGuide.phoneNumber.number}</p>
        </div>

        <p style="font-size: 14px; color: #555;">Don't worry! Your booking dates, destination, and payment remain exactly the same. Your new guide will be reaching out to you shortly.</p>
        <p>Best Regards,<br/>The TourGuy Team</p>
    </div>
`;

// Template 11: Email to the Tourist when the guide accepts the tour
export const getGuideAcceptanceTemplate = (booking, guide, destinationName) => `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; border: 1px solid #eee; padding: 20px;">
        <h2 style="color: #27ae60;">Your Guide is Ready!</h2>
        <p>Great news, ${booking.fullName}!</p>
        <div>
            <p>Your guide, <strong>${guide.fullName}</strong>, has officially confirmed your tour for <strong>${destinationName}</strong>.</p>
            <p>Below are the details of your guide:</p>
            <ul>
                <li><strong>City:</strong> ${guide.city}</li>
                <li><strong>Languages:</strong> ${guide.languages.join(", ")}</li>
                <li><strong>Phone:</strong> ${guide.phoneNumber.countryCode} ${guide.phoneNumber.number}</li>
            </ul>
        </div>

        <p style="color: #555; font-style: italic;">
            *Reminder: Keep your 6-digit Completion PIN ready to share with your guide at the end of the trip!
        </p>
        
        <p>Start your journey to <strong>${destinationName}</strong> and start preparing for your adventure.</p>
        <p>Best Regards,<br/>The TourGuy Team</p>
    </div>
`;

// Template 12: Admin Notification for Guide Reassignment
export const getAdminReassignmentAlertTemplate = (booking, oldGuide, newGuide) => `
    <div style="font-family: Arial, sans-serif; border-left: 4px solid #f39c12; padding: 20px; background: #fffcf5;">
        <h2 style="color: #d35400;">Log: Guide Reassigned</h2>
        <p>This is an automated log for Booking ID: <strong>${booking._id}</strong></p>
        <p><strong>Reason:</strong> Previous guide (${oldGuide.fullName}) rejected the request.</p>
        <p><strong>New Assigned Guide:</strong> ${newGuide.fullName} (${newGuide._id})</p>
        <hr/>
        <p>Tourist: ${booking.fullName}</p>
    </div>
`;

// Template 13: Tourist Notification for Reassignment Failure (Refund Info)
export const getReassignmentFailureTouristTemplate = (booking, destinationName) => `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; border: 1px solid #eee; padding: 20px;">
        <h2 style="color: #e74c3c;">Important: Trip Update</h2>
        <p>Dear ${booking.fullName},</p>
        <p>We apologize, but we are currently unable to match you with a certified guide for your trip to <strong>${destinationName}</strong> on the selected dates.</p>
        <div style="background: #fdf2f2; padding: 15px; border-radius: 8px; border: 1px solid #e74c3c;">
            <p style="margin: 0; font-weight: bold; color: #c0392b;">What happens now?</p>
            <p>Our team has initiated a **full refund** for your payment of ₹${booking.totalAmount}. The amount will be credited back to your original payment method within 5-7 business days.</p>
        </div>
        <p>We value your trust and would love to help you plan a future trip with a different schedule.</p>
        <p>Best Regards,<br/>The TourGuy Team</p>
    </div>
`;

// Template 14: Admin Notification for Reassignment Failure (Urgent Action)
export const getAdminReassignmentFailureTemplate = (booking) => `
    <div style="font-family: Arial, sans-serif; border: 2px solid #e74c3c; padding: 20px; background: #fff5f5;">
        <h2 style="color: #c0392b;">🚨 URGENT: Manual Intervention Required</h2>
        <p><strong>Booking ID:</strong> ${booking._id}</p>
        <p><strong>Issue:</strong> A guide rejected the request and 0 replacements were found matching the language: <em>${booking.languages.join(", ")}</em>.</p>
        <p><strong>Action Items:</strong></p>
        <ul>
            <li>Check if any guides can be manually assigned.</li>
            <li>If not, verify the <strong>Refund</strong> status for Transaction ID: ${booking.transactionId}.</li>
            <li>Tourist Contact: ${booking.email}</li>
        </ul>
    </div>
`;