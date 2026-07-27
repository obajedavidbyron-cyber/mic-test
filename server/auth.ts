import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { db, User } from "./db";

// Use a secure fallback secret
const JWT_SECRET = process.env.JWT_SECRET || "rental_platform_super_secret_jwt_key_2026";

// Extend Express Request to include authenticated user
export interface AuthenticatedRequest extends Request {
  user?: User;
}

export function generateToken(user: User): string {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    res.status(401).json({ error: "Access token is missing" });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, decoded: any) => {
    if (err) {
      res.status(401).json({ error: "Invalid or expired access token" });
      return;
    }

    const user = db.findUserById(decoded.id);
    if (!user) {
      res.status(401).json({ error: "User associated with this token not found" });
      return;
    }

    req.user = user;
    next();
  });
}

// Middleware to verify landlord role
export function requireRole(role: "tenant" | "landlord") {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized access" });
      return;
    }

    if (req.user.role !== role) {
      res.status(403).json({ error: `Forbidden: Requires ${role} role` });
      return;
    }

    next();
  };
}
