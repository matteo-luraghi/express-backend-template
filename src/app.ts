import express, { Application } from "express";
import routes from "./routes";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";

const app: Application = express();

// mount betterauth
app.all("/api/auth/*path", toNodeHandler(auth));

// TODO: fix cors for production
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api", routes); // base route for all APIs

// default error handler
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    res.status(err.status || 500).json({
      message: err.message || "Internal Server Error",
    });
  },
);

export default app;

