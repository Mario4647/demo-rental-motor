import { create } from 'zustand';
import { 
  Role, Produk, Unit, Transaksi, AuditLog, PengaturanAplikasi, PengaturanPayment, 
  TransaksiStatus, UnitStatus, User, UserSession 
} from './types';
import { 
  INITIAL_PRODUCTS, INITIAL_UNITS, INITIAL_TRANSACTIONS, INITIAL_USERS, 
  INITIAL_AUDIT_LOGS, INITIAL_APP_SETTINGS, INITIAL_PAYMENT_SETTINGS, INITIAL_SESSIONS 
} from './mockData';

interface AppState {
  // Navigation & Role State
  activeRole: Role;
  setActiveRole: (role: Role) => void;
  activeView: string;
  setActiveView: (view: string) => void;
  
  // Cart State
  cart: { produk: Produk; durasiHari: number; tanggalMulai: string; jamMulai: string }[];
  addToCart: (produk: Produk, durasiHari: number, tanggalMulai: string, jamMulai: string) => void;
  removeFromCart: (produkId: string) => void;
  clearCart: () => void;

  // Data Store
  products: Produk[];
  units: Unit[];
  transactions: Transaksi[];
  users: User[];
  sessions: UserSession[];
  auditLogs: AuditLog[];
  appSettings: PengaturanAplikasi;
  paymentSettings: PengaturanPayment;

  // Active Midtrans Modal Triggers
  activeMidtransTrx: Transaksi | null;
  setActiveMidtransTrx: (trx: Transaksi | null) => void;

  // Search & Filter state for catalog
  catalogSearch: string;
  setCatalogSearch: (search: string) => void;
  catalogCategory: string;
  setCatalogCategory: (category: string) => void;
  selectedProductDetail: Produk | null;
  setSelectedProductDetail: (p: Produk | null) => void;

  // Actions
  createTransaction: (data: {
    produkId: string;
    namaPenyewa: string;
    noHpPenyewa: string;
    nikPenyewa: string;
    tanggalMulai: string;
    jamMulai: string;
    durasiHari: number;
    metodePembayaran: 'midtrans' | 'cash';
    lokasiPengambilan?: string;
  }) => Transaksi;

  updateTransactionStatus: (id: string, status: TransaksiStatus, karyawanId?: string) => void;
  uploadKTP: (transaksiId: string, fotoUrls: string[]) => void;
  
  // Admin & Operator Actions
  toggleMaintenanceMode: (enabled: boolean, message?: string) => void;
  addAuditLog: (log: Omit<AuditLog, 'id' | 'created_at'>) => void;
  updateUnitStatus: (unitId: string, status: UnitStatus) => void;
  addUnit: (unit: Omit<Unit, 'id'>) => void;
  addKaryawan: (karyawan: Omit<User, 'id' | 'created_at'>) => void;
  revokeSession: (sessionId: string) => void;
  addProduct: (produk: Omit<Produk, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Produk>) => void;
  processRefund: (transaksiId: string, alasan: string) => void;
  updateAppSettings: (settings: Partial<PengaturanAplikasi>) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  activeRole: 'guest',
  setActiveRole: (role) => {
    set({ activeRole: role });
    get().addAuditLog({
      user_id: role === 'admin' ? 'usr-admin-1' : role === 'karyawan' ? 'usr-karyawan-1' : 'usr-customer-1',
      user_nama: role === 'admin' ? 'Hendra Wijaya (Admin)' : role === 'karyawan' ? 'Ahmad Fauzi (Operator)' : 'Budi Santoso (Pelanggan)',
      user_role: role,
      aksi: 'SECURITY',
      entitas: 'role_switch',
      entitas_id: role,
      deskripsi: `Beralih ke tampilan role ${role.toUpperCase()} (Demo Mode)`,
      ip_address: '127.0.0.1 (Local Browser)'
    });
  },

  activeView: 'home',
  setActiveView: (view) => set({ activeView: view }),

