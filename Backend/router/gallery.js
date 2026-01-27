import express from "express";
import Gallery from "../model/Gallery.js";
import Booking from "../model/Booking.js";
import upload from "../middleware/imageUpload.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../Utils/cloudinary.js";
import authorizeAdmin from "../middleware/authorizeAdmin.js";

const router = express.Router();

// Route 1: Upload a gallery image by POST "/api/gallery/upload"
router.post("/upload/:bookingId", upload.single("image"), async (req, res) => {
    try {
        const { caption } = req.body;

        const booking = await Booking.findById(req.params.bookingId).populate('destinationId');
        
        // Verify the tour is completed or not
        if(!booking || booking.bookingStatus !== 'completed') {
            return res.status(403).json({ success: false, error: "You can only upload images for completed tours." });
        }
        
        // Upload image to Cloudinary
        const uploadImage = await uploadToCloudinary(req.file.buffer, "community_gallery", "image");

        // Save image to database
        const moment = await Gallery.create({
            userId: booking.userId,
            bookingId: booking._id,
            touristName: booking.fullName,
            placeName: booking.destinationName,
            category: booking.destinationId.category,
            image: {
                url: uploadImage.url,
                public_id: uploadImage.public_id
            },
            caption
        });

        res.json({ success: true, message: "Image uploaded successfully!", moment });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

// Route 2: Delete Irrelevant gallery images by DELETE "/api/gallery/delete/:id"
// Admin can access this route
router.delete('/delete/:id', authorizeAdmin, async (req, res) => {
    try {
        const moment = await Gallery.findById(req.params.id);

        // If moment not found
        if (!moment) {
            return res.status(404).json({ success: false, error: "Moment not found" });
        }

        // Delete image from Cloudinary
        await deleteFromCloudinary(moment.image.public_id);
        
        // Delete moment from database
        await Gallery.findByIdAndDelete(req.params.id);

        res.json({ success: true, message: "Moment deleted successfully!" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

// Route 3: Get all gallery images by GET "/api/gallery/all-moments"
router.get('/all-moments', async (req, res) => {
    try {
        // Get all moments
        const moments = await Gallery.find().sort({ createdAt: -1 });
        
        res.json({ success: true, count: moments.length, moments });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

// Route 4: Get gallery moments by category
router.get("/moments/:category", async (req, res) => {
    try {
        const { category } = req.params;
        const moments = await Gallery.find({ category }).sort({ createdAt: -1 });
        
        res.json({ success: true, count: moments.length, moments: moments });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

export default router;