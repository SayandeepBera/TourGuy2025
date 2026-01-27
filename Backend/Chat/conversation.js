import express from "express";
import Conversation from "../model/Conversation.js";
import User from "../model/User.js";
import fetchUser from "../middleware/fetchUser.js";
import Message from "../model/Message.js";
import upload from "../middleware/imageUpload.js";
import { uploadToCloudinary } from "../Utils/cloudinary.js";

const router = express.Router();

// Common function to check if sender can communicate with receiver
const canCommunicate = (roleA, roleB) => {
    const allowed = {
        tourist: ["approved_guide", "admin"],
        approved_guide: ["tourist", "admin"],
        admin: ["tourist", "approved_guide", "admin"]
    };

    return allowed[roleA]?.includes(roleB);
};

// Common function to get conversation type
const getConversationType = (roleA, roleB) => {
    const roles = [roleA, roleB].sort();

    // If any user is admin then conversation type will be admin-approved_guide or admin-tourist
    if(roles.includes("admin")){
        return roles.includes("approved_guide") ? "admin-approved_guide" : "admin-tourist";
    }

    return "approved_guide-tourist";
}

// Route 1: Create a new conversation by POST "/api/chat/newconversation"
router.post("/newconversation", fetchUser, async (req, res) => {
    try {
        const { receiverId } = req.body;

        // Determine sender and receiver
        const sender = await User.findById(req.user.id);
        const receiver = await User.findById(receiverId);

        // Check receiver exists or not
        if (!receiver) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        // Check if sender can communicate with receiver or not
        if (!canCommunicate(sender.role, receiver.role)) {
            return res.status(403).json({ success: false, error: "You can't communicate with this user" });
        }

        // Get conversation type
        let conversation = await Conversation.findOne({
            participants: { $all: [sender.id, receiver.id] }
        });

        // If conversation not found then create a new one
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [sender.id, receiver.id],
                conversationType: getConversationType(sender.role, receiver.role)
            });
        }

        res.status(200).json({ success: true, conversation: conversation });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

// Route 2: Save message by POST "/api/chat/savemessage"
router.post("/savemessage", fetchUser, upload.single("image"), async (req, res) => {
    try {
        const { conversationId, message } = req.body;

        // Find conversation
        const conversation = await Conversation.findById(conversationId);

        // Check conversation exists or not
        if (!conversation) {
            return res.status(404).json({ success: false, error: "Conversation not found" });
        }

        // Check if user is participant of conversation or not
        const isParticipant = conversation.participants
            .map(participant => participant.toString())
            .includes(req.user.id);

        if (!isParticipant) {
            return res.status(403).json({ success: false, error: "You can't communicate with this user" });
        }

        // Create message data
        let messageData = {
            conversationId,
            sender: req.user.id,
            messageType: "text",
            message
        };
        
        // Handle Image Upload
        if(req.file){
            const uploaded = await uploadToCloudinary(req.file.buffer, "chat-images");

            messageData = {
                conversationId,
                sender: req.user.id,
                messageType: "image",
                image: {
                    url: uploaded.url,
                    public_id: uploaded.public_id
                }
            };
        }

        // Create a new message
        const newMessage = await Message.create(messageData);

        // Populate message by sender
        const populatedMessage = await Message.findById(newMessage._id)
            .populate("sender", "username avatar");

        // Update conversation last message
        await Conversation.findByIdAndUpdate(conversationId, {
            lastMessage: newMessage.messageType === "text" ? newMessage.message : "Image",
        });

        res.status(200).json({ success: true, newMessage: populatedMessage });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

// Route 3: Get all conversation for logged-in user by GET "/api/chat/myconversations"
router.get("/myconversations", fetchUser, async (req, res) => {
    try {
        const conversation = await Conversation.find({
            participants: req.user.id
        })
            .populate("participants", "username avatar role")
            .sort({ updatedAt: -1 });

        res.status(200).json({ success: true, conversation: conversation });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

// Route 4: Get all message for a specific conversation by GET "/api/chat/getmessages/:conversationId"
router.get("/getmessages/:conversationId", fetchUser, async (req, res) => {
    try {
        const { conversationId } = req.params;

        const conversation = await Conversation.findById(conversationId);

        // Check conversation exists or not
        if (!conversation) {
            return res.status(404).json({ success: false, error: "Conversation not found" });
        }

        // Find messages for conversation
        const messages = await Message.find({ conversationId })
            .populate("sender", "username avatar")
            .sort({ createdAt: 1 });

        res.status(200).json({ success: true, messages: messages });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

// Route 5: Mark all messages in a conversation as read by PUT "/api/chat/markasread/:conversationId"
router.put("/markasread/:conversationId", fetchUser, async (req, res) => {
    try {
        const { conversationId } = req.params;

        // Mark all messages as read
        await Message.updateMany({
            conversationId,
            sender: { $ne: req.user.id }
        },
            {
                $set: {
                    isRead: true
                }
            });

        res.status(200).json({ success: true, message: "Messages marked as read" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

export default router;