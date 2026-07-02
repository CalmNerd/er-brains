import { Router } from "express";

import { authMiddleware } from "../../middleware/auth.middleware.js";
import * as taskController from "./task.controller.js";

export const taskRouter = Router();

taskRouter.use(authMiddleware);

taskRouter.get("/", taskController.listTasks);
taskRouter.get("/:id", taskController.getTask);
taskRouter.post("/", taskController.createTask);
taskRouter.patch("/:id", taskController.updateTask);
taskRouter.delete("/:id", taskController.deleteTask);
