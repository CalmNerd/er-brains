import jwt, { type SignOptions } from "jsonwebtoken";

import { env } from "../config/env.js";

type JwtPayload = {
  userId: number;
};

export function signToken(userId: number): string {
  const expiresIn = env.JWT_EXPIRES_IN as Exclude<
    SignOptions["expiresIn"],
    undefined
  >;

  return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn });
}

export function verifyToken(token: string): JwtPayload {
  const payload = jwt.verify(token, env.JWT_SECRET);

  if (
    typeof payload !== "object" ||
    payload === null ||
    !("userId" in payload) ||
    typeof payload.userId !== "number"
  ) {
    throw new Error("Invalid token payload");
  }

  return { userId: payload.userId };
}
