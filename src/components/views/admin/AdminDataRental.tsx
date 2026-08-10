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

  const mockTableData = [
    { invoice: 'INV-20240621-0001', penyewa: 'Budi Santoso', unit: 'Vario 125', mulai: '21 Jun 2024', durasi: '3 Hari', total: 'Rp 450.000', status: 'Berlangsung', badgeClass: 'bg-purple-100 text-purple-700' },
    { invoice: 'INV-20240621-0002', penyewa: 'Andi Wijaya', unit: 'Beat 2023', mulai: '21 Jun 2024', durasi: '2 Hari', total: 'Rp 300.000', status: 'Menunggu', badgeClass: 'bg-amber-100 text-amber-700' },
    { invoice: 'INV-20240620-0003', penyewa: 'Siti Rahma', unit: 'NMAX 155', mulai: '20 Jun 2024', durasi: '5 Hari', total: 'Rp 900.000', status: 'Selesai', badgeClass: 'bg-emerald-100 text-emerald-700' },
    { invoice: 'INV-20240620-0004', penyewa: 'Budi Hermawan', unit: 'PCX 160', mulai: '20 Jun 2024', durasi: '3 Hari', total: 'Rp 550.000', status: 'Berlangsung', badgeClass: 'bg-purple-100 text-purple-700' },
    { invoice: 'INV-20240620-0005', penyewa: 'Diki Prakoso', unit: 'Vario 160', mulai: '20 Jun 2024', durasi: '2 Hari', total: 'Rp 400.000', status: 'Selesai', badgeClass: 'bg-emerald-100 text-emerald-700' },
    { invoice: 'INV-20240620-0006', penyewa: 'Maya Sari', unit: 'Scoopy', mulai: '19 Jun 2024', durasi: '1 Hari', total: 'Rp 150.000', status: 'Dibatalkan', badgeClass: 'bg-rose-100 text-rose-700' },
  ];

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
              <option value="Menunggu">Menunggu</option>
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
        <button
          onClick={() => setSelectedTrxDetail(transactions[0])}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-xs transition-colors flex items-center justify-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Rental</span>
        </button>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        
        {/* Desktop Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-600">
            <thead className="text-[11px] text-slate-400 font-semibold bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-4 py-3">Invoice</th>
                <th className="px-4 py-3">Penyewa</th>
                <th className="px-4 py-3">Unit</th>
                <th className="px-4 py-3">Mulai</th>
                <th className="px-4 py-3">Durasi</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {mockTableData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td 
                    onClick={() => setSelectedTrxDetail(transactions[0])}
                    className="px-4 py-3.5 font-bold text-purple-600 hover:underline cursor-pointer font-mono"
                  >
                    {row.invoice}
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-slate-900">{row.penyewa}</td>
                  <td className="px-4 py-3.5 text-slate-700">{row.unit}</td>
                  <td className="px-4 py-3.5 text-slate-600">{row.mulai}</td>
                  <td className="px-4 py-3.5 text-slate-600">{row.durasi}</td>
                  <td className="px-4 py-3.5 font-bold text-slate-900">{row.total}</td>
                  <td className="px-4 py-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${row.badgeClass}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button 
                      onClick={() => setSelectedTrxDetail(transactions[0])}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
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
