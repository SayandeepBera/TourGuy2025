const parseKeyHighlights = async (req, res, next) => {
    // Parse keyHighlights BEFORE validator
    if (req.body.keyHighlights) {
        try {
            req.body.keyHighlights = JSON.parse(req.body.keyHighlights);
        } catch (err) {
            return res.status(400).json({ error: "Invalid keyHighlights JSON" });
        }
    }
    next(); // now go to validator
}

export default parseKeyHighlights;