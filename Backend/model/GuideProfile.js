import mongoose, { Schema } from "mongoose";

// Define a schema for images or documents
const imageAndDocumentSchema = new Schema({
    url: {
        type: String,
        required: true
    },
    public_id: {
        type: String,
        required: true
    },
    format: { 
        type: String 
    } 
}, {_id: false});

// Define the guide profile schema
const guideProfileSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumber: {
        countryCode: {
            type: String,
            required: true
        },
        number: {
            type: String,
            required: true
        }
    },
    age: {
        type: Number,
        required: true,
        min: 18
    },
    gender: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    country: {
        type: String,
        required: true,
        trim: true
    },
    languages: {
        type: [String],
        required: true
    },
    bio: {
        type: String,
        required: true,
        minlength: 20
    },
    profilePhoto: {
        type: imageAndDocumentSchema,
        required: false
    },
    documents: {
        type: [imageAndDocumentSchema],
        required: true
    },

    // Tracking the status of the guide application
    status: {
        type: String,
        enum: ["pending", "approved", "rejected", "scheduled_for_deletion"],
        default: "pending",
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    totalEarnings: {
        type: Number,
        default: 0
    },
    completedToursCount: {
        type: Number,
        default: 0
    },

    // Tracking the deletion of a guide profile
    deletionExpiredAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

export default mongoose.model('GuideProfile', guideProfileSchema);