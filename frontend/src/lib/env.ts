import { z } from 'zod';

/**
 * Validated build/runtime environment. Only public, non-sensitive `VITE_`
 * values belong here (docs/deployment.md). The service-role key must never
 * reach the browser.
 */
const envSchema = z.object({
  VITE_SUPABASE_URL: z.url('VITE_SUPABASE_URL must be a valid URL'),
  VITE_SUPABASE_ANON_KEY: z.string().min(1, 'VITE_SUPABASE_ANON_KEY must not be empty'),
});

const parsed = envSchema.safeParse(import.meta.env);

if (!parsed.success) {
  const details = parsed.error.issues
    .map((issue) => `  - ${issue.path.join('.') || '(root)'}: ${issue.message}`)
    .join('\n');
  throw new Error(
    `Invalid environment configuration:\n${details}\n\n` +
      'Copy frontend/.env.example to frontend/.env and provide the values.',
  );
}

export const env = parsed.data;
