import express from "express";
import { razorpay } from "../Utils/razorpay.js";
import crypto from "crypto";
import Booking from "../model/Booking.js";
import GuideProfile from "../model/GuideProfile.js";
import { sendNotificationEmail } from "../Utils/emailService.js";
import {
    getBookingConfirmationTemplate,
    getGuideAssignmentTemplate,
    getAdminBookingAlertTemplate,
    getGuideReassignmentTouristTemplate,
    getGuideAcceptanceTemplate,
    getAdminReassignmentAlertTemplate,
    getReassignmentFailureTouristTemplate,
    getAdminReassignmentFailureTemplate
} from "../Utils/emailTemplates.js";
import authorizeAdmin from "../middleware/authorizeAdmin.js";
import { uploadToCloudinary } from "../Utils/cloudinary.js";
import upload from "../middleware/imageUpload.js";

const router = express.Router();

// Helper function to find a replacement guide
const findReplacementGuide = async (languages, excludedGuideId, checkIn, checkOut) => {
    const langArray = Array.isArray(languages) ? languages : languages.split(',');

    // Find IDs of all guides who are already booked for these dates
    const busyBookings = await Booking.find({
        bookingStatus: { $in: ['confirmed', 'pending_guide_confirmation'] },
        $or: [
            {
                checkIn: { $lt: new Date(checkOut) },
                checkOut: { $gt: new Date(checkIn) }
            }
        ]
    }).select('guideId');

    const busyGuideIds = busyBookings.map(b => b.guideId);

    const replacement = await GuideProfile.findOne({
        status: 'approved',
        isAvailable: true,
        _id: { $ne: excludedGuideId, $nin: busyGuideIds }, // Don't pick the same guide again
        languages: { $in: langArray.map(lang => new RegExp(lang.trim(), 'i')) }
    });

    return replacement || await GuideProfile.findOne({
        status: 'approved',
        isAvailable: true,
        languages: { $in: [/english/i] }
    });
};

