import cron from 'node-cron';
import Booking from '../model/Booking.js';
import GuideProfile from '../model/GuideProfile.js';

const startBookingSafetyNet = () => {
    // Runs every day at 12:00 AM
    cron.schedule('0 0 * * *', async () => {
        console.log("Running Auto-Completion Safety Net...");
        try {
            const gracePeriod = new Date();
            gracePeriod.setDate(gracePeriod.getDate() - 3);

            // Find all confirmed bookings that are overdue
            const overdueBookings = await Booking.find({
                bookingStatus: 'confirmed',
                checkOut: { $lte: gracePeriod }
            });

            // Update all confirmed bookings that are overdue
            for (const booking of overdueBookings){
                booking.bookingStatus = 'completed';
                booking.activityLog.push({
                    type: "tour_completed",
                    message: "System auto-completed tour after 72-hour grace period."
                });

                await booking.save();

                // Update Guide Profile Stats
                await GuideProfile.findByIdAndUpdate(booking.guideId, {
                    $inc: {
                        totalEarnings: booking.guideEarnings, // Increment by the specific earnings for this trip
                        totalCompletedTrips: 1 // Increment by 1
                    }
                });
            }

            console.log("Auto-Completion Safety Net completed. (Processed " + overdueBookings.length + " bookings.)");
        } catch (error) {
            console.error("Error running Auto-Completion Safety Net:", error);
        }
    });
};

export default startBookingSafetyNet;