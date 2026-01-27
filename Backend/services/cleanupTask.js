import cron from 'node-cron';
import GuideProfile from '../model/GuideProfile.js';
import User from '../model/User.js';
import { deleteFromCloudinary } from '../Utils/cloudinary.js';
import { sendNotificationEmail } from '../Utils/emailService.js';
import { getFinalDeletionTemplate } from '../Utils/emailTemplates.js';

const startGuideCleanup = () => {
    // Run every day at midnight
    cron.schedule('0 0 * * *', async () => {
        try {
            const now = new Date();

            // Find profiles where 7-day grace period has expired
            const expiredProfiles = await GuideProfile.find({
                status: 'scheduled_for_deletion',
                deletionExpiresAt: { $lte: now }
            }).populate('userId');

            // Iterate over expired profiles
            for (const profile of expiredProfiles) {

                // Delete Public Data from Cloudinary
                // We delete the Profile Photo to respect privacy/save space
                if (profile.profilePhoto?.public_id) {
                    await deleteFromCloudinary(profile.profilePhoto.public_id);
                }

                // Reset User role to tourist
                if (profile.userId) {
                    await User.findByIdAndUpdate(profile.userId._id, { role: 'tourist' });
                }

                // Send Final Confirmation Email
                const finalEmailHtml = getFinalDeletionTemplate(profile.fullName);
                if (profile.userId?.email) {
                    await sendNotificationEmail(
                        profile.userId.email,
                        "Update: Your Guide Profile has been deactivated",
                        finalEmailHtml
                    );
                }

                // Archive the Profile instead of hard-deleting from MongoDB
                // This keeps the document record but clears out non-essential data
                await GuideProfile.findByIdAndUpdate(profile._id, {
                    $set: {
                        status: 'rejected', // Reverting to rejected hides them from active lists
                        bio: "ACCOUNT DEACTIVATED - DOCUMENTS RETAINED FOR INTERNAL RECORDS",
                        profilePhoto: null, // Clear the photo object since we deleted it from Cloudinary
                        deletionExpiresAt: null // Stop the timer
                    }
                });

                console.log(`Cleanup: Archived guide profile ${profile._id}. Documents retained for security.`);
            }
        } catch (error) {
            console.error("Cleanup Task Error:", error);
        }
    });
};

export default startGuideCleanup;