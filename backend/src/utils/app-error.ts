export type ErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "TASK_NOT_FOUND"
  | "TEAM_NOT_FOUND"
  | "USER_NOT_FOUND"
  | "EMAIL_ALREADY_EXISTS"
  | "INVALID_CREDENTIALS"
  | "AI_GENERATION_FAILED"
  | "INTERNAL_SERVER_ERROR";

export class AppError extends Error {
  readonly statusCode: number;
  readonly code: ErrorCode;
  readonly details?: Record<string, string> | undefined;

  constructor(
    message: string,
    statusCode: number,
    code: ErrorCode,
    details?: Record<string, string>
  ) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    if (details !== undefined) {
      this.details = details;
    }
  }
}
