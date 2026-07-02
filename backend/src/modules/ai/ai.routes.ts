import { Router } from "express";

import { authMiddleware } from "../../middleware/auth.middleware.js";
import * as aiController from "./ai.controller.js";

export const aiRouter = Router();

aiRouter.use(authMiddleware);
aiRouter.post("/suggest", aiController.suggest);
