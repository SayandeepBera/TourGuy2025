import mongoose from "mongoose";

const ConciergeRequestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    role: {
        type: String,
        enum: ["tourist", "approved_guide"],
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ["pending", "in_progress", "resolved"],
        default: "pending"
    }
}, { timestamps: true });

export default mongoose.model('ConciergeRequest', ConciergeRequestSchema);