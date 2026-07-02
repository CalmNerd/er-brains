import { Router } from "express";

import { authMiddleware } from "../../middleware/auth.middleware.js";
import * as teamController from "./team.controller.js";

export const teamRouter = Router();

teamRouter.use(authMiddleware);

teamRouter.get("/", teamController.listTeams);
teamRouter.post("/", teamController.createTeam);
teamRouter.patch("/:id", teamController.updateTeam);
teamRouter.delete("/:id", teamController.deleteTeam);
