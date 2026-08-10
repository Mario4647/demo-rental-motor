export type Role = 'guest' | 'user' | 'karyawan' | 'admin';

export type UnitStatus = 'tersedia' | 'disewa' | 'maintenance';

export type TransaksiStatus = 
  | 'pending'
  | 'menunggu_pembayaran'
  | 'dibayar'
  | 'qr_scanned'
  | 'berlangsung'
  | 'selesai'
  | 'dibatalkan'
  | 'refund';

export type MetodePembayaran = 'midtrans' | 'cash' | 'admin';

export type VerifikasiStatus = 'pending' | 'sesuai' | 'tidak_sesuai';

export interface User {
  id: string;
  email: string;
  nama_lengkap: string;
  nik: string; // encrypted in db, masked in UI
  no_hp: string;
  role: Role;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  last_login?: string;
  last_ip?: string;
  last_device?: string;
}

export interface UserSession {
  id: string;
  device_info: string;
  ip_address: string;
  created_at: string;
  last_active: string;
  is_current: boolean;
}

export interface Produk {
  id: string;
  nama: string;
  slug: string;
  kategori: string;
  deskripsi: string;
  harga_per_hari: number;
  gambar_url: string[];
  jumlah_unit_tersedia: number;
  total_unit: number;
  is_active: boolean;
  fitur: string[];
  cc: number;
}

export interface Unit {
  id: string;
  produk_id: string;
  nomor_plat: string;
  status: UnitStatus;
  tahun: number;
  km: number;
  catatan?: string;
}

export interface IdentitasPenyewa {
  id: string;
  transaksi_id: string;
  foto_url: string[];
  uploaded_by: string;
  uploaded_at: string;
  status_verifikasi: VerifikasiStatus;
  dijadwalkan_hapus_at?: string; // 72h auto delete timestamp
}

export interface Transaksi {
  id: string;
  invoice_id: string; // e.g. INV-20260810-8842
  user_id?: string;
  karyawan_id?: string;
  unit_id?: string;
  produk_id: string;
  produk_nama: string;
  produk_gambar: string;
  nama_penyewa: string;
  no_hp_penyewa: string;
  nik_penyewa: string;
  tanggal_mulai_sewa: string;
  jam_mulai_sewa: string;
  durasi_hari: number;
  tanggal_selesai_sewa: string;
  total_harga: number;
  status: TransaksiStatus;
  metode_pembayaran: MetodePembayaran;
  snap_token?: string;
  midtrans_order_id?: string;
  payment_deadline_at?: string;
  qr_code_url?: string;
  qr_expires_at?: string;
  lokasi_pengambilan: string;
  identitas?: IdentitasPenyewa;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  user_nama: string;
  user_role: Role;
  aksi: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'PAYMENT' | 'SCAN' | 'MAINTENANCE' | 'REFUND' | 'SECURITY';
  entitas: string;
  entitas_id: string;
  deskripsi: string;
  metadata?: Record<string, any>;
  ip_address: string;
  created_at: string;
  is_near_expiry?: boolean; // For H-45 notice simulation
}

export interface PengaturanAplikasi {
  maintenance_mode: boolean;
  maintenance_pesan: string;
  maintenance_selesai_at?: string;
  durasi_sewa_min: number;
  batas_bayar_menit: number;
  lokasi_utama: string;
  kontak_whatsapp: string;
  kontak_email: string;
}

export interface PengaturanPayment {
  provider: 'midtrans';
  client_key: string;
  server_key: string;
  is_sandbox: boolean;
  is_active: boolean;
}
