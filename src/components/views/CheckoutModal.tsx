'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { Produk, Transaksi } from '@/lib/types';
import { 
  X, Bike, Calendar, Clock, MapPin, ShieldCheck, CreditCard, 
  Banknote, AlertCircle, Lock, ArrowRight, Timer
} from 'lucide-react';

interface CheckoutModalProps {
  product: Produk | null;
  onClose: () => void;
  onSuccess: (trx: Transaksi) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ product, onClose, onSuccess }) => {
  const { createTransaction, appSettings, currentUser, setActiveMidtransTrx } = useAppStore();

  const [durasiHari, setDurasiHari] = useState(2);
  const [tanggalMulai, setTanggalMulai] = useState('2026-08-11');
  const [jamMulai, setJamMulai] = useState('09:00');
  const [metodePembayaran, setMetodePembayaran] = useState<'midtrans' | 'cash'>('midtrans');
  const [agreeKtp, setAgreeKtp] = useState(false);

  // 15 Minutes Countdown Timer simulation
  const [timeLeft, setTimeLeft] = useState(15 * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!product) return null;

  const totalHarga = product.harga_per_hari * durasiHari;

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeKtp || !currentUser) {
      alert("Anda harus login untuk melakukan pemesanan.");
      return;
    }

    const newTrx = await createTransaction({
      produkId: product.id,
      namaPenyewa: currentUser.nama_lengkap,
      tanggalMulai,
      jamMulai,
      durasiHari,
      metodePembayaran,
      lokasiPengambilan: appSettings.lokasi_utama,
    });

    onClose();
    
    if (!newTrx) {
      alert("Gagal membuat transaksi");
      return;
    }

    if (metodePembayaran === 'midtrans') {
      // Trigger Midtrans Snap Popup Simulation Modal!
      setActiveMidtransTrx(newTrx);
    } else {
      onSuccess(newTrx);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div>
            <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest block">Checkout Pesanan</span>
            <h2 className="text-xl font-extrabold text-slate-900">Formulir Sewa & Pembayaran</h2>
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmitBooking} className="p-6 sm:p-8 space-y-6">
          
          {/* GRID LAYOUT (Design System 18.5 PRD) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* LEFT COLUMN: Vehicle & Rental Specs */}
            <div className="space-y-5">
              
              {/* Card 1: Vehicle Summary */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center gap-4">
                <img 
                  src={product.gambar_url[0]} 
                  alt={product.nama} 
                  className="w-20 h-20 rounded-xl object-cover border border-slate-200"
                />
                <div>
                  <span className="text-[10px] font-bold text-indigo-600 uppercase">{product.kategori}</span>
                  <h4 className="text-sm font-bold text-slate-900">{product.nama}</h4>
                  <p className="text-xs text-slate-500 font-medium">Rp {product.harga_per_hari.toLocaleString('id-ID')} / hari</p>
                  <span className="inline-block px-2 py-0.5 mt-1 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">
                    Stok Tersedia ({product.jumlah_unit_tersedia} Unit)
                  </span>
                </div>
              </div>

              {/* Card 2: User Info Auto-fill */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>Informasi Penyewa (Auto-fill)</span>
                </h4>
                <div className="text-xs space-y-1 text-slate-600">
                  <p><span className="font-semibold text-slate-800">Nama Lengkap:</span> {currentUser?.nama_lengkap || '-'}</p>
                  <p><span className="font-semibold text-slate-800">No. WhatsApp:</span> {currentUser?.no_hp || '-'}</p>
                  <p><span className="font-semibold text-slate-800">NIK (Enkripsi PII):</span> {currentUser?.nik || '***'}</p>
                </div>
              </div>

              {/* Card 3: Rental Schedule Details */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Detail Tanggal & Durasi</h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Tanggal Mulai Sewa</label>
                    <input 
                      type="date"
                      value={tanggalMulai}
                      onChange={(e) => setTanggalMulai(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Jam Ambil Unit</label>
                    <select
                      value={jamMulai}
                      onChange={(e) => setJamMulai(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600"
                    >
                      <option value="08:00">08:00 WIB</option>
                      <option value="09:00">09:00 WIB</option>
                      <option value="10:00">10:00 WIB</option>
                      <option value="13:00">13:00 WIB</option>
                      <option value="16:00">16:00 WIB</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Durasi Sewa (Hari)</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 5, 7].map((hari) => (
                      <button
                        key={hari}
                        type="button"
                        onClick={() => setDurasiHari(hari)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${
                          durasiHari === hari
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/30'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {hari} Hari
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pickup Location */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Lokasi Pengambilan Unit</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">{appSettings.lokasi_utama}</p>
                </div>

              </div>

            </div>

            {/* RIGHT COLUMN: Payment Summary & Countdown Timer */}
            <div className="space-y-5">
              
              {/* Highlight Countdown Timer (Design System 18.5 PRD) */}
              <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white p-4 rounded-2xl border border-emerald-800/60 shadow-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-400/30 animate-pulse">
                    <Timer className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block">Batas Waktu Booking</span>
                    <span className="text-xs text-slate-300">Konfirmasi stok otomatis</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black tracking-widest text-emerald-400 font-mono">
                    {formatTimer(timeLeft)}
                  </span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Pilih Metode Pembayaran</h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <div 
                    onClick={() => setMetodePembayaran('midtrans')}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                      metodePembayaran === 'midtrans'
                        ? 'bg-indigo-50/80 border-indigo-600 shadow-sm'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <CreditCard className={`w-5 h-5 ${metodePembayaran === 'midtrans' ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">Midtrans Online</h5>
                      <span className="text-[10px] text-slate-500 block">QRIS, VA, E-Wallet</span>
                    </div>
                  </div>

                  <div 
                    onClick={() => setMetodePembayaran('cash')}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                      metodePembayaran === 'cash'
                        ? 'bg-indigo-50/80 border-indigo-600 shadow-sm'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Banknote className={`w-5 h-5 ${metodePembayaran === 'cash' ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">Tunai / Walk-in</h5>
                      <span className="text-[10px] text-slate-500 block">Bayar saat ambil unit</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Ringkasan Pembayaran</h4>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Sewa {product.nama} ({durasiHari} hari)</span>
                  <span className="font-semibold text-slate-900">Rp {totalHarga.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Fasilitas Helm & Jas Hujan</span>
                  <span className="font-semibold text-emerald-600">GRATIS</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Biaya Layanan Midtrans</span>
                  <span className="font-semibold text-emerald-600">Rp 0</span>
                </div>
                <div className="border-t border-slate-200 pt-2.5 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-900 uppercase">Total Pembayaran</span>
                  <span className="text-xl font-black text-indigo-600">Rp {totalHarga.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Checkbox KTP Agreement (Design System 18.5 PRD - Mandatory before Pay button is enabled) */}
              <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl flex items-start gap-2.5">
                <input 
                  type="checkbox"
                  id="agreeKtp"
                  checked={agreeKtp}
                  onChange={(e) => setAgreeKtp(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                />
                <label htmlFor="agreeKtp" className="text-[11px] text-slate-700 font-medium cursor-pointer leading-tight">
                  Saya menyetujui bahwa nama pada akun ini cocok dengan <span className="font-bold">KTP asli</span> yang akan ditunjukkan dan di-scan oleh operator saat pengambilan unit motor.
                </label>
              </div>

            </div>

          </div>

          {/* Action Buttons Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 border border-slate-200 hover:bg-slate-100 transition-colors"
            >
              Batalkan Pesanan
            </button>

            <button
              type="submit"
              disabled={!agreeKtp}
              className={`px-7 py-3 rounded-2xl text-xs font-extrabold shadow-xl transition-all flex items-center gap-2 ${
                agreeKtp
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/35 transform hover:-translate-y-0.5'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              <span>{metodePembayaran === 'midtrans' ? 'Lanjut ke Pembayaran Midtrans' : 'Konfirmasi Reservasi Tunai'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
