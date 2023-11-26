import { loginHandler, profileHandler } from "@/handlers/auth.handler";
import { verifyJwt } from "@/middlewares/validateJwt.middleware";
import { Router, Request, Response } from "express";

// Import the RequestWithUser type

const router = Router();
router.post("/login", loginHandler);
router.get("/profile", verifyJwt, profileHandler);

export default router;