  cart: [],
  addToCart: (produk, durasiHari, tanggalMulai, jamMulai) => {
    set((state) => {
      const existing = state.cart.find((item) => item.produk.id === produk.id);
      if (existing) {
        return {
          cart: state.cart.map((item) =>
            item.produk.id === produk.id ? { ...item, durasiHari, tanggalMulai, jamMulai } : item
          )
        };
      }
      return { cart: [...state.cart, { produk, durasiHari, tanggalMulai, jamMulai }] };
    });
  },
  removeFromCart: (produkId) => set((state) => ({ cart: state.cart.filter((item) => item.produk.id !== produkId) })),
  clearCart: () => set({ cart: [] }),

  products: INITIAL_PRODUCTS,
  units: INITIAL_UNITS,
  transactions: INITIAL_TRANSACTIONS,
  users: INITIAL_USERS,
  sessions: INITIAL_SESSIONS,
  auditLogs: INITIAL_AUDIT_LOGS,
  appSettings: INITIAL_APP_SETTINGS,
  paymentSettings: INITIAL_PAYMENT_SETTINGS,

  activeMidtransTrx: null,
  setActiveMidtransTrx: (trx) => set({ activeMidtransTrx: trx }),

  catalogSearch: '',
  setCatalogSearch: (search) => set({ catalogSearch: search }),
  catalogCategory: 'Semua',
  setCatalogCategory: (category) => set({ catalogCategory: category }),
  selectedProductDetail: null,
  setSelectedProductDetail: (p) => set({ selectedProductDetail: p }),

  createTransaction: (data) => {
    const products = get().products;
    const prod = products.find((p) => p.id === data.produkId) || products[0];
    const totalHarga = prod.harga_per_hari * data.durasiHari;
    
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const invoiceId = `INV-20260810-${randomCode}`;
    const now = new Date();
    
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + data.durasiHari);
    const endDateStr = endDate.toISOString().split('T')[0];

