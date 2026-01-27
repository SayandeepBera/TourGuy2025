import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.SECRET_KEY;

// Function to fetch user
const fetchUser = (req, res, next) => {
    const token = req.header('auth-token');

    // If no token, return error
    if(!token) {
        res.status(401).json({error: "No token, authorization denied"});
    }

    try {
        // Verify token
        const decode = jwt.verify(token, JWT_SECRET);

        req.user = decode.user;
        next();
    } catch (error) {
        return res.status(401).json({error: "Invalid or Expired token"});
    }
}

export default fetchUser;