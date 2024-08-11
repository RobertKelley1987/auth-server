import { Router } from "express";
import { createTokens } from "../controllers/tokens";
import catchAsync from "../util/catch-async";

const router = Router();
router.get("/", catchAsync(createTokens));

export default router;
