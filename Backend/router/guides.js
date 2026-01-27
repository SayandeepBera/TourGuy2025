import express from 'express';
import upload from '../middleware/imageUpload.js';
import { body, validationResult } from 'express-validator';
import User from '../model/User.js';
import GuideProfile from '../model/GuideProfile.js';
import bcrypt from 'bcryptjs';
import { uploadToCloudinary, deleteFromCloudinary } from '../Utils/cloudinary.js';
import authorizeAdmin from '../middleware/authorizeAdmin.js';
import { sendNotificationEmail } from '../Utils/emailService.js';
import {
    getRegistrationTemplate,
    getStatusUpdateTemplate,
    getDeletionTemplate,
    getReactivationTemplate
} from '../Utils/emailTemplates.js';
import Booking from '../model/Booking.js';

const router = express.Router();

// ---- Cloudinary Cleanup Helper ----
const deleteGuideFiles = async (profile) => {
    // Delete Profile Photo
    if (profile.profilePhoto?.public_id) {
        await deleteFromCloudinary(profile.profilePhoto.public_id);
    }
    // Delete Documents
    if (profile.documents && profile.documents.length > 0) {
        for (const doc of profile.documents) {
            await deleteFromCloudinary(doc.public_id);
        }
    }
};

// ---- Guide validation ----
const guidesRegistrationValidator = [
    body("username", "Username is required").notEmpty().trim(),
    body("email", "Valid email is required").isEmail().normalizeEmail(),
    body("password", "Password must be at least 6 characters").isLength({ min: 6 }),
    body("fullName", "Full name is required").notEmpty().trim(),
    body("countryCode", "Country code is required").notEmpty(),
    body("number", "Phone number is required").notEmpty(),
    body("age", "Age must be a number and at least 18").isNumeric().isInt({ min: 18 }),
    body("gender", "Gender is required").notEmpty(),
    body("city", "City is required").notEmpty().trim(),
    body("country", "Country is required").notEmpty().trim(),
    body("languages", "Languages are required").notEmpty(),
    body("bio", "Biography must be at least 20 characters").isLength({ min: 20 })
]

// Routes 1 : Register a new guide by POST "/api/guides/register"
router.post('/register', upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'documents', maxCount: 5 }
]), guidesRegistrationValidator, async (req, res) => {
    // Check validation error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    let success = false;

    try {
        const { username, email, password, fullName, countryCode, number, age, gender, city, country, languages, bio } = req.body;

        // Check if username OR email already exists
        const existingUser = await User.findOne({
            $or: [
                { username: username },
                { email: email }
            ]
        });

        // Check if username OR email already exists
        if (existingUser) {
            return res.status(400).json({ success, error: "A user with this username or email already exists." });
        }

        // Check profile photo is uploaded or not
        if (!req.files?.profilePhoto) {
            return res.status(400).json({ success, error: "Profile photo is required." });
        }

        // Check documents are uploaded or not
        if (!req.files?.documents || req.files.documents.length === 0) {
            return res.status(400).json({ success, error: "At least one document is required." });
        }

        // To hash a password and store in DB
        const salt = await bcrypt.genSalt(10);
        const securePassword = await bcrypt.hash(password, salt);

        // Create new user and save data into database
        const newUser = await User.create({
            username,
            email,
            password: securePassword,
            role: 'pending_guide'
        });

        // Upload profile photo to cloudinary
        const photoFile = req.files.profilePhoto[0];
        const uploadedPhoto = await uploadToCloudinary(photoFile.buffer, "guides/profile", "image");

        // Upload documents to cloudinary as images
        const uploadedDocs = await Promise.all(
            req.files.documents.map(async (file) => {
                // Every file is now treated strictly as an image
                const uploadResult = await uploadToCloudinary(
                    file.buffer,
                    "guides/documents",
                    "image"
                );

                return {
                    url: uploadResult.url,
                    public_id: uploadResult.public_id,
                    format: uploadResult.format,
                };
            })
        );

        // Create new guide profile
        const newProfile = await GuideProfile.create({
            userId: newUser._id,
            fullName,
            phoneNumber: {
                countryCode: countryCode,
                number: number
            },
            age,
            gender,
            city,
            country,
            languages: languages.split(',').map(l => l.trim()),
            bio,
            profilePhoto: uploadedPhoto,
            documents: uploadedDocs,
            status: 'pending'
        });

        // Send verification email
        const emailHtml = getRegistrationTemplate(fullName, email, username, password);
        await sendNotificationEmail(email, "Application Received", emailHtml);

        res.status(201).json({
            success: true,
            message: "Application submitted successfully. Please wait for verification.",
            guideId: newProfile._id,
            role: newUser.role
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success, error: "Internal Server Error" });
    }
});

