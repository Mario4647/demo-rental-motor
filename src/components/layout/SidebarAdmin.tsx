'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { 
  Bike, LayoutDashboard, FileText, Package, UserCheck, ShieldCheck, 
  Settings, LogOut, QrCode, RefreshCw, Activity, CreditCard, Users, 
  BarChart2, ShieldAlert
} from 'lucide-react';

export const SidebarAdmin: React.FC = () => {
  const { activeView, setActiveView, activeRole, setActiveRole, users, appSettings } = useAppStore();

  const isOperator = activeRole === 'karyawan';
  const currentUser = users.find(u => u.role === activeRole) || users[0];

  return (
    <aside className="w-60 bg-white text-slate-800 min-h-screen p-4 flex flex-col justify-between sticky top-0 border-r border-slate-200 shadow-xs z-30">
      <div>
        {/* Brand Logo - RentMoto */}
        <div 
          onClick={() => setActiveView(isOperator ? 'operator-dashboard' : 'admin-dashboard')} 
          className="flex items-center gap-2.5 cursor-pointer px-2 mb-6"
        >
          <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-xs">
            <Bike className="w-4 h-4 stroke-[2.2]" />
          </div>
          <span className="text-lg font-black text-slate-900 tracking-tight">
            Rent<span className="text-purple-600">Moto</span>
          </span>
        </div>

        {/* User Profile Card */}
        <div className="bg-slate-50 border border-slate-200/80 p-2.5 rounded-xl mb-5 flex items-center gap-2.5">
          <img 
            src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'} 
            alt={currentUser.nama_lengkap} 
            className="w-8 h-8 rounded-full object-cover border border-purple-200"
          />
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-slate-900 truncate">{currentUser.nama_lengkap}</h4>
            <span className="text-[10px] font-semibold text-purple-600 uppercase block -mt-0.5">
              {activeRole === 'admin' ? 'Super Admin' : 'Operator Lapangan'}
            </span>
          </div>
        </div>

        {/* Sidebar Menu Items */}
        <div className="space-y-1 text-xs">
          
          {isOperator ? (
            <>
              <button
                onClick={() => setActiveView('operator-dashboard')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-all ${
                  activeView === 'operator-dashboard'
                    ? 'bg-purple-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => setActiveView('operator-scan-qr')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-all ${
                  activeView === 'operator-scan-qr'
                    ? 'bg-purple-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>Scan QR & KTP</span>
              </button>

              <button
                onClick={() => setActiveView('operator-data-rental')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-all ${
                  activeView === 'operator-data-rental'
                    ? 'bg-purple-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Data Rental</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveView('admin-dashboard')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-all ${
                  activeView === 'admin-dashboard'
                    ? 'bg-purple-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => setActiveView('admin-data-rental')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-all ${
                  activeView === 'admin-data-rental'
                    ? 'bg-purple-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Data Rental</span>
              </button>

              <button
                onClick={() => setActiveView('admin-produk')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-all ${
                  activeView === 'admin-produk'
                    ? 'bg-purple-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Produk</span>
              </button>

              <button
                onClick={() => setActiveView('admin-unit')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-all ${
                  activeView === 'admin-unit'
                    ? 'bg-purple-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Bike className="w-4 h-4" />
                <span>Unit</span>
              </button>

              {/* Consolidated Transaksi & Pembayaran */}
              <button
                onClick={() => setActiveView('admin-transaksi-pembayaran')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-all ${
                  activeView === 'admin-transaksi-pembayaran'
                    ? 'bg-purple-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Transaksi & Pembayaran</span>
              </button>

              {/* Pelanggan (User Role Only) */}
              <button
                onClick={() => setActiveView('admin-pelanggan')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-all ${
                  activeView === 'admin-pelanggan'
                    ? 'bg-purple-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Pelanggan</span>
              </button>

              {/* Karyawan (Karyawan Role Only) */}
              <button
                onClick={() => setActiveView('admin-karyawan')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-all ${
                  activeView === 'admin-karyawan'
                    ? 'bg-purple-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Karyawan</span>
              </button>

              {/* Consolidated Laporan & Audit Log */}
              <button
                onClick={() => setActiveView('admin-laporan-audit')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-all ${
                  activeView === 'admin-laporan-audit'
                    ? 'bg-purple-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <BarChart2 className="w-4 h-4" />
                <span>Laporan & Audit Log</span>
              </button>

              <button
                onClick={() => setActiveView('admin-pengaturan')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-all ${
                  activeView === 'admin-pengaturan'
                    ? 'bg-purple-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Pengaturan</span>
              </button>
            </>
          )}

        </div>
      </div>

      {/* Logout */}
      <div className="pt-4 border-t border-slate-100">
        <button
          onClick={() => setActiveRole('guest')}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
