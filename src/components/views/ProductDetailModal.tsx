'use client';

import React from 'react';
import { Produk } from '@/lib/types';
import { X, Bike, Check, ShieldCheck, Clock, MapPin, Fuel, Shield } from 'lucide-react';

interface ProductDetailModalProps {
  product: Produk | null;
  onClose: () => void;
  onBook: (product: Produk) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose, onBook }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image Banner */}
        <div className="relative h-64 bg-slate-900">
          <img 
            src={product.gambar_url[0]} 
            alt={product.nama} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between text-white">
            <div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-indigo-600 text-white uppercase tracking-wider">
                {product.kategori}
              </span>
              <h2 className="text-2xl font-black mt-1.5">{product.nama}</h2>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-300 block uppercase font-semibold">Harga Sewa</span>
              <div className="text-2xl font-black text-indigo-400">
                Rp {product.harga_per_hari.toLocaleString('id-ID')}
                <span className="text-xs font-normal text-slate-300"> /hari</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Quick Specs Bar */}
          <div className="grid grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <Fuel className="w-4 h-4 text-indigo-600 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Kapasitas Mesin</span>
                <span className="font-bold">{product.cc} CC</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Fasilitas Gratis</span>
                <span className="font-bold">2 Helm + Jas Hujan</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-violet-600 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Status Unit</span>
                <span className="font-bold text-emerald-600">{product.jumlah_unit_tersedia} Unit Ready</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Deskripsi Kendaraan</h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{product.deskripsi}</p>
          </div>

          {/* Features */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Fitur Unggulan & Spesifikasi</h4>
            <div className="grid grid-cols-2 gap-2">
              {product.fitur.map((fitur, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span className="font-medium">{fitur}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Guaranteed Security Note */}
          <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl flex items-start gap-3 text-xs text-indigo-900">
            <Shield className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Garansi Layanan RentMoto</span>
              <p className="text-[11px] text-indigo-700 mt-0.5">
                Pengambilan unit cepat dengan QR Code. Jika unit bermasalah dalam 2 jam pertama, kami siap ganti unit tanpa biaya tambahan.
              </p>
            </div>
          </div>

        </div>

        {/* Modal Action Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-3xl flex items-center justify-between">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Batal
          </button>
          
          <button
            onClick={() => {
              onClose();
              onBook(product);
            }}
            disabled={product.jumlah_unit_tersedia === 0}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
          >
            <Bike className="w-4 h-4" />
            <span>Lanjut ke Formulir Sewa</span>
          </button>
        </div>

      </div>
    </div>
  );
};
