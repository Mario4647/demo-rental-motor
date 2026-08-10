'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { 
  Bike, QrCode, ArrowUpRight, CheckCircle2, AlertTriangle 
} from 'lucide-react';

export const OperatorDashboard: React.FC = () => {
  const { transactions, setActiveView } = useAppStore();

  const totalBerangkat = transactions.filter(t => t.status === 'berlangsung').length;
  const totalDibayarPendingScan = transactions.filter(t => t.status === 'dibayar').length;
  const totalSelesai = transactions.filter(t => t.status === 'selesai').length;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Dashboard Operator</h1>
          <p className="text-xs text-slate-400">Portal Operasional Lapangan - Stasiun Tebet</p>
        </div>

        <button
          onClick={() => setActiveView('operator-scan-qr')}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-xl shadow-xs transition-colors text-xs flex items-center gap-1.5"
        >
          <QrCode className="w-4 h-4" />
          <span>Scan QR & Verifikasi KTP</span>
        </button>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500">Unit Sedang Disewa</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalBerangkat}</div>
          <p className="text-[11px] text-slate-500 font-medium">Motor sedang di pelanggan</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500">Menunggu Scan QR</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <QrCode className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalDibayarPendingScan}</div>
          <p className="text-[11px] text-purple-600 font-bold">Siap diproses saat pelanggan datang</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500">Rental Selesai Hari Ini</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalSelesai}</div>
          <p className="text-[11px] text-slate-500 font-medium">Unit kembali & terverifikasi</p>
        </div>

      </div>

      {/* Early Warning Table */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Peringatan Dini Unit Hampir Habis Masa Sewa</h3>
              <p className="text-xs text-slate-400">Unit yang dijadwalkan kembali dalam waktu &lt;= 1 hari</p>
            </div>
          </div>
          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full">
            Early Warning Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-600">
            <thead className="text-[11px] text-slate-400 font-semibold bg-slate-50 border-y border-slate-100">
              <tr>
                <th className="px-4 py-2.5">Invoice</th>
                <th className="px-4 py-2.5">Penyewa</th>
                <th className="px-4 py-2.5">Kendaraan</th>
                <th className="px-4 py-2.5">Selesai Sewa</th>
                <th className="px-4 py-2.5">Sisa Waktu</th>
                <th className="px-4 py-2.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {transactions.filter(t => t.status === 'berlangsung').map((trx) => (
                <tr key={trx.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono font-bold text-purple-600">{trx.invoice_id}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">{trx.nama_penyewa} ({trx.no_hp_penyewa})</td>
                  <td className="px-4 py-3">{trx.produk_nama}</td>
                  <td className="px-4 py-3">{trx.tanggal_selesai_sewa}</td>
                  <td className="px-4 py-3 font-bold text-amber-600">Sisa 6 Jam</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setActiveView('operator-data-rental')}
                      className="bg-purple-50 hover:bg-purple-100 text-purple-700 px-3 py-1 rounded-lg font-bold text-xs"
                    >
                      Proses Unit Kembali
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
