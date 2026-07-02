export type ApiSuccessResponse<T> = {
  success: true
  message: string
  data: T
}

export type ApiErrorResponse = {
  success: false
  message: string
  error: {
    code: string
    details?: Record<string, string>
  }
}

export class ApiError extends Error {
  code?: string
  details?: Record<string, string>

  constructor(
    message: string,
    code?: string,
    details?: Record<string, string>
  ) {
    super(message)
    this.name = "ApiError"
    this.code = code
    this.details = details
  }
}
