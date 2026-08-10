'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Transaksi } from '@/lib/types';
import { Search, CreditCard, RefreshCw, Eye, Download, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { AdminDetailRentalModal } from './AdminDetailRentalModal';

export const AdminTransaksiPembayaran: React.FC = () => {
  const { transactions, processRefund, updateTransactionStatus } = useAppStore();
  const [search, setSearch] = useState('');
  const [selectedTrxDetail, setSelectedTrxDetail] = useState<Transaksi | null>(null);

  // Refund Form State inside Transaksi & Pembayaran
  const [selectedRefundTrxId, setSelectedRefundTrxId] = useState('');
  const [alasanRefund, setAlasanRefund] = useState('');
  const [refundMsg, setRefundMsg] = useState('');

  const filtered = transactions.filter(t => 
    t.invoice_id.toLowerCase().includes(search.toLowerCase()) || 
    t.nama_penyewa.toLowerCase().includes(search.toLowerCase()) ||
    (t.midtrans_order_id && t.midtrans_order_id.toLowerCase().includes(search.toLowerCase()))
  );

  const handleRefundSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRefundTrxId) return;

    processRefund(selectedRefundTrxId, alasanRefund || 'Refund diproses oleh Admin');
    setRefundMsg(`Refund Midtrans API Berhasil diproses untuk ID ${selectedRefundTrxId}! Status diubah ke REFUND.`);
    setSelectedRefundTrxId('');
    setAlasanRefund('');

    setTimeout(() => setRefundMsg(''), 4000);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Transaksi & Pembayaran</h1>
          <p className="text-xs text-slate-400">Dashboard / Transaksi & Pembayaran</p>
        </div>
      </div>

      {refundMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{refundMsg}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari Invoice, Order ID Midtrans, atau Nama..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
          />
        </div>
      </div>

      {/* Consolidated Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-600">
            <thead className="text-[11px] text-slate-400 font-semibold bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-5 py-3">Invoice</th>
                <th className="px-5 py-3">Order ID Midtrans</th>
                <th className="px-5 py-3">Penyewa</th>
                <th className="px-5 py-3">Motor</th>
                <th className="px-5 py-3">Metode</th>
                <th className="px-5 py-3">Total Bayar</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((trx) => (
                <tr key={trx.id} className="hover:bg-slate-50">
                  <td 
                    onClick={() => setSelectedTrxDetail(trx)}
                    className="px-5 py-3.5 font-mono font-bold text-purple-600 hover:underline cursor-pointer"
                  >
                    {trx.invoice_id}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-[11px] text-slate-500">{trx.midtrans_order_id || 'ORDER-CASH'}</td>
                  <td className="px-5 py-3.5 font-semibold text-slate-900">{trx.nama_penyewa}</td>
                  <td className="px-5 py-3.5 text-slate-700">{trx.produk_nama}</td>
                  <td className="px-5 py-3.5 uppercase font-bold text-[10px] text-slate-600">{trx.metode_pembayaran}</td>
                  <td className="px-5 py-3.5 font-bold text-slate-900">Rp {trx.total_harga.toLocaleString('id-ID')}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      trx.status === 'dibayar' || trx.status === 'selesai' ? 'bg-emerald-100 text-emerald-700' :
                      trx.status === 'berlangsung' ? 'bg-purple-100 text-purple-700' :
                      trx.status === 'refund' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {trx.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right space-x-1">
                    <button
                      onClick={() => setSelectedTrxDetail(trx)}
                      className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
                      title="Lihat Detail Modal"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Embedded Refund Panel */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <RefreshCw className="w-4 h-4 text-purple-600" />
          <span>Proses Refund Midtrans API</span>
        </h3>

        <form onSubmit={handleRefundSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Pilih Transaksi Refund</label>
            <select
              value={selectedRefundTrxId}
              onChange={(e) => setSelectedRefundTrxId(e.target.value)}
              required
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            >
              <option value="">-- Pilih Transaksi --</option>
              {transactions.filter(t => t.status === 'dibayar' || t.status === 'berlangsung').map(t => (
                <option key={t.id} value={t.id}>{t.invoice_id} - {t.nama_penyewa} (Rp {t.total_harga.toLocaleString('id-ID')})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Alasan Refund</label>
            <input
              type="text"
              placeholder="Alasan pembatalan..."
              value={alasanRefund}
              onChange={(e) => setAlasanRefund(e.target.value)}
              required
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-xs transition-colors"
            >
              Proses Refund Sekarang
            </button>
          </div>
        </form>
      </div>

      {/* Detail Modal */}
      {selectedTrxDetail && (
        <AdminDetailRentalModal
          transaction={selectedTrxDetail}
          onClose={() => setSelectedTrxDetail(null)}
        />
      )}

    </div>
  );
};
