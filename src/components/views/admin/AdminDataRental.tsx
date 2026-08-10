'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Transaksi } from '@/lib/types';
import { Search, Filter, Plus, Calendar, Eye, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import { AdminDetailRentalModal } from './AdminDetailRentalModal';

export const AdminDataRental: React.FC = () => {
  const { transactions } = useAppStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [karyawanFilter, setKaryawanFilter] = useState('Semua Karyawan');
  const [selectedTrxDetail, setSelectedTrxDetail] = useState<Transaksi | null>(null);

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = 
      t.invoice_id?.toLowerCase().includes(search.toLowerCase()) || 
      t.nama_penyewa?.toLowerCase().includes(search.toLowerCase()) || 
      t.no_hp_penyewa?.includes(search);
    const matchesStatus = statusFilter === 'Semua Status' || t.status === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Data Rental</h1>
          <p className="text-xs text-slate-500">Manajemen & riwayat seluruh sewa motor</p>
        </div>
      </div>

      {/* Filter Row (Responsive layout) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 flex-1">
          {/* Search */}
          <div className="relative min-w-[200px] flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari invoice, nama, atau no. HP..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 outline-hidden"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-2 sm:flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold"
            >
              <option value="Semua Status">Semua Status</option>
              <option value="Berlangsung">Berlangsung</option>
              <option value="Menunggu">Menunggu_pembayaran</option>
              <option value="Selesai">Selesai</option>
              <option value="Dibatalkan">Dibatalkan</option>
            </select>

            <select
              value={karyawanFilter}
              onChange={(e) => setKaryawanFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold"
            >
              <option value="Semua Karyawan">Semua Karyawan</option>
              <option value="Admin">Admin</option>
              <option value="Operator">Operator</option>
            </select>
          </div>
        </div>

        {/* Action button */}
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-purple-200">
          <Plus className="w-4 h-4" />
          <span>Sewa Manual (Walk-in)</span>
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Invoice & Penyewa</th>
                <th className="px-5 py-4 font-semibold">Unit & Durasi</th>
                <th className="px-5 py-4 font-semibold">Total Biaya</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((trx, i) => (
                <tr key={trx.id || i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="font-bold text-indigo-600 mb-0.5">{trx.invoice_id}</div>
                    <div className="font-medium text-slate-900">{trx.nama_penyewa}</div>
                    <div className="text-[10px] text-slate-500">{trx.no_hp_penyewa}</div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="font-bold text-slate-800">{trx.produk_nama}</div>
                    <div className="text-[10px] text-slate-500">{trx.tanggal_mulai_sewa} ({trx.durasi_hari} Hari)</div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="font-bold text-slate-900">Rp {trx.total_harga?.toLocaleString('id-ID')}</div>
                    <div className="text-[10px] text-slate-500">{trx.metode_pembayaran}</div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md font-bold text-[10px] capitalize">
                      {trx.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button 
                        onClick={() => setSelectedTrxDetail(trx)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Lihat Detail"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-slate-500">
                    Tidak ada data transaksi yang ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>Menampilkan 1 - 6 dari 85 data</span>

          <div className="flex items-center gap-1">
            <button className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-7 h-7 rounded-lg bg-purple-600 text-white font-bold flex items-center justify-center">
              1
            </button>
            <button className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50">
              2
            </button>
            <button className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

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
