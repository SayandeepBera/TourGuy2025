import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: function() { return this.messageType === 'text'; }, // Only required if messageType is "text"
        trim: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    image: {
        url: String,
        public_id: String
    },
    messageType: {
        type: String,
        enum: ["text", "image"],
        default: "text"
    }
}, { timestamps: true });

export default mongoose.model('Message', messageSchema);