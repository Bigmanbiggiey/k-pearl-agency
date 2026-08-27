/**
 * Application-level error model (docs/api-design.md). Repositories normalise
 * Supabase/database failures into these; services and UI never see raw
 * database errors.
 */
export type AppErrorCode =
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'CONFLICT'
  | 'DATABASE_ERROR'
  | 'STORAGE_ERROR'
  | 'UNKNOWN_ERROR';

export class AppError extends Error {
  readonly code: AppErrorCode;

  constructor(code: AppErrorCode, message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'AppError';
    this.code = code;
  }
}

/** Wrap an unknown thrown value as an `AppError` without leaking internals. */
export function toAppError(error: unknown, fallbackMessage = 'Something went wrong.'): AppError {
  if (error instanceof AppError) {
    return error;
  }
  return new AppError('UNKNOWN_ERROR', fallbackMessage, { cause: error });
}

/**
 * Marker for not-yet-built repository/service operations. Phase 1 ships the
 * layered structure; real implementations arrive with the approved schema
 * (docs/database-readiness.md).
 */
export function notImplemented(operation: string): never {
  throw new AppError('UNKNOWN_ERROR', `${operation} is not implemented yet (Phase 2+).`);
}
