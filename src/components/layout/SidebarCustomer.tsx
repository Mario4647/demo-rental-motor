'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { 
  Home, Bike, ShoppingBag, Clock, User, LogOut, ShieldCheck, ChevronRight 
} from 'lucide-react';

export const SidebarCustomer: React.FC = () => {
  const { activeView, setActiveView, setActiveRole, users } = useAppStore();
  const currentUser = users.find(u => u.role === 'user') || users[2];

  return (
    <aside className="w-60 bg-white border-r border-slate-200 min-h-screen p-4 flex flex-col justify-between sticky top-0 shadow-xs z-30">
      <div>
        {/* Brand */}
        <div 
          onClick={() => setActiveView('home')} 
          className="flex items-center gap-2.5 cursor-pointer px-2 mb-6"
        >
          <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-xs">
            <Bike className="w-4 h-4 stroke-[2.2]" />
          </div>
          <span className="text-lg font-black text-slate-900 tracking-tight">
            Rent<span className="text-purple-600">Moto</span>
          </span>
        </div>

        {/* Customer Profile Card */}
        <div className="bg-slate-50 border border-slate-200/80 p-2.5 rounded-xl mb-5 flex items-center gap-2.5">
          <img 
            src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'} 
            alt={currentUser.nama_lengkap} 
            className="w-8 h-8 rounded-full object-cover border border-purple-200"
          />
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-slate-900 truncate">{currentUser.nama_lengkap}</h4>
            <span className="text-[10px] font-semibold text-emerald-600 block">Akun Terverifikasi</span>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-1 text-xs">
          <p className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Navigasi Saya</p>

          <button
            onClick={() => setActiveView('home')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition-all ${
              activeView === 'home'
                ? 'bg-purple-600 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Home className="w-4 h-4" />
              <span>Beranda</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-40" />
          </button>

          <button
            onClick={() => setActiveView('katalog')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition-all ${
              activeView === 'katalog'
                ? 'bg-purple-600 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Bike className="w-4 h-4" />
              <span>Katalog Motor</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-40" />
          </button>

          <button
            onClick={() => setActiveView('riwayat')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition-all ${
              activeView === 'riwayat' || activeView === 'success-qr'
                ? 'bg-purple-600 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4" />
              <span>Riwayat Pesanan</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-40" />
          </button>

          <button
            onClick={() => setActiveView('profil')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition-all ${
              activeView === 'profil'
                ? 'bg-purple-600 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <User className="w-4 h-4" />
              <span>Profil & Keamanan</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-40" />
          </button>
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
