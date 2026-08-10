'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Bike, Search, User, Menu, X, ShoppingBag } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { activeView, setActiveView, setActiveRole, cart } = useAppStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNav = (view: string) => {
    setActiveView(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div 
          onClick={() => handleNav('home')} 
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-xs">
            <Bike className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-xl font-black text-slate-900 tracking-tight">
            Rent<span className="text-purple-600">Moto</span>
          </span>
        </div>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
          <button 
            onClick={() => handleNav('home')}
            className={`hover:text-purple-600 transition-colors ${activeView === 'home' ? 'text-purple-600 font-bold' : ''}`}
          >
            Beranda
          </button>
          <button 
            onClick={() => handleNav('katalog')}
            className={`hover:text-purple-600 transition-colors ${activeView === 'katalog' ? 'text-purple-600 font-bold' : ''}`}
          >
            Katalog Motor
          </button>
          <button 
            onClick={() => handleNav('riwayat')}
            className={`hover:text-purple-600 transition-colors ${activeView === 'riwayat' ? 'text-purple-600 font-bold' : ''}`}
          >
            Cek Pesanan
          </button>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => setActiveRole('user')}
            className="bg-purple-600 hover:bg-purple-700 active:scale-95 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
          >
            <User className="w-4 h-4" />
            <span>Masuk / Daftar</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setActiveRole('user')}
            className="bg-purple-600 text-white p-2 rounded-xl text-xs font-bold"
          >
            <User className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200/80"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-2 text-xs font-semibold text-slate-700">
          <button 
            onClick={() => handleNav('home')}
            className="block w-full text-left py-2 hover:text-purple-600"
          >
            Beranda
          </button>
          <button 
            onClick={() => handleNav('katalog')}
            className="block w-full text-left py-2 hover:text-purple-600"
          >
            Katalog Motor
          </button>
          <button 
            onClick={() => handleNav('riwayat')}
            className="block w-full text-left py-2 hover:text-purple-600"
          >
            Cek Pesanan
          </button>
        </div>
      )}
    </header>
  );
};
