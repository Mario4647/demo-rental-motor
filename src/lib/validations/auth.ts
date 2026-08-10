import { z } from 'zod';

const passwordRules = z
  .string()
  .min(12, 'Password must be at least 12 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: passwordRules,
  nama_lengkap: z.string().min(2, 'Name must be at least 2 characters'),
  nik: z.string().length(16, 'NIK must be exactly 16 digits').regex(/^\d+$/, 'NIK must contain only numbers'),
  no_hp: z.string().min(10, 'Phone number too short').max(15, 'Phone number too long'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  password: passwordRules,
});

export const registerStaffSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: passwordRules,
  nama_lengkap: z.string().min(2, 'Name must be at least 2 characters'),
  no_hp: z.string().min(10, 'Phone number too short').max(15, 'Phone number too long'),
  role: z.enum(['karyawan', 'admin']),
});
