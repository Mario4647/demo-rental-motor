'use client';

import React from 'react';
import { Bike, ShieldCheck, MapPin, Phone, Mail, Clock, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
                <Bike className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight">
                Rent<span className="text-indigo-400">Moto</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Platform rental motor otomatis terlengkap di Indonesia dengan sistem verifikasi QR Code instan, verifikasi identitas aman, dan jaminan unit terawat 100%.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-950/50 p-2.5 rounded-xl border border-emerald-800/40">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Row-Level Security & Encrypted PII Active</span>
            </div>
          </div>

          {/* Col 2: Armada Populer */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Armada Populer</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="hover:text-white transition-colors cursor-pointer">Honda Vario 160 ABS</li>
              <li className="hover:text-white transition-colors cursor-pointer">Yamaha NMAX 155 Connected</li>
              <li className="hover:text-white transition-colors cursor-pointer">Honda BeAT Street Deluxe</li>
              <li className="hover:text-white transition-colors cursor-pointer">Vespa Primavera 150 i-Get</li>
              <li className="hover:text-white transition-colors cursor-pointer">Yamaha Aerox 155 Connected</li>
              <li className="hover:text-white transition-colors cursor-pointer">Kawasaki KLX 150 SE Trail</li>
            </ul>
          </div>

          {/* Col 3: Keamanan & Pembayaran */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Metode Pembayaran</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Didukung oleh Midtrans Payment Gateway dengan enkripsi SSL 256-bit dan proteksi anti-tampering.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="bg-slate-800 text-slate-300 text-[10px] font-bold px-2.5 py-1 rounded-md border border-slate-700">QRIS</span>
              <span className="bg-slate-800 text-slate-300 text-[10px] font-bold px-2.5 py-1 rounded-md border border-slate-700">BCA Virtual Account</span>
              <span className="bg-slate-800 text-slate-300 text-[10px] font-bold px-2.5 py-1 rounded-md border border-slate-700">Mandiri VA</span>
              <span className="bg-slate-800 text-slate-300 text-[10px] font-bold px-2.5 py-1 rounded-md border border-slate-700">GoPay / ShopeePay</span>
              <span className="bg-slate-800 text-slate-300 text-[10px] font-bold px-2.5 py-1 rounded-md border border-slate-700">Cash / Walk-in</span>
            </div>
          </div>

          {/* Col 4: Kontak & Lokasi */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Hubungi Kami</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>Garasi Utama RentMoto Tebet - Jl. Tebet Raya No. 45, Jakarta Selatan</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>+62 812-9876-5432 (WhatsApp CS 24/7)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>support@rentmoto.id</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Buka Setiap Hari: 07:00 - 22:00 WIB</span>
              </div>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 RentMoto Indonesia. Hak Cipta Dilindungi Undang-Undang.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Syarat & Ketentuan</span>
            <span className="hover:text-slate-400 cursor-pointer">Kebijakan Privasi PII</span>
            <span className="hover:text-slate-400 cursor-pointer">Dokumentasi Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
