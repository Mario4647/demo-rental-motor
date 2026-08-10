-- 1. Database Schema

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enum types for specific fields
CREATE TYPE user_role AS ENUM ('admin', 'karyawan', 'user');
CREATE TYPE unit_status AS ENUM ('tersedia', 'disewa', 'maintenance');
CREATE TYPE transaksi_status AS ENUM ('pending', 'menunggu_pembayaran', 'dibayar', 'qr_scanned', 'berlangsung', 'selesai', 'dibatalkan', 'refund');
CREATE TYPE metode_pembayaran AS ENUM ('midtrans', 'cash', 'admin');
CREATE TYPE status_verifikasi AS ENUM ('pending', 'sesuai', 'tidak_sesuai');
CREATE TYPE audit_aksi AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'PAYMENT', 'SCAN', 'MAINTENANCE', 'REFUND', 'SECURITY');

-- profiles table
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    nama_lengkap TEXT,
    nik TEXT,
    no_hp TEXT,
    role user_role DEFAULT 'user',
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    mfa_enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- login_attempts table
CREATE TABLE login_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ip_address TEXT,
    email TEXT,
    attempt_count INT DEFAULT 0,
    last_attempt_at TIMESTAMPTZ DEFAULT NOW(),
    is_blocked_until TIMESTAMPTZ
);

-- produk table
CREATE TABLE produk (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    kategori TEXT NOT NULL,
    deskripsi TEXT,
    harga_per_hari DECIMAL NOT NULL,
    gambar_url TEXT[],
    jumlah_unit_tersedia INT DEFAULT 0,
    total_unit INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    fitur TEXT[],
    cc INT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- unit table
CREATE TABLE unit (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    produk_id UUID REFERENCES produk(id) ON DELETE CASCADE,
    nomor_plat TEXT UNIQUE NOT NULL,
    status unit_status DEFAULT 'tersedia',
    tahun INT,
    km INT,
    catatan TEXT,
    version INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- transaksi table
CREATE TABLE transaksi (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    karyawan_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    unit_id UUID REFERENCES unit(id) ON DELETE SET NULL,
    produk_id UUID REFERENCES produk(id) ON DELETE RESTRICT,
    produk_nama TEXT NOT NULL,
    produk_gambar TEXT,
    nama_penyewa TEXT NOT NULL,
    no_hp_penyewa TEXT NOT NULL,
    nik_penyewa TEXT NOT NULL,
    tanggal_mulai_sewa DATE NOT NULL,
    jam_mulai_sewa TEXT NOT NULL,
    durasi_hari INT NOT NULL,
    tanggal_selesai_sewa DATE NOT NULL,
    total_harga DECIMAL NOT NULL,
    status transaksi_status DEFAULT 'pending',
    metode_pembayaran metode_pembayaran NOT NULL,
    snap_token TEXT,
    midtrans_order_id TEXT,
    payment_deadline_at TIMESTAMPTZ,
    qr_code_url TEXT,
    qr_expires_at TIMESTAMPTZ,
    lokasi_pengambilan TEXT,
    idempotency_key TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- pembayaran table
CREATE TABLE pembayaran (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaksi_id UUID REFERENCES transaksi(id) ON DELETE CASCADE,
    midtrans_order_id TEXT UNIQUE,
    transaction_status TEXT NOT NULL,
    payment_type TEXT,
    bank TEXT,
    va_number TEXT,
    gross_amount DECIMAL NOT NULL,
    pdf_url TEXT,
    raw_callback JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- identitas_penyewa table
CREATE TABLE identitas_penyewa (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaksi_id UUID REFERENCES transaksi(id) ON DELETE CASCADE,
    foto_url TEXT[],
    uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    status_verifikasi status_verifikasi DEFAULT 'pending',
    dijadwalkan_hapus_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- audit_logs table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    user_nama TEXT,
    user_role TEXT,
    aksi audit_aksi NOT NULL,
    entitas TEXT NOT NULL,
    entitas_id TEXT,
    deskripsi TEXT,
    metadata JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- app_settings table
CREATE TABLE app_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kunci TEXT UNIQUE NOT NULL,
    nilai TEXT NOT NULL,
    deskripsi TEXT,
    updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- payment_settings table
CREATE TABLE payment_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider TEXT DEFAULT 'midtrans',
    client_key TEXT NOT NULL,
    server_key TEXT NOT NULL,
    is_sandbox BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_transaksi_status ON transaksi(status);
CREATE INDEX idx_transaksi_user_id ON transaksi(user_id);
CREATE INDEX idx_transaksi_invoice_id ON transaksi(invoice_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_unit_produk_id ON unit(produk_id);
CREATE INDEX idx_unit_status ON unit(status);
CREATE INDEX idx_login_attempts_ip_email ON login_attempts(ip_address, email);

-- RLS Policies

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE produk ENABLE ROW LEVEL SECURITY;
ALTER TABLE unit ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaksi ENABLE ROW LEVEL SECURITY;
ALTER TABLE pembayaran ENABLE ROW LEVEL SECURITY;
ALTER TABLE identitas_penyewa ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_settings ENABLE ROW LEVEL SECURITY;

-- profiles RLS
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admin can read all profiles" ON profiles FOR SELECT USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));
CREATE POLICY "Users can update own non-role fields" ON profiles FOR UPDATE USING (auth.uid() = id); -- Note: Role checking should be done at the application level before updates to ensure roles aren't changed

-- login_attempts RLS (Service role only typically means no public policies, but we can secure it)
CREATE POLICY "Service role full access on login_attempts" ON login_attempts USING (false); -- Access via service key bypasses RLS

-- produk RLS
CREATE POLICY "Anyone can read active products" ON produk FOR SELECT USING (is_active = true);
CREATE POLICY "Admin can CRUD products" ON produk USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- unit RLS
CREATE POLICY "Anyone can read units" ON unit FOR SELECT USING (true);
CREATE POLICY "Admin and Karyawan can update units" ON unit FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND (p.role = 'admin' OR p.role = 'karyawan')));

-- transaksi RLS
CREATE POLICY "Users see own transactions" ON transaksi FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Karyawan see all active transactions" ON transaksi FOR SELECT USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'karyawan'));
CREATE POLICY "Admin sees all transactions" ON transaksi FOR ALL USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- pembayaran RLS
CREATE POLICY "Admin only for pembayaran" ON pembayaran FOR ALL USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));
CREATE POLICY "Users can see own payments" ON pembayaran FOR SELECT USING (EXISTS (SELECT 1 FROM transaksi t WHERE t.id = pembayaran.transaksi_id AND t.user_id = auth.uid()));

-- identitas_penyewa RLS
CREATE POLICY "Karyawan and Admin can read and insert" ON identitas_penyewa USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND (p.role = 'admin' OR p.role = 'karyawan')));

