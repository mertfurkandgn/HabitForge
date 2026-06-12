export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number,
    code: string,
    isOperational = true,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
  }
  static badRequest(message: string) {
    return new AppError(message, 400, "Bad Request");
  }
  static unauthorized(message = "Authentication required") {
    return new AppError(message, 401, "UNAUTHORIZED");
  }

  static forbidden(message = "Access denied") {
    return new AppError(message, 403, "FORBIDDEN");
  }

  static notFound(resource: string) {
    return new AppError(`${resource} not found`, 404, "NOT_FOUND");
  }
  static conflict(message: string) {
    return new AppError(message, 409, "CONFLICT");
  }
}
