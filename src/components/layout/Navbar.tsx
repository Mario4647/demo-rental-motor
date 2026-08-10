'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { ShoppingBag, Bike, LogIn, User as UserIcon } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { activeView, setActiveView, cart, activeRole, setActiveRole } = useAppStore();

  const totalCartCount = cart.length;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveView('home')} 
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-xs">
            <Bike className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-xl font-black text-slate-900 tracking-tight">
              Rent<span className="text-purple-600">Moto</span>
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveView('home')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeView === 'home'
                ? 'bg-white text-purple-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Beranda
          </button>
          <button
            onClick={() => setActiveView('katalog')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeView === 'katalog'
                ? 'bg-white text-purple-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Katalog Motor
          </button>
          <button
            onClick={() => setActiveView('cara-sewa')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeView === 'cara-sewa'
                ? 'bg-white text-purple-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cara Sewa
          </button>
          <button
            onClick={() => setActiveView('faq')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeView === 'faq'
                ? 'bg-white text-purple-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            FAQ & Keamanan
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('keranjang')}
            className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-purple-600 transition-colors"
            title="Keranjang Sewa"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                {totalCartCount}
              </span>
            )}
          </button>

          {activeRole === 'guest' ? (
            <button
              onClick={() => setActiveRole('user')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveView('riwayat')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-200"
            >
              <UserIcon className="w-4 h-4 text-purple-600" />
              <span>Dashboard Saya</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
