'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { TransaksiStatus } from '@/lib/types';
import { Search, Filter, ArrowUpRight, CheckCircle2, XCircle, Download, Bike } from 'lucide-react';

export const OperatorDataRental: React.FC = () => {
  const { transactions, updateTransactionStatus } = useAppStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Semua');

  const filtered = transactions.filter((t) => {
    const matchesSearch = t.invoice_id.toLowerCase().includes(search.toLowerCase()) || t.nama_penyewa.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'Semua' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 pb-16">
      
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest block">Operator Task Table</span>
          <h1 className="text-2xl font-extrabold text-slate-900">Data Rental & Keberangkatan Unit</h1>
          <p className="text-slate-500 text-xs mt-1">Kelola tombol Unit Berangkat dan Unit Kembali secara real-time.</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Cari Invoice atau Nama Penyewa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-600"
          />
        </div>
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-600 font-semibold"
          >
            <option value="Semua">Semua Status Rental</option>
            <option value="dibayar">Dibayar (Pending QR)</option>
            <option value="qr_scanned">QR Scanned (Ready Berangkat)</option>
            <option value="berlangsung">Berlangsung (Di Pelanggan)</option>
            <option value="selesai">Selesai (Sudah Kembali)</option>
            <option value="dibatalkan">Dibatalkan</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-600">
            <thead className="text-[11px] text-slate-400 uppercase bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-5 py-3.5">Invoice</th>
                <th className="px-5 py-3.5">Penyewa</th>
                <th className="px-5 py-3.5">Kendaraan</th>
                <th className="px-5 py-3.5">Mulai / Selesai</th>
                <th className="px-5 py-3.5">Total Harga</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Aksi Operator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((trx) => (
                <tr key={trx.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-4 font-mono font-bold text-indigo-600">{trx.invoice_id}</td>
                  <td className="px-5 py-4">
                    <span className="font-bold text-slate-900 block">{trx.nama_penyewa}</span>
                    <span className="text-[10px] text-slate-400">{trx.no_hp_penyewa}</span>
                  </td>
                  <td className="px-5 py-4 font-semibold text-slate-800">{trx.produk_nama}</td>
                  <td className="px-5 py-4 text-[11px]">
                    <div>{trx.tanggal_mulai_sewa} ({trx.jam_mulai_sewa})</div>
                    <div className="text-slate-400">s/d {trx.tanggal_selesai_sewa}</div>
                  </td>
                  <td className="px-5 py-4 font-bold text-slate-900">
                    Rp {trx.total_harga.toLocaleString('id-ID')}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                      trx.status === 'berlangsung' ? 'bg-purple-100 text-purple-700' :
                      trx.status === 'selesai' ? 'bg-emerald-100 text-emerald-800' :
                      trx.status === 'qr_scanned' ? 'bg-blue-100 text-blue-800' :
                      trx.status === 'dibayar' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {trx.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right space-x-2">
                    {/* Unit Berangkat Button (Conditional: only if qr_scanned or dibayar) */}
                    {(trx.status === 'qr_scanned' || trx.status === 'dibayar') && (
                      <button
                        onClick={() => updateTransactionStatus(trx.id, 'berlangsung', 'usr-karyawan-1')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-xl font-bold transition-all shadow-sm"
                      >
                        Unit Berangkat
                      </button>
                    )}

                    {/* Unit Kembali Button (Conditional: only if berlangsung) */}
                    {trx.status === 'berlangsung' && (
                      <button
                        onClick={() => updateTransactionStatus(trx.id, 'selesai', 'usr-karyawan-1')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl font-bold transition-all shadow-sm"
                      >
                        Unit Kembali
                      </button>
                    )}

                    {trx.status !== 'selesai' && trx.status !== 'dibatalkan' && (
                      <button
                        onClick={() => updateTransactionStatus(trx.id, 'dibatalkan', 'usr-karyawan-1')}
                        className="bg-rose-50 text-rose-600 hover:bg-rose-100 px-2.5 py-1.5 rounded-xl font-semibold border border-rose-200"
                      >
                        Batalkan
                      </button>
                    )}
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
