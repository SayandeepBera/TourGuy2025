import express from 'express';
import UserProfile from '../model/Profile.js';
import upload from '../middleware/imageUpload.js';
import { uploadToCloudinary } from '../Utils/cloudinary.js';

const router = express.Router();

// GET Profile
router.get('/:userId', async (req, res) => {
    try {
        let profile = await UserProfile.findOne({ userId: req.params.userId }).populate('userId', 'username email role');
        
        // If profile not found then create a new empty profile
        if (!profile) {
            // Create the profile with a bio that meets your 100-character requirement
            profile = await UserProfile.create({ 
                userId: req.params.userId,
                fullName: "",
                phoneNumber: { countryCode: "+91", number: "" },
                bio: "", 
                languages: [],
                avatar: { url: "", public_id: "" },
                address: "" 
            });

            // Re-fetch and populate to ensure we have the full User object for the frontend
            profile = await UserProfile.findOne({ userId: req.params.userId })
                .populate('userId', 'username email role');
        }

        res.json({ success: true, profile });
    } catch (error) {
        res.status(500).json({ success: false, error: "Server Error" });
    }
});

// UPDATE Profile
router.put('/update/:userId', upload.single('avatar'), async (req, res) => {
    try {
        const updateData = { ...req.body };
        
        // Handle languages string to array
        if (req.body.languages) {
            updateData.languages = req.body.languages.split(',').map(l => l.trim());
        }

        // Handle Avatar Upload
        if (req.file) {
            const uploaded = await uploadToCloudinary(req.file.buffer, "avatars", "image");
            updateData.avatar = { url: uploaded.url, public_id: uploaded.public_id };
        }

        const profile = await UserProfile.findOneAndUpdate(
            { userId: req.params.userId },
            { $set: updateData },
            { new: true, upsert: true }
        );

        res.json({ success: true, message: "Profile updated successfully!", profile });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;