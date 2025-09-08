import jwt from "jsonwebtoken";

export function auth(req, res, next) {
  try {
    // 1. Get token from header
    const header = req.headers.authorization || "";
    let token = header.startsWith("Bearer ") ? header.slice(7) : null;

    // 2. If not found in header, check cookies
    if (!token && req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return res.status(401).json({ message: "Missing token" });
    }

    // 3. Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (e) {
    console.error("Auth error ❌", e.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
