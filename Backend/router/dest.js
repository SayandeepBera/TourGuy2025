import express from 'express';
import Destinations from '../model/Destinations.js';
import { body, validationResult } from 'express-validator';
import authorizeAdmin from '../middleware/authorizeAdmin.js';
import mongoose from 'mongoose';
import upload from '../middleware/imageUpload.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../Utils/cloudinary.js';
import parseKeyHighlights from '../middleware/parseKeyHighlights.js';

const router = express.Router();

// ---- Destination validation ----
const destinationsValidator = [
    body("place", "Enter a valid destination name").trim().isLength({ min: 3 }),
    body("city", "Enter destination city").trim().isLength({ min: 2 }),
    body("country", "Enter destination country").trim().isLength({ min: 2 }),

    body("type", "Destination type must be 'national' or 'international'").isIn(["National", "International"]),

    body("duration", "Enter destination duration (e.g., '5 Days')").trim().notEmpty(),

    body("price", "Price must be a number greater than 0").isFloat({ gt: 0 }),
    body("rating", "Rating must be a number between 0 and 5").isFloat({ min: 0, max: 5 }),
    body("category", "Category must be one of 'Mountain', 'History', 'Forest', 'Beach', 'Desert', 'Adventurous', 'Other'").isIn(["Mountain", "History", "Forest", "Beach", "Desert", "Adventurous", "Other"]),

    body("markings", "Marking must be at least 10 characters").trim().isLength({ min: 10 }),
    body("description", "Description must be at least 50 characters").trim().isLength({ min: 50 }),

    body("mapTitle", "Enter destination map title").trim().notEmpty(),
    body("mapLink", "Enter destination map link").isURL(),

    body("keyHighlights").isArray({ min: 1, max: 3 }).withMessage("KeyHighlights must have 1-3 items"),
    body("keyHighlights.*.title").trim().isLength({ min: 3 }).withMessage("Each key highlight title min 3 chars"),

];

// Create a version of the validator where all fields are optional (for updates)
const optionalDestinationsValidator = destinationsValidator.map(validator => validator.optional());


// Routes 1 : Get all destinations by GET "/api/destinations/alldestinations" 
// Everyone can access this route
router.get('/alldestinations', async (req, res) => {
    let success = false;

    try {
        const destinations = await Destinations.find({});

        res.json({success: true, destinations, count: destinations.length});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({success, error: "Internal Server Error" });
    }
});

// Routes 2 : Add a destination by POST "/api/destinations/adddestinations"
// Only admin can access this route
router.post('/adddestinations', authorizeAdmin, upload.fields([
    { name: 'placeImage', maxCount: 1 },
    { name: 'backgroundImage', maxCount: 1 },
    { name: 'keyHighlightsImages', maxCount: 3 }

]), parseKeyHighlights, destinationsValidator, async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    let success = false;

    try {
        // Destructure the request body 
        const { place, city, country, type, duration, price, rating, category, markings, description, mapTitle, mapLink } = req.body;

        console.log("File upload req.files:", req.files);

        // Ensure required files are present
        if (!req.files?.placeImage || !req.files?.backgroundImage) {
            return res.status(400).json({ error: "Place image and Background image are required." });
        }

        // Take the uploaded files from the request
        const placeImage = req.files.placeImage[0];
        const backgroundImage = req.files.backgroundImage[0];

        console.log("placeImage:", placeImage);
        console.log("backgroundImage:", backgroundImage);

        // Upload files to cloudinary
        const uploadPlaceImage = await uploadToCloudinary(placeImage.buffer, "destinations/place");
        const uploadBackgroundImage = await uploadToCloudinary(backgroundImage.buffer, "destinations/background");

        // Parse JSON array from req.body
        const keyHighlightsRaw = req.body.keyHighlights || [];
        const keyImages = req.files.keyHighlightsImages || [];

        // Process key highlights and upload their images
        const keyHighlights = await Promise.all(
            keyHighlightsRaw.map(async (kh, index) => {
                const imageFile = keyImages[index];

                if (!imageFile) {
                    throw new Error("Each key highlight must have a corresponding image.");
                }

                // Upload key highlight image to Cloudinary
                const uploadedImage = await uploadToCloudinary(imageFile.buffer, "destinations/keyHighlights");

                return {
                    title: kh.title,
                    image: uploadedImage
                }
            })
        )

        // Create a new destination
        const newDestination = await Destinations.create({
            place,
            city,
            country,
            type,
            duration,
            price,
            rating,
            category,
            markings,
            description,
            mapTitle,
            mapLink,
            placeImage: uploadPlaceImage,
            backgroundImage: uploadBackgroundImage,
            keyHighlights
        });

        res.status(201).json({success: true, newDestination});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({success , error: "Internal Server Error" });
    }
});

