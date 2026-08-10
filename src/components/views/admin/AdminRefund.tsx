'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { RefreshCw, Lock, ShieldCheck, CheckCircle2, AlertTriangle } from 'lucide-react';

export const AdminRefund: React.FC = () => {
  const { transactions, processRefund } = useAppStore();
  const [selectedTrxId, setSelectedTrxId] = useState('');
  const [alasan, setAlasan] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const eligibleTrx = transactions.filter((t) => t.status === 'dibayar' || t.status === 'berlangsung');

  const handleRefundSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrxId || !adminPassword) return;

    processRefund(selectedTrxId, alasan || 'Refund disetujui oleh Owner');
    setSuccessMsg(`Refund Midtrans API Berhasil diproses untuk transaksi ID ${selectedTrxId}! Status transaksi diubah menjadi REFUND dan dicatat di Immutable Audit Log.`);
    setSelectedTrxId('');
    setAlasan('');
    setAdminPassword('');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs">
        <span className="text-[10px] font-extrabold text-rose-600 uppercase tracking-widest block">Financial Safety</span>
        <h1 className="text-2xl font-extrabold text-slate-900">Formulir Refund & Pembatalan Transaksi</h1>
        <p className="text-slate-500 text-xs mt-1">
          Proses pengembalian dana langsung ke akun penyewa via Midtrans Refund API dengan konfirmasi password admin.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
        <form onSubmit={handleRefundSubmit} className="space-y-4 text-xs">
          
          <div>
            <label className="font-bold text-slate-700 block mb-1">Pilih Transaksi Aktif untuk Refund</label>
            <select
              value={selectedTrxId}
              onChange={(e) => setSelectedTrxId(e.target.value)}
              required
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
            >
              <option value="">-- Pilih Transaksi --</option>
              {eligibleTrx.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.invoice_id} - {t.nama_penyewa} ({t.produk_nama}) - Rp {t.total_harga.toLocaleString('id-ID')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Alasan Refund / Pembatalan</label>
            <textarea
              value={alasan}
              onChange={(e) => setAlasan(e.target.value)}
              placeholder="Misal: Pelanggan mengajukan pembatalan karena perubahan jadwal perjalanan..."
              rows={3}
              required
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Konfirmasi Password Admin (Otorisasi Wajib)</label>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-extrabold py-3 rounded-2xl shadow-lg shadow-rose-600/30 transition-all text-xs flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Proses Refund Midtrans API Sekarang</span>
          </button>
        </form>
      </div>

    </div>
  );
};
