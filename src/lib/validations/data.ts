import { z } from 'zod';

export const createProdukSchema = z.object({
  nama: z.string().min(2, 'Name must be at least 2 characters'),
  kategori: z.string().min(1, 'Category is required'),
  deskripsi: z.string().optional(),
  harga_per_hari: z.number().positive('Price must be a positive number'),
  cc: z.number().int().positive('CC must be a positive integer'),
  fitur: z.array(z.string()).optional(),
  gambar_url: z.array(z.string().url()).optional(),
});

export const createUnitSchema = z.object({
  produk_id: z.string().uuid('Invalid Product ID'),
  nomor_plat: z.string().regex(/^[A-Z]{1,2}\s\d{1,4}\s[A-Z]{1,3}$/, 'Invalid Indonesian license plate format (e.g. B 1234 ABC)'),
  tahun: z.number().int().min(2000, 'Year must be valid'),
  km: z.number().int().min(0, 'Mileage cannot be negative'),
  catatan: z.string().optional(),
});

export const createTransaksiSchema = z.object({
  produk_id: z.string().uuid('Invalid Product ID'),
  nama_penyewa: z.string().min(2, 'Name is required'),
  no_hp_penyewa: z.string().min(10, 'Phone number is required'),
  nik_penyewa: z.string().length(16, 'NIK must be 16 digits').regex(/^\d+$/, 'NIK must contain only numbers'),
  tanggal_mulai: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  jam_mulai: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:MM)'),
  durasi_hari: z.number().int().positive('Duration must be positive'),
  metode_pembayaran: z.enum(['midtrans', 'cash']),
  lokasi_pengambilan: z.string().min(5, 'Location is required'),
});

export const updateTransaksiStatusSchema = z.object({
  status: z.enum(['pending', 'menunggu_pembayaran', 'dibayar', 'qr_scanned', 'berlangsung', 'selesai', 'dibatalkan', 'refund']),
  karyawan_id: z.string().uuid('Invalid Karyawan ID').optional(),
});

export const updateSettingsSchema = z.record(z.string(), z.string());
