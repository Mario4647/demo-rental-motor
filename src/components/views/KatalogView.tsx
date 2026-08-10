'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Produk } from '@/lib/types';
import { Search, Filter, Bike, X, Info } from 'lucide-react';

interface KatalogViewProps {
  onSelectProduct: (product: Produk) => void;
  onBookProduct: (product: Produk) => void;
}

export const KatalogView: React.FC<KatalogViewProps> = ({ onSelectProduct, onBookProduct }) => {
  const { products } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const categories = ['Semua', 'Matic Premium', 'Maxi Scooter', 'Matic Irit', 'Classic Elegant', 'Sporty Scooter', 'Trail / Off-road'];

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.nama.toLowerCase().includes(searchTerm.toLowerCase()) || p.deskripsi.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Semua' || p.kategori.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header (No gradients) */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xs border border-slate-800 space-y-3">
        <span className="px-3 py-1 bg-purple-600/30 text-purple-300 text-xs font-bold rounded-lg uppercase tracking-wider inline-block">
          Armada RentMoto
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight">Katalog Motor Lengkap</h1>
        <p className="text-slate-300 text-xs max-w-xl">
          Semua armada terawat secara berkala, siap pakai, lengkap dengan 2 helm SNI dan 2 jas hujan. Pilih motor pilihan Anda dan pesan secara instan.
        </p>

        {/* Search & Filter Header */}
        <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama motor (misal: NMAX, Vario, BeAT, Vespa)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800 text-white placeholder-slate-400 pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 text-xs"
            />
          </div>

          <div className="relative">
            <Filter className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-800 text-white pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 text-xs appearance-none font-semibold cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-slate-900 text-white">
                  Kategori: {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((prod) => (
          <div 
            key={prod.id} 
            className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden"
          >
            <div>
              <div className="relative h-44 bg-slate-100 overflow-hidden">
                <img src={prod.gambar_url[0]} alt={prod.nama} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  {prod.kategori}
                </div>
              </div>

              <div className="p-4 space-y-2">
                <h3 
                  onClick={() => onSelectProduct(prod)}
                  className="text-sm font-bold text-slate-900 hover:text-purple-600 cursor-pointer transition-colors"
                >
                  {prod.nama}
                </h3>
                <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
                  {prod.deskripsi}
                </p>
              </div>
            </div>

            <div className="p-4 pt-0 border-t border-slate-100 mt-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block">Harga Sewa</span>
                <div className="text-purple-600 font-bold text-base">
                  Rp {prod.harga_per_hari.toLocaleString('id-ID')}
                  <span className="text-slate-400 text-xs font-normal"> /hari</span>
                </div>
              </div>

              <button
                onClick={() => onBookProduct(prod)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors"
              >
                Sewa
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
