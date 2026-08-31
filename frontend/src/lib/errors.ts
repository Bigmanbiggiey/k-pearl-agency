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

interface PostgrestLikeError {
  code: string;
  message: string;
}

function isPostgrestLikeError(error: unknown): error is PostgrestLikeError {
  return (
    typeof error === 'object' && error !== null && 'code' in error && typeof error.code === 'string'
  );
}

function messageOf(error: unknown): string {
  return typeof error === 'object' && error !== null && 'message' in error
    ? String(error.message)
    : '';
}

/**
 * Normalise a Supabase/PostgREST error into an `AppError`. Structural check so
 * this module needs no `@supabase/*` import (kept out of the layered-import ban).
 */
export function normalizeSupabaseError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  // Our own rate-limit trigger (docs/security.md) raises this prefix.
  if (messageOf(error).includes('lead_rate_limited')) {
    return new AppError(
      'CONFLICT',
      'You are sending messages too quickly. Please wait a moment and try again.',
      { cause: error },
    );
  }

  if (isPostgrestLikeError(error)) {
    switch (error.code) {
      case 'PGRST116': // no rows for .single()
        return new AppError('NOT_FOUND', 'The requested record was not found.', { cause: error });
      case '42501': // insufficient privilege / RLS
        return new AppError('FORBIDDEN', 'You do not have permission to do that.', {
          cause: error,
        });
      case '23505': // unique violation
        return new AppError('CONFLICT', 'That record already exists.', { cause: error });
      case '23514': // check violation
      case '23502': // not-null violation
        return new AppError('VALIDATION_ERROR', 'Some of the submitted data was invalid.', {
          cause: error,
        });
      default:
        return new AppError('DATABASE_ERROR', 'A database error occurred.', { cause: error });
    }
  }
  return new AppError('UNKNOWN_ERROR', 'Something went wrong.', { cause: error });
}

/**
 * Marker for not-yet-built repository/service operations. Phase 1 ships the
 * layered structure; real implementations arrive with the approved schema
 * (docs/database-readiness.md).
 */
export function notImplemented(operation: string): never {
  throw new AppError('UNKNOWN_ERROR', `${operation} is not implemented yet (Phase 2+).`);
}