-- audit_logs RLS
CREATE POLICY "Admin can SELECT audit logs" ON audit_logs FOR SELECT USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- app_settings RLS
CREATE POLICY "Anyone can read app settings" ON app_settings FOR SELECT USING (true);
CREATE POLICY "Admin can update app settings" ON app_settings FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- payment_settings RLS
CREATE POLICY "Admin only for payment settings" ON payment_settings FOR ALL USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- Functions

CREATE OR REPLACE FUNCTION book_unit(p_unit_id UUID, p_expected_version INT)
RETURNS BOOLEAN AS $$
DECLARE
    v_rows_affected INT;
BEGIN
    UPDATE unit
    SET status = 'disewa', version = version + 1
    WHERE id = p_unit_id AND status = 'tersedia' AND version = p_expected_version;
    
    GET DIAGNOSTICS v_rows_affected = ROW_COUNT;
    RETURN v_rows_affected > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION release_unit(p_unit_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE unit
    SET status = 'tersedia'
    WHERE id = p_unit_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger Function for New User
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, nama_lengkap, role)
    VALUES (new.id, new.email, new.raw_user_meta_data->>'nama_lengkap', 'user');
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Default Data Inserts
INSERT INTO app_settings (kunci, nilai, deskripsi) VALUES
('maintenance_mode', 'false', 'Enable or disable maintenance mode'),
('maintenance_pesan', '', 'Message to show during maintenance'),
('durasi_sewa_min', '1', 'Minimum rental duration in days'),
('batas_bayar_menit', '15', 'Time limit for payment in minutes'),
('lokasi_utama', 'Jl. Raya Kuta No. 123, Bali', 'Main business location'),
('kontak_whatsapp', '6281234567890', 'Main WhatsApp contact'),
('kontak_email', 'info@rentmoto.id', 'Main email contact')
ON CONFLICT (kunci) DO NOTHING;
