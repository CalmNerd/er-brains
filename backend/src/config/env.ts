const DEFAULT_PORT = 3001;

export const env = {
  port: Number(process.env.PORT) || DEFAULT_PORT,
  nodeEnv: process.env.NODE_ENV ?? "development",
  isProduction: process.env.NODE_ENV === "production",
} as const;