// Routes 2 : Get all guides by GET "/api/guides/allguides"
// Only admin can access this route
router.get('/allguides', authorizeAdmin, async (req, res) => {
    let success = false;

    try {
        // Get all guides
        const guides = await GuideProfile.find({})
            .populate('userId', 'username email')
            .sort({ createdAt: -1 });

        res.json({ success: true, count: guides.length, guides: guides });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success, error: "Internal Server Error" });
    }
});

// Routes 3 : Get all pending guides by GET "/api/guides/pendingguides"
// Only admin can access this route
router.get('/pendingguides', authorizeAdmin, async (req, res) => {
    let success = false;

    try {
        // Get all pending guides
        const pendingGuides = await GuideProfile.find({ status: 'pending' })
            .populate('userId', 'username email')
            .sort({ createdAt: -1 });

        res.json({ success: true, count: pendingGuides.length, pendingGuides: pendingGuides });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success, error: "Internal Server Error" });
    }
});

// Routes 4 : Get all approved guides by GET "/api/guides/approvedguides"
router.get('/approvedguides', async (req, res) => {
    let success = false;
    try {
        // Get all approved guides
        const approvedGuides = await GuideProfile.find({ status: 'approved' })
            .populate('userId', 'username email')
            .sort({ createdAt: -1 });

        res.json({ success: true, count: approvedGuides.length, approvedGuides: approvedGuides });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success, error: "Internal Server Error" });
    }

});

// Routes 5 : Approve or Reject a guide application by PATCH "/api/guides/status/:id"
// Only admin can access this route
router.patch('/status/:id', authorizeAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ success: false, error: "Invalid status update." });
        }

        // Get guide profile
        const profile = await GuideProfile.findById(req.params.id).populate('userId');

        // If guide profile not found
        if (!profile) {
            return res.status(404).json({ success: false, error: "Guide profile not found." })
        };

        // Update guide profile status
        const newRole = status === 'approved' ? 'approved_guide' : 'tourist';

        // Check status and delete files
        if (status === 'rejected') {
            await deleteGuideFiles(profile);
            await GuideProfile.findByIdAndDelete(req.params.id);
        } else if (status === 'approved') {
            profile.status = 'approved';
            await profile.save();
        }

        // Update user role and get the document
        const updatedUser = await User.findByIdAndUpdate(profile.userId._id, { role: newRole }, { new: true });

        // Send status update email
        const statusHtml = getStatusUpdateTemplate(profile.fullName, status);
        await sendNotificationEmail(profile.userId.email, "Application Status Update", statusHtml);

        res.json({
            success: true,
            updatedUser,
            newRole: newRole,
            message: `Guide application has been ${status}. User role updated to ${newRole}.`
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

// Routes 6 : Delete Account(7-days grace period) by DELETE "/api/guides/delete-account/:id"
// Admin and guide can access this route
router.delete('/delete-account/:id', async (req, res) => {
    let success = false;

    try {
        // Get guide profile
        const profile = await GuideProfile.findById(req.params.id).populate('userId');

        // If guide profile not found
        if (!profile) {
            return res.status(404).json({ success, error: "Profile not found." });
        }

        // 7-days grace period
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + 7);

        // Update guide profile
        profile.status = 'scheduled_for_deletion';
        profile.deletionExpiredAt = expiry;
        await profile.save();

        // Send deletion email
        const expiryStr = expiry.toDateString();
        const deleteHtml = getDeletionTemplate(profile.fullName, expiryStr);
        await sendNotificationEmail(profile.userId.email, "Action Required: Account Deletion", deleteHtml);

        res.json({ success: true, message: "Account is successfully scheduled for deletion" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success, error: "Internal Server Error" });
    }
});

// Routes 7 : Reactivate Account by POST "/api/guides/reactivate-account/:id"
// Admin and guide can access this route
router.post('/reactivate-account/:id', async (req, res) => {
    let success = false;

    try {
        const profile = await GuideProfile.findById(req.params.id).populate('userId');

        // Check status is valid
        if (profile.status !== 'scheduled_for_deletion') {
            return res.status(400).json({ success, error: "Account is not scheduled for deletion." });
        }

        // Update guide profile
        profile.status = 'approved'; // or keep previous status
        profile.deletionExpiredAt = null;
        await profile.save();

        // Send reactivation email
        const reactivationHtml = getReactivationTemplate(profile.fullName);
        await sendNotificationEmail(profile.userId.email, "Account Successfully Reactivated", reactivationHtml);

        res.json({ success: true, message: "Account reactivated successfully." });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Routes 8 : Today Pending Guides by GET "/api/guides/todaypendingguides"
// Only admin can access this route
router.get('/todaypendingguides', authorizeAdmin, async (req, res) => {
    let success = false;

    try {
        // Get today pending guides
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        // Get today pending requests
        const todayPendingRequests = await GuideProfile.find({
            status: 'pending',
            createdAt: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        })
            .populate('userId', 'username email')
            .sort({ createdAt: -1 });

        res.json({ success: true, count: todayPendingRequests.length, todayPendingRequests: todayPendingRequests });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success, error: "Internal Server Error" });
    }
});

// Routes 9: Total number of users
// Only admin can access this route
router.get('/totalusers', async (req, res) => {
    let success = false;

    try {
        const totalUsers = await User.find({ role: 'tourist' });
        res.json({ success: true, count: totalUsers.length, totalUsers: totalUsers });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success, error: "Internal Server Error" });
    }
});

