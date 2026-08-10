'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { 
  Bike, LayoutDashboard, FileText, Package, UserCheck, ShieldCheck, 
  Settings, LogOut, QrCode, RefreshCw, Activity, CreditCard, Users, 
  BarChart2, Menu, X, ChevronRight, UserPlus
} from 'lucide-react';

export const SidebarAdmin: React.FC = () => {
  const { activeView, setActiveView, activeRole, currentUser, logout } = useAppStore();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isOperator = activeRole === 'karyawan';

  const handleNavClick = (view: string) => {
    setActiveView(view);
    setIsMobileOpen(false);
  };

  const navItems = isOperator ? [
    { id: 'operator-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'operator-scan-qr', label: 'Scan QR & KTP', icon: QrCode },
    { id: 'operator-data-rental', label: 'Data Rental', icon: FileText },
  ] : [
    { id: 'admin-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'admin-data-rental', label: 'Data Rental', icon: FileText },
    { id: 'admin-produk', label: 'Produk', icon: Package },
    { id: 'admin-unit', label: 'Unit', icon: Bike },
    { id: 'admin-transaksi-pembayaran', label: 'Transaksi & Pembayaran', icon: CreditCard },
    { id: 'admin-pelanggan', label: 'Pelanggan', icon: UserCheck },
    { id: 'admin-karyawan', label: 'Karyawan', icon: Users },
    { id: 'admin-register-staff', label: 'Registrasi Staff', icon: UserPlus },
    { id: 'admin-laporan-audit', label: 'Laporan & Audit Log', icon: BarChart2 },
    { id: 'admin-pengaturan', label: 'Pengaturan', icon: Settings },
  ];

  return (
    <>
      {/* 1. MOBILE TOP NAVIGATION BAR (Visible on screens < lg) */}
      <div className="lg:hidden bg-white border-b border-slate-200/80 px-4 py-3 sticky top-0 z-40 flex items-center justify-between shadow-xs">
        <div 
          onClick={() => handleNavClick(isOperator ? 'operator-dashboard' : 'admin-dashboard')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-xs">
            <Bike className="w-4 h-4 stroke-[2.2]" />
          </div>
          <span className="text-base font-black text-slate-900 tracking-tight">
            Rent<span className="text-purple-600">Moto</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 rounded-full uppercase">
            {activeRole}
          </span>
          
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 border border-slate-200/80 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER OVERLAY BACKDROP */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 transition-opacity"
        />
      )}

      {/* 2. SIDEBAR CONTAINER (Mobile Drawer + Desktop Fixed Sidebar) */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-50 lg:z-30
        w-64 bg-white text-slate-800 h-screen lg:min-h-screen p-4 flex flex-col justify-between 
        border-r border-slate-200/80 shadow-sm lg:shadow-none
        transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div>
          {/* Brand Header */}
          <div className="hidden lg:flex items-center justify-between px-2 mb-6">
            <div 
              onClick={() => handleNavClick(isOperator ? 'operator-dashboard' : 'admin-dashboard')} 
              className="flex items-center gap-2.5 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-xs">
                <Bike className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span className="text-lg font-black text-slate-900 tracking-tight">
                Rent<span className="text-purple-600">Moto</span>
              </span>
            </div>

            <span className="text-[9px] font-extrabold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full uppercase">
              {activeRole}
            </span>
          </div>

          {/* User Profile Summary */}
          <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-2xl mb-5 flex items-center gap-3">
            <img 
              src={currentUser?.avatar_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'} 
              alt={currentUser?.nama_lengkap || 'Admin'} 
              className="w-10 h-10 rounded-xl object-cover border border-purple-200"
            />
            <div className="overflow-hidden">
              <h4 className="text-sm font-extrabold text-slate-900 truncate">{currentUser?.nama_lengkap || 'Admin'}</h4>
              <span className="text-xs font-semibold text-purple-600 truncate block">
                {isOperator ? 'Operator Cabang' : 'Administrator'}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-purple-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:scale-[0.98]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <button
            onClick={() => {
              logout();
              setIsMobileOpen(false);
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar Akun</span>
          </button>
        </div>
      </aside>
    </>
  );
};