    const newTrx: Transaksi = {
      id: `trx-${Date.now()}`,
      invoice_id: invoiceId,
      user_id: 'usr-customer-1',
      produk_id: prod.id,
      produk_nama: prod.nama,
      produk_gambar: prod.gambar_url[0],
      nama_penyewa: data.namaPenyewa,
      no_hp_penyewa: data.noHpPenyewa,
      nik_penyewa: data.nikPenyewa,
      tanggal_mulai_sewa: data.tanggalMulai,
      jam_mulai_sewa: data.jamMulai,
      durasi_hari: data.durasiHari,
      tanggal_selesai_sewa: endDateStr,
      total_harga: totalHarga,
      status: data.metodePembayaran === 'cash' ? 'dibayar' : 'menunggu_pembayaran',
      metode_pembayaran: data.metodePembayaran,
      snap_token: `SNAP-TOKEN-${randomCode}`,
      midtrans_order_id: `ORDER-20260810-${randomCode}`,
      payment_deadline_at: new Date(now.getTime() + 15 * 60000).toISOString(),
      qr_code_url: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${invoiceId}`,
      qr_expires_at: new Date(endDate.getTime() + 12 * 3600000).toISOString(),
      lokasi_pengambilan: data.lokasiPengambilan || get().appSettings.lokasi_utama,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    };

    set((state) => ({
      transactions: [newTrx, ...state.transactions],
      products: state.products.map((p) => 
        p.id === prod.id ? { ...p, jumlah_unit_tersedia: Math.max(0, p.jumlah_unit_tersedia - 1) } : p
      )
    }));

    get().addAuditLog({
      user_id: 'usr-customer-1',
      user_nama: data.namaPenyewa,
      user_role: 'user',
      aksi: 'CREATE',
      entitas: 'transaksi',
      entitas_id: newTrx.id,
      deskripsi: `Membuat reservasi baru ${invoiceId} untuk ${prod.nama} (${data.durasiHari} hari). Total: Rp ${totalHarga.toLocaleString('id-ID')}`,
      ip_address: '114.122.35.101'
    });

    return newTrx;
  },

  updateTransactionStatus: (id, status, karyawanId) => {
    set((state) => ({
      transactions: state.transactions.map((trx) => {
        if (trx.id === id) {
          const updated = { ...trx, status, updated_at: new Date().toISOString() };
          if (karyawanId) updated.karyawan_id = karyawanId;
          return updated;
        }
        return trx;
      })
    }));

    const target = get().transactions.find((t) => t.id === id);
    if (target) {
      get().addAuditLog({
        user_id: karyawanId || 'usr-admin-1',
        user_nama: karyawanId ? 'Ahmad Fauzi (Operator)' : 'System Server',
        user_role: karyawanId ? 'karyawan' : 'admin',
        aksi: status === 'dibayar' ? 'PAYMENT' : status === 'qr_scanned' ? 'SCAN' : 'UPDATE',
        entitas: 'transaksi',
        entitas_id: id,
        deskripsi: `Status transaksi ${target.invoice_id} diperbarui menjadi ${status.toUpperCase()}`,
        ip_address: '182.253.120.50'
      });
    }
  },

  uploadKTP: (transaksiId, fotoUrls) => {
    const autoDeleteTime = new Date(Date.now() + 72 * 3600 * 1000).toISOString();

    set((state) => ({
      transactions: state.transactions.map((trx) => {
        if (trx.id === transaksiId) {
          return {
            ...trx,
            status: 'qr_scanned',
            identitas: {
              id: `ident-${Date.now()}`,
              transaksi_id: transaksiId,
              foto_url: fotoUrls,
              uploaded_by: 'usr-karyawan-1',
              uploaded_at: new Date().toISOString(),
              status_verifikasi: 'sesuai',
              dijadwalkan_hapus_at: autoDeleteTime
            }
          };
        }
        return trx;
      })
    }));

    get().addAuditLog({
      user_id: 'usr-karyawan-1',
      user_nama: 'Ahmad Fauzi (Operator)',
      user_role: 'karyawan',
      aksi: 'SCAN',
      entitas: 'identitas_penyewa',
      entitas_id: transaksiId,
      deskripsi: `Upload & Verifikasi Foto Identitas KTP (${fotoUrls.length} foto). Retensi PII 72 jam diaktifkan.`,
      ip_address: '182.253.120.50'
    });
  },

  toggleMaintenanceMode: (enabled, message) => {
    set((state) => ({
      appSettings: {
        ...state.appSettings,
        maintenance_mode: enabled,
        maintenance_pesan: message || state.appSettings.maintenance_pesan
      }
    }));

    get().addAuditLog({
      user_id: 'usr-admin-1',
      user_nama: 'Hendra Wijaya (Admin)',
      user_role: 'admin',
      aksi: 'MAINTENANCE',
      entitas: 'pengaturan_aplikasi',
      entitas_id: 'maintenance',
      deskripsi: `Maintenance Mode diubah menjadi ${enabled ? 'AKTIF (ON)' : 'NON-AKTIF (OFF)'}`,
      ip_address: '182.253.120.44'
    });
  },

  addAuditLog: (logData) => {
    const newLog: AuditLog = {
      ...logData,
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      created_at: new Date().toISOString()
    };
    set((state) => ({ auditLogs: [newLog, ...state.auditLogs] }));
  },

  updateUnitStatus: (unitId, status) => {
    set((state) => ({
      units: state.units.map((u) => (u.id === unitId ? { ...u, status } : u))
    }));

    get().addAuditLog({
      user_id: 'usr-admin-1',
      user_nama: 'Admin / Operator',
      user_role: 'admin',
      aksi: 'UPDATE',
      entitas: 'unit',
      entitas_id: unitId,
      deskripsi: `Status unit kendaraan ${unitId} diubah menjadi ${status.toUpperCase()}`,
      ip_address: '182.253.120.44'
    });
  },

  addUnit: (unitData) => {
    const newUnit: Unit = {
      ...unitData,
      id: `unit-${Date.now()}`
    };
    set((state) => ({ 
      units: [newUnit, ...state.units],
      products: state.products.map(p => p.id === unitData.produk_id ? { ...p, total_unit: p.total_unit + 1, jumlah_unit_tersedia: p.jumlah_unit_tersedia + 1 } : p)
    }));

    get().addAuditLog({
      user_id: 'usr-admin-1',
      user_nama: 'Hendra Wijaya (Admin)',
      user_role: 'admin',
      aksi: 'CREATE',
      entitas: 'unit',
      entitas_id: newUnit.id,
      deskripsi: `Menambahkan unit fisik baru dengan nomor plat ${newUnit.nomor_plat}`,
      ip_address: '182.253.120.44'
    });
  },

  addKaryawan: (karyawanData) => {
    const newEmp: User = {
      ...karyawanData,
      id: `usr-karyawan-${Date.now()}`,
      created_at: new Date().toISOString(),
      role: 'karyawan'
    };
    set((state) => ({ users: [...state.users, newEmp] }));

    get().addAuditLog({
      user_id: 'usr-admin-1',
      user_nama: 'Hendra Wijaya (Admin)',
      user_role: 'admin',
      aksi: 'CREATE',
      entitas: 'users',
      entitas_id: newEmp.id,
      deskripsi: `Menambahkan akun karyawan operator baru: ${newEmp.nama_lengkap} (${newEmp.email})`,
      ip_address: '182.253.120.44'
    });
  },

  revokeSession: (sessionId) => {
    set((state) => ({
      sessions: state.sessions.filter((s) => s.id !== sessionId)
    }));

    get().addAuditLog({
      user_id: 'usr-customer-1',
      user_nama: 'Budi Santoso',
      user_role: 'user',
      aksi: 'SECURITY',
      entitas: 'user_sessions',
      entitas_id: sessionId,
      deskripsi: `Mencabut akses session ID ${sessionId} dari profil perangkat.`,
      ip_address: '114.122.35.101'
    });
  },

  addProduct: (produkData) => {
    const newProd: Produk = {
      ...produkData,
      id: `prod-${Date.now()}`
    };
    set((state) => ({ products: [newProd, ...state.products] }));

    get().addAuditLog({
      user_id: 'usr-admin-1',
      user_nama: 'Hendra Wijaya (Admin)',
      user_role: 'admin',
      aksi: 'CREATE',
      entitas: 'produk',
      entitas_id: newProd.id,
      deskripsi: `Menambahkan armada motor baru: ${newProd.nama} (${newProd.cc}cc) - Rp ${newProd.harga_per_hari.toLocaleString('id-ID')}/hari`,
      ip_address: '182.253.120.44'
    });
  },

  updateProduct: (id, updates) => {
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p))
    }));

    get().addAuditLog({
      user_id: 'usr-admin-1',
      user_nama: 'Hendra Wijaya (Admin)',
      user_role: 'admin',
      aksi: 'UPDATE',
      entitas: 'produk',
      entitas_id: id,
      deskripsi: `Memperbarui informasi armada produk ID ${id}`,
      ip_address: '182.253.120.44'
    });
  },

  processRefund: (transaksiId, alasan) => {
    set((state) => ({
      transactions: state.transactions.map((trx) => {
        if (trx.id === transaksiId) {
          return { ...trx, status: 'refund', updated_at: new Date().toISOString() };
        }
        return trx;
      })
    }));

    const trx = get().transactions.find((t) => t.id === transaksiId);

    get().addAuditLog({
      user_id: 'usr-admin-1',
      user_nama: 'Hendra Wijaya (Admin)',
      user_role: 'admin',
      aksi: 'REFUND',
      entitas: 'transaksi',
      entitas_id: transaksiId,
      deskripsi: `Refund diproses via Midtrans API untuk ${trx?.invoice_id || transaksiId}. Alasan: ${alasan}. Nominal: Rp ${(trx?.total_harga || 0).toLocaleString('id-ID')}`,
      ip_address: '182.253.120.44'
    });
  },

  updateAppSettings: (settings) => {
    set((state) => ({ appSettings: { ...state.appSettings, ...settings } }));
    get().addAuditLog({
      user_id: 'usr-admin-1',
      user_nama: 'Hendra Wijaya (Admin)',
      user_role: 'admin',
      aksi: 'UPDATE',
      entitas: 'pengaturan_aplikasi',
      entitas_id: 'umum',
      deskripsi: 'Memperbarui konfigurasi informasi umum aplikasi',
      ip_address: '182.253.120.44'
    });
  }
}));
