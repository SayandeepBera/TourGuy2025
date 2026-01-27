import express from "express";
import ConciergeRequest from "../model/ConciergeRequest.js";
import fetchUser from "../middleware/fetchUser.js";
import authorizeAdmin from "../middleware/authorizeAdmin.js";

const router = express.Router();

// Route 1: Create a new concierge request by POST "/api/concierge/newrequest"
router.post("/newrequest", fetchUser, async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Create a new concierge request
        const newRequest = await ConciergeRequest.create({
            userId: req.user.id,
            role: req.user.role,
            name,
            email,
            message
        });

        res.status(201).json({ success: true, newRequest: newRequest });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

// Route 2: Get all concierge requests by GET "/api/concierge/getrequests"
// Only admin can access this route
router.get("/allrequests", authorizeAdmin, async (req, res) => {
    try {
        // Get all concierge requests
        const conciergeRequests = await ConciergeRequest.find()
            .populate('userId', 'username email')
            .sort({ createdAt: -1 });

        res.json({ success: true, count: conciergeRequests.length, conciergeRequests: conciergeRequests });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

// Route 3: Update a concierge request status by PATCH "/api/concierge/updaterequest/:id"
// Only admin can access this route
router.patch("/updaterequest/:id", authorizeAdmin, async (req, res) => {
    try {
        const { status } = req.body;

        // Update concierge request
        const updateRequest = await ConciergeRequest.findByIdAndUpdate(req.params.id, { status }, { new: true });

        res.json({ success: true, updateRequest: updateRequest });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

export default router;