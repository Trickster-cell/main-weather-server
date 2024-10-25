const jwt = require("jsonwebtoken");
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to fetch user from JWT token
const fetchuser = (req, res, next) => {
    // Get the user from the JWT token and add the user ID to the request object
    const authHeader = req.header("Authorization");
    if (!authHeader) {
        return res.status(401).send({ error: "Please authenticate using a valid token." });
    }

    // Extract the token from the Bearer string
    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).send({ error: "Please authenticate using a valid token." });
    }

    try {
        // Verify the token and extract user data
        const data = jwt.verify(token, JWT_SECRET);
        req.userId = data.id; // Assuming 'id' is the field you want to extract
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(401).send({ error: "Please authenticate using a valid token." });
    }
};

module.exports = fetchuser;