// Routes 1: Create Order by POST "/api/booking/create-order"
router.post("/create-order", async (req, res) => {
    try {
        const { amount } = req.body;

        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: "receipt_" + Date.now()
        };

        const order = await razorpay.orders.create(options);
        res.json({ success: true, order: order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

// Routes 2: Verify Payment by POST "/api/booking/verify-payment"
router.post("/verify-payment", upload.single("document"), async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            destinationName,
            email,
            checkIn,
            checkOut,
            languages,
            selectedGuideId,
        } = req.body;


        // Verify Signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        // Check if signature is valid or not
        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, error: "Payment Failed" });
        }

        // Upload Document to Cloudinary only AFTER successful payment
        if (!req.file) {
            return res.status(400).json({ success: false, error: "Document file missing" });
        }

        // Upload document to cloudnary
        let uploadResult;
        try {
            uploadResult = await uploadToCloudinary(
                req.file.buffer,
                "bookings/documents",
                "image"
            );
        } catch (err) {
            console.error("CLOUDINARY ERROR:", err);
            return res.status(500).json({
                success: false,
                error: "Document upload failed"
            });
        }

        // Get Busy Guides for these specific dates
        const busyBookings = await Booking.find({
            bookingStatus: { $in: ['confirmed', 'pending_guide_confirmation'] },
            $or: [
                {
                    checkIn: { $lt: new Date(checkOut) },
                    checkOut: { $gt: new Date(checkIn) }
                }
            ]
        }).select('guideId');

        // Find busy guides id
        const busyGuideIds = busyBookings.map(b => b.guideId.toString());

        // Find available guides for the selected languages (manually selected)
        let finalGuideId = selectedGuideId || null;

        // Check if the manually selected guide is still available
        if (finalGuideId && busyGuideIds.includes(finalGuideId.toString())) {
            finalGuideId = null;
        }

        // If no guide or selected guide is offline, find an available one
        if (!finalGuideId) {
            const userLangs = Array.isArray(languages) ? languages : languages.split(',').map(l => l.trim());
            const availableGuides = await GuideProfile.find({
                status: 'approved',
                isAvailable: true,
                _id: { $nin: busyGuideIds }, // EXCLUDE BUSY GUIDES
                languages: {
                    $in: userLangs.map(lang => new RegExp(lang, 'i'))
                }
            })

            // If at least one match, return a random guide
            if (availableGuides.length > 0) {
                const randomGuide = availableGuides[Math.floor(Math.random() * availableGuides.length)];
                finalGuideId = randomGuide._id;
            } else {
                // If no match, find a fallback (e.g., English guides)
                const fallbackGuide = await GuideProfile.findOne({
                    status: 'approved',
                    isAvailable: true,
                    _id: { $nin: busyGuideIds }, // EXCLUDE BUSY GUIDES
                    languages: { $in: [/english/i] }
                });

                finalGuideId = fallbackGuide ? fallbackGuide._id : null;
            }
        }

        const completionPin = Math.floor(100000 + Math.random() * 900000).toString();

        // Create a new booking
        const finalBookingData = {
            ...req.body,
            completionPin,
            phoneNumber: {
                countryCode: req.body.countryCode,
                number: req.body.number
            },
            alternateNumber: {
                countryCode: req.body.altCountryCode || req.body.countryCode,
                number: req.body.altNumber || req.body.number
            },
            document: {
                url: uploadResult.url,
                public_id: uploadResult.public_id
            },
            guideId: finalGuideId,
            paymentStatus: "paid",
            bookingStatus: "pending_guide_confirmation",
            transactionId: razorpay_payment_id,
            activityLog: [
                {
                    type: "payment_success",
                    message: `Payment successful. Transaction ID: ${razorpay_payment_id}`
                },
                {
                    type: "booking_created",
                    message: "Booking created and guide assignment started"
                }
            ]
        };

        const booking = await Booking.create(finalBookingData);

        res.status(200).json({
            success: true,
            bookingId: booking._id
        });

        // Send Emails asynchronously after creating the booking
        setImmediate(async () => {
            try {
                // Find the guide
                const guide = finalGuideId ? await GuideProfile.findById(finalGuideId).populate('userId') : null;

                // Tourist email
                const bookingConfirmationHtml = getBookingConfirmationTemplate(booking, guide, destinationName);
                await sendNotificationEmail(email, "Booking Confirmed! - TourGuy", bookingConfirmationHtml);

                // Guide email
                if (guide?.userId?.email) {
                    const guideAssignmentHtml = getGuideAssignmentTemplate(guide, booking, destinationName);
                    await sendNotificationEmail(guide.userId.email, "New Tour Assignment - Action Required", guideAssignmentHtml);
                }

                // Admin email
                if (process.env.ADMIN_EMAIL) {
                    const adminBookingAlertHtml = getAdminBookingAlertTemplate(booking, guide);
                    await sendNotificationEmail(process.env.ADMIN_EMAIL, "💰 Revenue Alert: New Successful Booking", adminBookingAlertHtml);
                }
            } catch (error) {
                console.error("Email Error:", error.message);
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Routes 3: Guide accepts or rejects booking by POST "/api/booking/handle-request/:bookingId"
router.patch("/handle-request/:bookingId", async (req, res) => {
    const { action, destinationName } = req.body; // 'accept' or 'reject'

    try {
        // Find the booking
        const booking = await Booking.findById(req.params.bookingId).populate('destinationId');

        // Check if booking exists
        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }

        // when action is 'accept'
        if (action === 'accept') {
            booking.bookingStatus = 'confirmed';
            booking.activityLog.push({
                type: "guide_accepted",
                message: "Guide accepted the tour request"
            });

            await booking.save();

            // Find the guide
            const guide = await GuideProfile.findById(booking.guideId);

            // Notify Tourist: Guide has accepted
            const acceptanceHtml = getGuideAcceptanceTemplate(booking, guide, destinationName);
            await sendNotificationEmail(booking.email, "Your Guide has Confirmed! - TourGuy", acceptanceHtml);

            return res.json({ success: true, message: "Tour confirmed!" });
        }

        // when Action is 'reject'
        if (action === 'reject') {
            const oldGuideId = booking.guideId;
            const oldGuide = await GuideProfile.findById(oldGuideId);

            // FIND NEW GUIDE RANDOMLY
            const newGuide = await findReplacementGuide(booking.languages, oldGuideId);

            if (newGuide) {
                booking.guideId = newGuide._id;
                booking.originalGuideId = oldGuideId;
                booking.bookingStatus = 'pending_guide_confirmation';
                booking.activityLog.push({
                    type: "guide_reassigned",
                    message: `Guide reassigned from ${oldGuide.fullName} to ${newGuide.fullName}`
                });

                await booking.save();

                const populatedNewGuide = await GuideProfile.findById(newGuide._id).populate('userId');

                // Notify Tourist: Guide has changed
                const reassignmentHtml = getGuideReassignmentTouristTemplate(booking, newGuide, destinationName);
                await sendNotificationEmail(booking.email, "Important Update: Your Guide has been Reassigned", reassignmentHtml);

                // Notify NEW Guide: They have a new pending request
                const guideAssignmentHtml = getGuideAssignmentTemplate(populatedNewGuide, booking, destinationName);
                await sendNotificationEmail(populatedNewGuide.userId.email, "New Urgent Tour Assignment", guideAssignmentHtml);

                // Notify Admin: Mail to admin
                const adminAssignmentHtml = getAdminReassignmentAlertTemplate(booking, oldGuide, newGuide);
                await sendNotificationEmail(process.env.ADMIN_EMAIL, "Guide Reassigned!", adminAssignmentHtml);

                return res.json({ success: true, message: "Request rejected. Reassigned to " + newGuide.fullName });
            } else {
                // FAILURE LOGIC (No guide found)
                booking.bookingStatus = 'cancelled';
                booking.activityLog.push({
                    type: "tour_cancelled",
                    message: "Guide rejected the tour request and no replacements found. Refund process initiated."
                });

                await booking.save();

                // 1. Notify Tourist about the failure and refund
                const reassignmentFailureHtml = getReassignmentFailureTouristTemplate(booking, destinationName);
                await sendNotificationEmail(booking.email, "Unable to confirm your tour - Refund Initiated", reassignmentFailureHtml);

                // 2. Notify Admin to handle refund/manual check
                const adminReassignmentFailureHtml = getAdminReassignmentFailureTemplate(booking);
                await sendNotificationEmail(process.env.ADMIN_EMAIL, "🚨 ALERT: Reassignment Failed", adminReassignmentFailureHtml);

                return res.json({ success: false, error: "No replacements found. Refund process initiated." });
            }
        }
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
});

// Routes 4: Get all bookings by GET "/api/booking/all-bookings"
// Only admin can access this route
router.get("/all-bookings", authorizeAdmin, async (req, res) => {
    try {
        const bookings = await Booking.find({});
        res.json({ success: true, count: bookings.length, bookings: bookings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

// Routes 5: Get History for user by GET "/api/booking/user-history/:id"
router.get("/tourist-history/:userId", async (req, res) => {
    try {
        const bookingsHistory = await Booking.find({ userId: req.params.userId }).populate('destinationId guideId');
        res.json({ success: true, count: bookingsHistory.length, bookings: bookingsHistory });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Routes 6: Get History for guide by GET "/api/booking/guide-history/:id"
router.get("/guide-history/:userId", async (req, res) => {
    try {
        // Get guide profile
        const profile = await GuideProfile.findOne({ userId: req.params.userId });

        // If guide profile not found
        if (!profile) {
            return res.status(404).json({ success: false, error: "Guide profile not found" });
        }

        // Get guide history
        const bookingsHistory = await Booking.find({
            $or: [
                { guideId: profile._id },
                { originalGuideId: profile._id }
            ]
        }).populate('destinationId').sort({ createdAt: -1 });

        res.json({ success: true, count: bookingsHistory.length, bookingsHistory: bookingsHistory });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Routes 7: Today total bookings by GET "/api/booking/today-bookings"
// Admin can access this route
router.get("/today-bookings", async (req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const todayBookings = await Booking.find({
            bookingStatus: "confirmed",
            createdAt: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        })
            .populate('destinationId guideId userId')
            .sort({ createdAt: -1 });

        res.json({ success: true, count: todayBookings.length, todayBookings: todayBookings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Routes 8: Get Revenue & Trends by GET "/api/booking/revenue-stats"
// Admin can access this route
router.get("/revenue-stats", authorizeAdmin, async (req, res) => {
    try {
        const stats = await Booking.aggregate([
            { $match: { paymentStatus: "paid" } },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalAmount" },
                    count: { $sum: 1 }
                }
            }
        ]);
        res.json({ success: true, stats: stats[0] || { totalRevenue: 0, count: 0 } });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Routes 9: Get Guide stats by GET "/api/booking/guide-stats/:userId"
router.get("/guide-stats/:userId", async (req, res) => {
    try {
        // Get guide profile
        const profile = await GuideProfile.findOne({ userId: req.params.userId });

        // If guide profile not found
        if (!profile) {
            return res.status(404).json({ success: false, error: "Guide profile not found" });
        }

        const stats = await Booking.aggregate([
            {
                $match: {
                    guideId: profile._id
                },
            },

            {
                $group: {
                    _id: null,
                    totalRequests: { $sum: 1 },
                    completedTours: {
                        $sum: { $cond: [{ $eq: ["$bookingStatus", "completed"] }, 1, 0] },
                    },
                    rejectedTours: {
                        $sum: { $cond: [{ $eq: ["$bookingStatus", "rejected_by_guide"] }, 1, 0] },
                    },
                    earnings: {
                        $sum: { $cond: [{ $eq: ["$bookingStatus", "completed"] }, "$totalAmount", 0] },
                    }
                }
            }
        ]);

        const result = stats[0] || {
            totalRequests: 0,
            completedTours: 0,
            rejectedTours: 0,
            earnings: 0
        };

        res.json({ success: true, stats: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Stats calculation failed" });
    }
});

// Routes 10: Get active (pending) requests for a specific guide by GET "/api/booking/active-requests/:userId"
router.get("/active-requests/:userId", async (req, res) => {
    try {
        // Find guide profile
        const profile = await GuideProfile.findOne({ userId: req.params.userId });

        // Check Guide profile exist or not
        if (!profile) {
            return res.status(404).json({ success: false, error: "Guide profile not found" })
        }

        const activeRequests = await Booking.find({
            guideId: profile._id,
            bookingStatus: "pending_guide_confirmation"
        }).sort({ createdAt: -1 });

        res.json({ success: true, requests: activeRequests });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
})

// Routes 11: Mark tour as Completed and update guide stats by PATCH "/api/booking/complete-tour/:bookingId"
router.patch("/complete-tour/:bookingId", async (req, res) => {
    try {
        const { pin } = req.body;

        // Find the booking
        const booking = await Booking.findById(req.params.bookingId);

        // Check if booking exists
        if (!booking || booking.bookingStatus !== 'confirmed') {
            return res.status(400).json({ success: false, error: "Tour cannot be completed" });
        }

        // Verify Completion PIN
        if(booking.completionPin !== pin) {
            return res.status(401).json({ success: false, error: "Invalid Completion PIN provided by tourist." });
        }

        // Update Booking Status
        booking.bookingStatus = 'completed';
        booking.activityLog.push({
            type: "tour_completed",
            message: "Tour completed successfully."
        });

        await booking.save();

        // Update Guide Profile Stats
        await GuideProfile.findByIdAndUpdate(booking.guideId, {
            $inc: {
                totalEarnings: booking.guideEarnings, // Increment by the specific earnings for this trip
                completedToursCount: 1                // Increment tour count by 1
            }
        });

        res.json({ success: true, message: "Tour successfully completed and stats updated!" });
    } catch (error) {
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

// Routes 12: Get Guide recent activity by GET "/api/booking/recent-activity/:userId"
router.get("/recent-activity/:userId", async (req, res) => {
    try {
        // Find guide profile
        const profile = await GuideProfile.findOne({ userId: req.params.userId });

        // Check Guide profile exist or not
        if (!profile) {
            return res.status(404).json({ success: false, error: "Guide profile not found" })
        }

        // Find last 5 recent activity for guide 
        const recentActivity = await Booking.find({
            $or: [
                { guideId: profile._id },
                { originalGuideId: profile._id }
            ]
        })
            .sort({ updatedAt: -1 })
            .limit(5);

        // Map recent activity
        const mappedActivities = recentActivity.map((activity) => {
            let type = activity.bookingStatus;
            let message = "";

            // Set message based on type
            if (type === 'pending_guide_confirmation') {
                message = `New request from ${activity.fullName}`;
            }
            else if (type === 'confirmed') {
                message = `Tour with ${activity.fullName} confirmed`;
            }
            else if (type === 'completed') {
                message = `Tour with ${activity.fullName} completed`;
            }
            else if (type === 'rejected_by_guide') {
                message = `Request from ${activity.fullName} was declined`;
            }

            return {
                id: activity._id,
                type,
                message,
                time: activity.updatedAt,
                status: type
            };
        });

        res.json({ success: true, activities: mappedActivities });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

// Routes 13: Get full booking activity log by GET "/api/booking/activity-log/:bookingId"
// Only admin can access this route
router.get("/activity-log/:bookingId", authorizeAdmin, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.bookingId)
            .populate("guideId userId destinationId");

        if (!booking) {
            return res.status(404).json({ success: false, error: "Booking not found" });
        }

        res.json({
            success: true,
            bookingSummary: {
                fullName: booking.fullName,
                email: booking.email,
                destination: booking.destinationName,
                amount: booking.totalAmount,
                status: booking.bookingStatus,
                transactionId: booking.transactionId,
                guide: booking.guideId
                    ? booking.guideId.fullName
                    : "Not Assigned"
            },
            activities: booking.activityLog.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            )
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

export default router;