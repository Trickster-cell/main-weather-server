const jwt = require("jsonwebtoken");
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

const fetchuser = (req, res, next) => {
    // Get the user from the jwt token and add id to req object
  
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
      const data = jwt.verify(token, JWT_SECRET);
    //   console.log(data);
      req.userId = data.id; // Assuming 'id' is the field you want to extract
      next();
    } catch (error) {
      return res.status(401).send({ error: "Please authenticate using a valid token." });
    }
  };

module.exports = fetchuser;