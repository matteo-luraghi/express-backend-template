import { Router } from "express";
import { requireAuth } from "../middleware/middleware";

const router = Router();

// how to protect routes: pass requireAuth as a param in router
router.use("/test", requireAuth, (req, res) => {
  res.json({
    message: "Success",
    user: req.user
  });
});

export default router;
