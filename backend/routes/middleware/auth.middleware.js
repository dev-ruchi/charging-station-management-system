import jwt from "jsonwebtoken";

export default function auth (req, res, next) {

  
  const { authorization } = req.headers;


  if (!authorization || typeof authorization !== "string") {
    console.log("Token not found");
    return res.status(401).json({ message: "Unauthenticated: No token provided" });
  }

  // "Bearer fkfndksjnfsvnkdvsnv"
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    return res.status(401).json({ message: "Unauthenticated: Invalid token format" });
  }

  if (!token) {
    console.log("Invalid token");
    return res.status(401).json({ message: "Unauthenticated: Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Set req.user object with id property
    req.user = {
      _id: decoded.userId
    };
    
    next();
  } catch (err) {
    console.log("JWT verification error:", err);
    return res.status(401).json({ message: "Unauthenticated: Invalid token" });
  }
}