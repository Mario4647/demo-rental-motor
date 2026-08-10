'use client';

import React from 'react';
import { Transaksi } from '@/lib/types';
import { useAppStore } from '@/lib/store';
import { X, ArrowLeft, Download, Bike, Calendar, Clock, MapPin, User, QrCode } from 'lucide-react';

interface AdminDetailRentalModalProps {
  transaction: Transaksi | null;
  onClose: () => void;
}

export const AdminDetailRentalModal: React.FC<AdminDetailRentalModalProps> = ({ transaction, onClose }) => {
  const { updateTransactionStatus } = useAppStore();

  if (!transaction) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-50 rounded-2xl max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-xl border border-slate-200 relative">
        
        {/* Header (Mockup 3) */}
        <div className="p-5 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Detail Rental</h2>
            <p className="text-xs text-slate-400">Dashboard / Data Rental / Detail</p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          {/* TOP GRID (3 CARDS matching Mockup 3) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Card 1: Informasi Rental */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                Informasi Rental
              </h3>
              <div className="text-xs space-y-2 text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Invoice:</span>
                  <span className="font-bold text-slate-900 font-mono">{transaction.invoice_id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Status:</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700">
                    Berlangsung
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Tanggal Dibuat:</span>
                  <span className="font-semibold text-slate-800">21 Jun 2024, 10:00 WIB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Karyawan:</span>
                  <span className="font-semibold text-slate-800">Admin</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Metode Pembayaran:</span>
                  <span className="font-semibold text-slate-800">Midtrans</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment Deadline:</span>
                  <span className="font-semibold text-slate-800">21 Jun 2024, 23:59 WIB</span>
                </div>
              </div>
            </div>

            {/* Card 2: Informasi Penyewa */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                Informasi Penyewa
              </h3>
              <div className="text-xs space-y-2 text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Nama:</span>
                  <span className="font-bold text-slate-900">{transaction.nama_penyewa}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">No. HP:</span>
                  <span className="font-semibold text-slate-800">{transaction.no_hp_penyewa}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">NIK:</span>
                  <span className="font-mono text-slate-800">{transaction.nik_penyewa}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Alamat:</span>
                  <span className="font-semibold text-slate-800 text-right">Jl. Merdeka No. 123, Jakarta</span>
                </div>
              </div>
            </div>

            {/* Card 3: QR Code Panel */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs text-center space-y-3 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 mb-3">
                  QR Code
                </h3>
                <img 
                  src={transaction.qr_code_url || `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${transaction.invoice_id}`}
                  alt="QR"
                  className="w-28 h-28 mx-auto border p-1 rounded-xl"
                />
                <span className="text-[10px] text-slate-400 block mt-1">Scan untuk verifikasi</span>
              </div>

              <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-1.5 rounded-xl text-xs flex items-center justify-center gap-1.5 border border-slate-200">
                <Download className="w-3.5 h-3.5" />
                <span>Download QR</span>
              </button>
            </div>

          </div>

          {/* MIDDLE GRID (3 CARDS matching Mockup 3) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Card 1: Informasi Unit */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                Informasi Unit
              </h3>
              <div className="text-xs space-y-2 text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Nama Unit:</span>
                  <span className="font-bold text-slate-900">Vario 125 - B 1234 ABC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Produk:</span>
                  <span className="font-semibold text-slate-800">Honda Vario 125</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Status:</span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-700">
                    Disewa
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: Detail Sewa */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                Detail Sewa
              </h3>
              <div className="text-xs space-y-2 text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Mulai Sewa:</span>
                  <span className="font-semibold text-slate-800">21 Jun 2024, 10:00 WIB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Durasi:</span>
                  <span className="font-semibold text-slate-800">3 Hari</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Selesai Sewa:</span>
                  <span className="font-semibold text-slate-800">24 Jun 2024, 10:00 WIB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Lokasi Pengambilan:</span>
                  <span className="font-semibold text-slate-800">Kantor Pusat</span>
                </div>
              </div>
            </div>

            {/* Card 3: Detail Pembayaran */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                Detail Pembayaran
              </h3>
              <div className="text-xs space-y-2 text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Harga:</span>
                  <span className="font-bold text-slate-900">Rp 450.000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Biaya:</span>
                  <span className="font-semibold text-slate-800">Rp 0</span>
                </div>
                <div className="flex justify-between border-t border-slate-100 pt-2 text-sm font-bold text-slate-900">
                  <span>Total:</span>
                  <span className="text-purple-600 font-black">Rp 450.000</span>
                </div>
              </div>
            </div>

          </div>

          {/* BOTTOM ACTION BUTTONS (Matching Mockup 3 Exactly) */}
          <div className="pt-4 border-t border-slate-200 bg-white p-4 rounded-2xl flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-rose-600 border border-rose-200 hover:bg-rose-50"
            >
              Batalkan Rental
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50"
              >
                Edit Rental
              </button>

              <button
                onClick={() => {
                  updateTransactionStatus(transaction.id, 'selesai');
                  onClose();
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-5 py-2 rounded-xl text-xs shadow-xs"
              >
                Update Status
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