// Routes 3 : Update a destination by PUT "/api/destinations/updatedestinations/:id"
// Only admin can access this route
router.put('/updatedestinations/:id', authorizeAdmin, upload.fields([
    { name: 'placeImage', maxCount: 1 },
    { name: 'backgroundImage', maxCount: 1 },
    { name: 'keyHighlightsImages', maxCount: 3 }
]), parseKeyHighlights, optionalDestinationsValidator, async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    let success = false;

    try {
        const destId = req.params.id;

        // Check if the provided ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(destId)) {
            return res.status(400).json({ error: "Invalid destination ID format" });
        }

        // Find the existing destination
        const destination = await Destinations.findById(destId);

        // If destination not found
        if (!destination) {
            return res.status(404).json({ error: "Destination not found" });
        }

        // Prepare update data
        const updateData = {};

        // Define allowed fields for update
        const allowedUpdates = [
            "place", "city", "country", "type", "duration", "price", "rating",
            "category", "markings", "description", "mapTitle", "mapLink"
        ];

        // Iterate over allowed fields and add to updateData if present in req.body
        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        });

        // Replace placeImage if a new one is uploaded
        if (req.files?.placeImage) {
            // Delete old image from Cloudinary
            if (destination.placeImage?.public_id) {
                await deleteFromCloudinary(destination.placeImage.public_id);
            }

            // Upload new image to Cloudinary and update data
            const uploadedPlaceImage = await uploadToCloudinary(req.files.placeImage[0].buffer, "destinations/place");
            updateData.placeImage = uploadedPlaceImage;
        }

        // Replace backgroundImage if a new one is uploaded
        if (req.files?.backgroundImage) {
            // Delete old image from Cloudinary
            if (destination.backgroundImage?.public_id) {
                await deleteFromCloudinary(destination.backgroundImage.public_id);
            }

            // Upload new image to Cloudinary and update data
            const uploadedBackgroundImage = await uploadToCloudinary(req.files.backgroundImage[0].buffer, "destinations/background");
            updateData.backgroundImage = uploadedBackgroundImage;
        }

        // Replace keyHighlights if provided
        if (req.body.keyHighlights) {
            // Parse JSON array from req.body.keyHighlights
            const keyHighlightsRaw = req.body.keyHighlights;
            const keyImages = req.files.keyHighlightsImages || [];

            // Process new key highlights and upload their images
            const updatedKeyHighlights = await Promise.all(
                // Map through each key highlight and handle image upload
                keyHighlightsRaw.map(async (kh, index) => {
                    const existingKh = destination.keyHighlights[index];
                    const imageFile = keyImages[index];

                    // If a new image is provided for this key highlight, upload it
                    if (imageFile) {
                        // Delete old image from Cloudinary
                        if(existingKh?.image?.public_id) {
                            await deleteFromCloudinary(existingKh.image.public_id);
                        }

                        const uploadedImage = await uploadToCloudinary(imageFile.buffer, "destinations/keyHighlights");

                        return {
                            title: kh.title,
                            image: uploadedImage
                        };
                    }

                    // If no new image, retain the existing one
                    return {
                        title: kh.title,
                        image: existingKh?.image
                    }
                })
            );

            // Set updated key highlights in update data
            updateData.keyHighlights = updatedKeyHighlights;
        }

        // Update the destination in the database
        const updatedDestination = await Destinations.findByIdAndUpdate(destId, { $set: updateData }, { new: true, runValidators: true });

        res.json({success: true , updatedDestination});

    } catch (error) {
        console.error(error.message);
        res.status(500).json({success, error: "Internal Server Error" });
    }
});

// Routes 4 : Delete a destination by DELETE "/api/destinations/deletedestinations/:id"
// Only admin can access this route
router.delete('/deletedestinations/:id', authorizeAdmin, async (req, res) => {
    let success = false;

    try {
        // Check if the provided ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid destination ID format" });
        }

        // Find the existing destination
        const destination = await Destinations.findById(req.params.id);

        // If destination not found
        if (!destination) {
            return res.status(404).json({ error: "Destination not found" });
        }

        // Delete place image from Cloudinary
        if (destination.placeImage?.public_id) {
            await deleteFromCloudinary(destination.placeImage.public_id);
        }

        // Delete background image from Cloudinary
        if (destination.backgroundImage?.public_id) {
            await deleteFromCloudinary(destination.backgroundImage.public_id);
        }

        // Delete key highlight images from Cloudinary
        for (const kh of destination.keyHighlights || []) {
            if (kh.image?.public_id) {
                await deleteFromCloudinary(kh.image.public_id);
            }
        }

        // Find destination by ID and delete
        const deletedDest = await Destinations.findByIdAndDelete(req.params.id);

        res.json({success: true, message: "Destination deleted successfully", deletedDest });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({success, error: "Internal Server Error" });
    }
});

export default router;