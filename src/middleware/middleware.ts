import { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// function to protect API paths
export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // retrieve the session using better-auth
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    // if no session or user exists, block the request
    if (!session || !session.user) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    // attach the user object to the request for your route handlers to use
    req.user = session.user;

    // proceed to the actual endpoint
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
