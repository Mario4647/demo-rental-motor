'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { 
  Bike, ShieldCheck, QrCode, Zap, Clock, ChevronRight, CheckCircle2, 
  MapPin, Star, ArrowRight, Sparkles
} from 'lucide-react';
import { Produk } from '@/lib/types';

interface HomeViewProps {
  onSelectProduct: (product: Produk) => void;
  onBookProduct: (product: Produk) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onSelectProduct, onBookProduct }) => {
  const { products, setActiveView } = useAppStore();

  const featuredProducts = products.slice(0, 3);

  return (
    <div className="space-y-12 pb-16">
      
      {/* 1. HERO SECTION (Solid Colors - NO GRADIENTS) */}
      <section className="relative min-h-[480px] bg-slate-900 text-white rounded-3xl overflow-hidden shadow-xl border border-slate-800 flex items-center">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80" 
            alt="RentMoto Banner" 
            className="w-full h-full object-cover opacity-25"
          />
        </div>

        <div className="relative z-10 max-w-3xl px-8 sm:px-12 py-12 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-purple-600/30 border border-purple-500/40 text-purple-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Platform Rental Motor Otomatis #1 di Indonesia</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Sewa Motor Cepat, <br />
            <span className="text-purple-400">
              Tanpa Ribet & Full Otomatis
            </span>
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl">
            Pesan motor impian Anda dalam hitungan menit. Pembayaran online aman via Midtrans, ambil unit instan dengan scan QR Code tanpa antre deposit tunai!
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={() => setActiveView('katalog')}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-xl shadow-xs transition-colors flex items-center gap-2 text-xs"
            >
              <Bike className="w-4 h-4" />
              <span>Sewa Motor Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveView('cara-sewa')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold px-5 py-3 rounded-xl transition-colors text-xs flex items-center gap-2"
            >
              <Clock className="w-4 h-4 text-purple-400" />
              <span>Lihat Cara Kerja</span>
            </button>
          </div>

          {/* Highlights Row */}
          <div className="pt-4 border-t border-slate-800 grid grid-cols-3 gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Unit 100% Terawat</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Helm & Jas Hujan Gratis</span>
            </div>
            <div className="flex items-center gap-1.5">
              <QrCode className="w-4 h-4 text-purple-400 shrink-0" />
              <span>QR Pick-up Instan</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTRODUCTION SECTION */}
      <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          <div className="space-y-4">
            <span className="px-3 py-1 bg-purple-50 text-purple-600 text-xs font-bold rounded-lg uppercase tracking-wider inline-block">
              Tentang RentMoto
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Solusi Digital Terbaik untuk Kebutuhan Transportasi Harian Anda
            </h2>
            <p className="text-slate-600 text-xs leading-relaxed">
              RentMoto menghadirkan pengalaman rental kendaraan masa depan. Kami menghilangkan prosedur manual yang berbelit-belit dengan mengintegrasikan verifikasi identitas terenkripsi, pembayaran digital terverifikasi server-side, dan pengambilan unit via QR Code yang siap dalam 5 detik di lokasi garasi.
            </p>

            <div className="space-y-2 pt-1 text-xs">
              <div className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <Zap className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900">Verifikasi QR Code Tanpa Kontak</h4>
                  <p className="text-slate-500 text-[11px]">Tunjukkan QR Code dari HP Anda kepada operator lapangan untuk verifikasi unit langsung.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900">Keamanan Data PII Terjamin (AES-256)</h4>
                  <p className="text-slate-500 text-[11px]">Data NIK & foto identitas Anda dienkripsi dan memiliki retensi auto-delete permanen 72 jam.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-xs border border-slate-200 aspect-4/3">
            <img 
              src="https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80" 
              alt="Motorcycle Showcase" 
              className="w-full h-full object-cover"
            />
          </div>

        </div>
      </section>

      {/* 3. PRODUCT SHOWCASE GRID */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Katalog Motor Populer</h2>
            <p className="text-slate-500 text-xs mt-0.5">Pilih dari armada motor matic, maxi, dan sport yang siap jalan hari ini.</p>
          </div>
          <button
            onClick={() => setActiveView('katalog')}
            className="text-purple-600 hover:text-purple-700 text-xs font-bold flex items-center gap-1"
          >
            <span>Lihat Semua Motor ({products.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProducts.map((prod) => (
            <div 
              key={prod.id} 
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden"
            >
              <div>
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  <img 
                    src={prod.gambar_url[0]} 
                    alt={prod.nama} 
                    className="w-full h-full object-cover"
                  />
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
      </section>

    </div>
  );
};
