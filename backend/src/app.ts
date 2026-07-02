import cors from "cors";
import express from "express";

import { env } from "./config/env.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { aiRouter } from "./modules/ai/ai.routes.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { taskRouter } from "./modules/tasks/task.routes.js";
import { teamRouter } from "./modules/teams/team.routes.js";
import { healthRouter } from "./routes/health.route.js";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
    })
  );
  app.use(express.json());

  app.use("/health", healthRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/teams", teamRouter);
  app.use("/api/tasks", taskRouter);
  app.use("/api/ai", aiRouter);

  app.use(errorMiddleware);

  return app;
}
