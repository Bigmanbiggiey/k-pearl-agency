import { z } from 'zod';

export const staffLoginSchema = z.object({
  email: z.email('Enter a valid email'),
  password: z.string().min(1, 'Enter your password'),
});
export type StaffLoginInput = z.infer<typeof staffLoginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.email('Enter a valid email'),
});
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const setPasswordSchema = z
  .object({
    password: z.string().min(8, 'Use at least 8 characters'),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, {
    error: 'Passwords do not match',
    path: ['confirm'],
  });
export type SetPasswordInput = z.infer<typeof setPasswordSchema>;
