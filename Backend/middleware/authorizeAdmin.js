import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.SECRET_KEY;

const authorizeAdmin = async( req, res, next) => {
    // Get token from header
    const token = req.header('auth-token');
    console.log("Token in authorizeAdmin middleware:", token);

    try {
        if(!token){
            res.status(401).json({error: "No token, authorization denied"});
        }

        // Verify token and exact user payload
        const decode = jwt.verify(token, JWT_SECRET);
        req.user = decode.user;
        
        console.log(req.user);

        // Check if user is admin or not
        if(req.user.role !== "admin"){
            return res.status(403).json({error: "Access denied: Admin role required"});
        }

        next();
    } catch (error) {
        res.status(401).json({error: "Invalid token"});
    }
}

export default authorizeAdmin;