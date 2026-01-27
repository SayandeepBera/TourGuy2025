import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true
    },
    touristName: {
        type: String,
        required: true,
        trim: true
    },
    placeName: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    image: {
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
    },
    caption: {
        type: String,
        trim: true
    }
}, { timestamps: true });

export default mongoose.model('Gallery', gallerySchema);