// Routes 10: Toggle Availability by PATCH "/api/guides/toggle-availability/:id"
router.patch('/toggle-availability/:id', async (req, res) => {
    try {
        const profile = await GuideProfile.findOne({ userId: req.params.id });
        if (!profile) {
            return res.status(404).json({ success: false, error: "Profile not found" });
        }

        // Toggle availability
        profile.isAvailable = !profile.isAvailable;
        await profile.save();

        res.json({ success: true, isAvailable: profile.isAvailable, message: `You are now ${profile.isAvailable ? 'Online' : 'Offline'}` });
    } catch (error) {
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

// Routes 11: Get guide profile active or not
router.get('/sync-availability/:userId', async (req, res) => {
    try {
        const profile = await GuideProfile.findOne({ userId: req.params.userId });
        if (!profile) {
            return res.status(404).json({ success: false, message: "Profile not found" });
        }

        res.json({ success: true, isAvailable: profile.isAvailable });
    } catch (error) {
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

// Routes 12: Check guides availability by POST "/api/guides/check-availability"
router.post("/check-availability", async (req, res) => {
    try {
        const { languages, checkIn, checkOut } = req.body;

        // Check check-in check-out date 
        if (!checkIn || !checkOut) {
            return res.status(400).json({ success: false, message: "Dates are required." });
        }

        // Find busy guides for these dates
        const busyBookings = await Booking.find({
            bookingStatus: { $in: ['confirmed', 'pending_guide_confirmation'] },
            $or: [{
                checkIn: { $lt: new Date(checkOut) },
                checkOut: { $gt: new Date(checkIn) }
            }]
        }).select('guideId');

        const busyGuideIds = busyBookings.map(b => b.guideId);

        // Convert language string (e.g., "English, Hindi") into an array
        const langArray = languages ? languages.split(',').map(l => l.trim().toLowerCase()) : [];

        // Find approved guides that speak ANY of the requested languages
        const availableGuides = await GuideProfile.find({
            status: 'approved',
            isAvailable: true,
            _id: { $nin: busyGuideIds },
            languages: {
                $in: langArray.map(lang => new RegExp(lang, 'i'))
            }
        });

        // If at least one match, return success
        if (availableGuides.length > 0) {
            return res.json({
                success: true,
                count: availableGuides.length,
                busyGuideIds: busyGuideIds,
                message: "Guides are available for your selected languages."
            });
        } else {
            // If no match, find a fallback (e.g., English guides)
            const fallbackGuides = await GuideProfile.find({
                status: 'approved',
                isAvailable: true,
                _id: { $nin: busyGuideIds },
                languages: { $in: [/english/i] }
            });

            if (fallbackGuides.length > 0) {
                return res.json({
                    success: false,
                    fallbackCount: fallbackGuides.length,
                    busyGuideIds: busyGuideIds,
                    message: "No guides found for your specific language. Would you like to proceed with an English-speaking guide?"
                });
            } else {
                return res.json({
                    success: false,
                    busyGuideIds: busyGuideIds,
                    message: "All guides are booked for these dates. Try different dates."
                });
            }


        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Routes 13: Get active guides by GET "/api/guides/activeguides"
// Only admin can access this route
router.get("/activeguides", authorizeAdmin, async (req, res) => {
    try {
        const activeGuides = await GuideProfile.find({
            status: 'approved',
            isAvailable: true
        })
            .populate('userId', 'username email')
            .sort({ createdAt: -1 });

        res.json({ success: true, count: activeGuides.length, activeGuides: activeGuides });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;