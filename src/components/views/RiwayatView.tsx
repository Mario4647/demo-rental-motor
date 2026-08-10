'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { Transaksi, TransaksiStatus } from '@/lib/types';
import { Clock, QrCode, Bike, FileText, ChevronRight, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

interface RiwayatViewProps {
  onViewSuccessQR: (trx: Transaksi) => void;
}

export const RiwayatView: React.FC<RiwayatViewProps> = ({ onViewSuccessQR }) => {
  const { transactions, updateTransactionStatus } = useAppStore();

  const getStatusBadge = (status: TransaksiStatus) => {
    switch (status) {
      case 'berlangsung':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'menunggu_pembayaran':
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'dibayar':
      case 'selesai':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'qr_scanned':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'dibatalkan':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'refund':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest block">Dashboard Saya</span>
          <h1 className="text-2xl font-extrabold text-slate-900">Riwayat Pesanan & Transaksi</h1>
          <p className="text-slate-500 text-xs mt-1">Daftar reservasi motor dan status tiket QR Code Anda.</p>
        </div>
        <div className="bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-600 font-semibold flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-600" />
          <span>Total {transactions.length} Pesanan</span>
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        {transactions.map((trx) => (
          <div 
            key={trx.id}
            className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all space-y-4"
          >
            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-extrabold text-slate-900">{trx.invoice_id}</span>
                <span className="text-[11px] text-slate-400 font-medium">• Dibuat: {new Date(trx.created_at).toLocaleDateString('id-ID')}</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold border uppercase tracking-wider self-start sm:self-auto ${getStatusBadge(trx.status)}`}>
                {trx.status.replace('_', ' ')}
              </span>
            </div>

            {/* Content row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              
              {/* Motor & Dates */}
              <div className="flex items-center gap-3 md:col-span-2">
                <img 
                  src={trx.produk_gambar} 
                  alt={trx.produk_nama} 
                  className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{trx.produk_nama}</h4>
                  <p className="text-xs text-slate-500 font-medium">
                    Sewa {trx.durasi_hari} Hari ({trx.tanggal_mulai_sewa} s/d {trx.tanggal_selesai_sewa})
                  </p>
                  <span className="text-[11px] text-indigo-600 font-bold block mt-0.5">
                    Total: Rp {trx.total_harga.toLocaleString('id-ID')} ({trx.metode_pembayaran.toUpperCase()})
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-start md:justify-end gap-2">
                {(trx.status === 'dibayar' || trx.status === 'berlangsung' || trx.status === 'qr_scanned') && (
                  <button
                    onClick={() => onViewSuccessQR(trx)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-indigo-600/25 transition-all flex items-center gap-1.5"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Lihat QR Code</span>
                  </button>
                )}

                {trx.status === 'menunggu_pembayaran' && (
                  <button
                    onClick={() => updateTransactionStatus(trx.id, 'dibatalkan')}
                    className="bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 px-3 py-2 rounded-xl text-xs font-semibold transition-colors"
                  >
                    Batalkan
                  </button>
                )}

                <button
                  onClick={() => onViewSuccessQR(trx)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl text-xs font-semibold transition-colors"
                >
                  Detail
                </button>
              </div>

            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
