import { create } from 'zustand';
import { 
  Role, Produk, Unit, Transaksi, AuditLog, PengaturanAplikasi, PengaturanPayment, 
  TransaksiStatus, UnitStatus, User, UserSession, AuthUser, AuthView 
} from './types';

// API helper with error handling
async function apiFetch<T>(url: string, options?: RequestInit): Promise<{ data?: T; error?: string }> {
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    const json = await res.json();
    if (!res.ok) {
      return { error: json.error || json.message || `Error ${res.status}` };
    }
    return { data: json };
  } catch {
    return { error: 'Koneksi gagal. Periksa jaringan Anda.' };
  }
}

interface AppState {
  // Auth State
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  authView: AuthView;
  setCurrentUser: (user: AuthUser | null) => void;
  setIsAuthenticated: (val: boolean) => void;
  setIsAuthLoading: (val: boolean) => void;
  setAuthView: (view: AuthView) => void;
  logout: () => Promise<void>;

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

  // Data Fetching
  isDataLoaded: boolean;
  fetchProducts: () => Promise<void>;
  fetchUnits: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  fetchUsers: (role?: string) => Promise<void>;
  fetchAuditLogs: () => Promise<void>;
  fetchSettings: () => Promise<void>;

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
  }) => Promise<Transaksi | null>;

  updateTransactionStatus: (id: string, status: TransaksiStatus, karyawanId?: string) => Promise<void>;
  uploadKTP: (transaksiId: string, fotoUrls: string[]) => Promise<void>;
  
  // Admin & Operator Actions
  toggleMaintenanceMode: (enabled: boolean, message?: string) => Promise<void>;
  updateUnitStatus: (unitId: string, status: UnitStatus) => Promise<void>;
  addUnit: (unit: Omit<Unit, 'id'>) => Promise<void>;
  addKaryawan: (karyawan: Omit<User, 'id' | 'created_at'>) => Promise<void>;
  revokeSession: (sessionId: string) => Promise<void>;
  addProduct: (produk: Omit<Produk, 'id'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Produk>) => Promise<void>;
  processRefund: (transaksiId: string, alasan: string) => Promise<void>;
  updateAppSettings: (settings: Partial<PengaturanAplikasi>) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Auth State
  currentUser: null,
  isAuthenticated: false,
  isAuthLoading: true,
  authView: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  setIsAuthenticated: (val) => set({ isAuthenticated: val }),
  setIsAuthLoading: (val) => set({ isAuthLoading: val }),
  setAuthView: (view) => set({ authView: view }),
  logout: async () => {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
    } catch { /* ignore */ }
    set({ 
      currentUser: null, 
      isAuthenticated: false, 
      activeRole: 'guest', 
      activeView: 'home',
      authView: null 
    });
  },

  activeRole: 'guest',
  setActiveRole: (role) => set({ activeRole: role }),

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

  // Empty initial data for real mode
  products: [],
  units: [],
  transactions: [],
  users: [],
  sessions: [],
  auditLogs: [],
  appSettings: {
    maintenance_mode: false,
    maintenance_pesan: '',
    durasi_sewa_min: 1,
    batas_bayar_menit: 15,
    lokasi_utama: '',
    kontak_whatsapp: '',
    kontak_email: ''
  },
  paymentSettings: { provider: 'midtrans', is_active: false, is_sandbox: true, client_key: '', server_key: '' },
  isDataLoaded: false,

  // Data Fetching from Supabase via API
  fetchProducts: async () => {
    const { data } = await apiFetch<{ data: Produk[] }>('/api/produk');
    if (data?.data) {
      set({ products: data.data });
    }
  },
  fetchUnits: async () => {
    const { data } = await apiFetch<{ data: Unit[] }>('/api/unit');
    if (data?.data) {
      set({ units: data.data });
    }
  },
  fetchTransactions: async () => {
    const { data } = await apiFetch<{ data: Transaksi[] }>('/api/transaksi');
    if (data?.data) {
      set({ transactions: data.data });
    }
  },
  fetchUsers: async (role?: string) => {
    const url = role ? `/api/users?role=${role}` : '/api/users';
    const { data } = await apiFetch<{ data: User[] }>(url);
    if (data?.data) {
      set({ users: data.data });
    }
  },
  fetchAuditLogs: async () => {
    const { data } = await apiFetch<{ data: AuditLog[] }>('/api/audit-logs');
    if (data?.data) {
      set({ auditLogs: data.data });
    }
  },
  fetchSettings: async () => {
    const { data } = await apiFetch<{ data: Record<string, string> }>('/api/settings');
    if (data?.data) {
      const s = data.data;
      set({
        appSettings: {
          maintenance_mode: s.maintenance_mode === 'true',
          maintenance_pesan: s.maintenance_pesan || '',
          maintenance_selesai_at: s.maintenance_selesai_at || undefined,
          durasi_sewa_min: parseInt(s.durasi_sewa_min || '1'),
          batas_bayar_menit: parseInt(s.batas_bayar_menit || '15'),
          lokasi_utama: s.lokasi_utama || '',
          kontak_whatsapp: s.kontak_whatsapp || '',
          kontak_email: s.kontak_email || ''
        }
      });
    }
  },

  activeMidtransTrx: null,
  setActiveMidtransTrx: (trx) => set({ activeMidtransTrx: trx }),

  catalogSearch: '',
  setCatalogSearch: (search) => set({ catalogSearch: search }),
  catalogCategory: 'Semua',
  setCatalogCategory: (category) => set({ catalogCategory: category }),
  selectedProductDetail: null,
  setSelectedProductDetail: (p) => set({ selectedProductDetail: p }),

  createTransaction: async (data) => {
    // Map camelCase to snake_case for backend validation
    const payload = {
      produk_id: data.produkId,
      nama_penyewa: data.namaPenyewa,
      no_hp_penyewa: data.noHpPenyewa,
      nik_penyewa: data.nikPenyewa,
      tanggal_mulai: data.tanggalMulai,
      jam_mulai: data.jamMulai,
      durasi_hari: data.durasiHari,
      metode_pembayaran: data.metodePembayaran,
      lokasi_pengambilan: data.lokasiPengambilan || '',
    };
    
    const { data: result, error } = await apiFetch<{ data: Transaksi }>('/api/transaksi', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (result?.data) {
      set((state) => ({ transactions: [result.data, ...state.transactions] }));
      await get().fetchProducts();
      return result.data;
    }
    if (error) console.error('Create transaction error:', error);
    return null;
  },

  updateTransactionStatus: async (id, status, karyawanId) => {
    await apiFetch(`/api/transaksi/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, karyawan_id: karyawanId }),
    });
    await get().fetchTransactions();
  },

  uploadKTP: async (transaksiId, fotoUrls) => {
    // Need a real endpoint here but for now just update status locally as a placeholder
    // In real mode this should call an API. Assuming /api/transaksi/[id]/ktp exists or similar.
    // For now we just call PATCH to update status since identitas logic might be complex.
    await apiFetch(`/api/transaksi/${transaksiId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'qr_scanned' }),
    });
    await get().fetchTransactions();
  },

  toggleMaintenanceMode: async (enabled, message) => {
    await apiFetch('/api/settings', {
      method: 'PATCH',
      body: JSON.stringify({ maintenance_mode: enabled.toString(), maintenance_pesan: message || '' }),
    });
    set((state) => ({
      appSettings: {
        ...state.appSettings,
        maintenance_mode: enabled,
        maintenance_pesan: message || state.appSettings.maintenance_pesan
      }
    }));
  },

  updateUnitStatus: async (unitId, status) => {
    // Assume PUT/PATCH endpoint
    await apiFetch(`/api/unit/${unitId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    await get().fetchUnits();
  },

  addUnit: async (unitData) => {
    const { data } = await apiFetch<{ data: Unit }>('/api/unit', {
      method: 'POST',
      body: JSON.stringify(unitData),
    });
    if (data?.data) {
      set((state) => ({
        units: [data.data, ...state.units],
        products: state.products.map(p => p.id === unitData.produk_id ? { ...p, total_unit: p.total_unit + 1, jumlah_unit_tersedia: p.jumlah_unit_tersedia + 1 } : p)
      }));
    }
  },

  addKaryawan: async (karyawanData) => {
    const { data } = await apiFetch<{ data: User }>('/api/auth/register-staff', {
      method: 'POST',
      body: JSON.stringify(karyawanData),
    });
    if (data?.data) {
      set((state) => ({ users: [...state.users, data.data] }));
    }
  },

  revokeSession: async (sessionId) => {
    await apiFetch(`/api/auth/sessions/${sessionId}`, { method: 'DELETE' });
    set((state) => ({
      sessions: state.sessions.filter((s) => s.id !== sessionId)
    }));
  },

  addProduct: async (produkData) => {
    const { data } = await apiFetch<{ data: Produk }>('/api/produk', {
      method: 'POST',
      body: JSON.stringify(produkData),
    });
    if (data?.data) {
      set((state) => ({ products: [data.data, ...state.products] }));
    }
  },

  updateProduct: async (id, updates) => {
    await apiFetch(`/api/produk/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    await get().fetchProducts();
  },

  processRefund: async (transaksiId, alasan) => {
    await apiFetch(`/api/transaksi/${transaksiId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'refund', alasan }),
    });
    await get().fetchTransactions();
  },

  updateAppSettings: async (settings) => {
    await apiFetch('/api/settings', {
      method: 'PATCH',
      body: JSON.stringify(settings),
    });
    set((state) => ({ appSettings: { ...state.appSettings, ...settings } }));
  }
}));
