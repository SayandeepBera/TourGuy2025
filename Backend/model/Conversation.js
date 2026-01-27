import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    participants: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            }
        ],
        validate: {
            validator: function (participants) {
                return participants.length === 2;
            },
            message: 'Conversation must have exactly two participants.'
        }
    },
    conversationType: {
        type: String,
        enum: [
            "approved_guide-tourist",
            "admin-tourist",
            "admin-approved_guide",
            "admin-admin"
        ],
        required: true
    },
    lastMessage: {
        type: String,
        default: ""
    }
}, { timestamps: true });

export default mongoose.model('Conversation', conversationSchema);