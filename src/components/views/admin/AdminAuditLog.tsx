'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Search, Calendar, FileCode, Lock, Download, ChevronLeft, ChevronRight } from 'lucide-react';

export const AdminAuditLog: React.FC = () => {
  const { auditLogs } = useAppStore();
  const [search, setSearch] = useState('');
  const [aksiFilter, setAksiFilter] = useState('Semua Aksi');
  const [entitasFilter, setEntitasFilter] = useState('Semua Entitas');

  // Selected Log for Right Side Panel (Mockup 8)
  const [selectedLog, setSelectedLog] = useState(auditLogs[0]);

  const mockAuditRows = [
    { waktu: '21 Jun 2024, 10:30', user: 'Admin', role: 'Admin', aksi: 'CREATE', badgeAksi: 'bg-emerald-100 text-emerald-700', entitas: 'Transaksi', id: 'INV-20240621-0001', deskripsi: 'Membuat transaksi baru INV-20240621-0001', ip: '192.168.1.100' },
    { waktu: '21 Jun 2024, 10:25', user: 'Admin', role: 'Admin', aksi: 'UPDATE', badgeAksi: 'bg-amber-100 text-amber-700', entitas: 'Transaksi', id: 'INV-20240620-0003', deskripsi: 'Update status transaksi INV-20240620-0003 ke Selesai', ip: '192.168.1.100' },
    { waktu: '21 Jun 2024, 10:00', user: 'Budi', role: 'User', aksi: 'LOGIN', badgeAksi: 'bg-purple-100 text-purple-700', entitas: 'Auth', id: 'usr-customer-1', deskripsi: 'Login berhasil dari Chrome macOS', ip: '182.253.120.44' },
    { waktu: '21 Jun 2024, 09:15', user: 'Admin', role: 'Admin', aksi: 'PAYMENT', badgeAksi: 'bg-emerald-100 text-emerald-700', entitas: 'Pembayaran', id: 'PAY-8842', deskripsi: 'Pembayaran dikonfirmasi via Midtrans Rp 450.000', ip: '192.168.1.100' },
    { waktu: '21 Jun 2024, 08:30', user: 'Admin', role: 'Admin', aksi: 'CREATE', badgeAksi: 'bg-emerald-100 text-emerald-700', entitas: 'Unit', id: 'unit-101', deskripsi: 'Menambahkan unit baru B 1234 ABC', ip: '192.168.1.100' },
    { waktu: '20 Jun 2024, 16:45', user: 'Karyawan', role: 'Karyawan', aksi: 'UPDATE', badgeAksi: 'bg-amber-100 text-amber-700', entitas: 'Unit', id: 'unit-102', deskripsi: 'Update status unit B 2345 DEF ke Disewa', ip: '192.168.1.101' },
    { waktu: '20 Jun 2024, 14:00', user: 'Admin', role: 'Admin', aksi: 'DELETE', badgeAksi: 'bg-rose-100 text-rose-700', entitas: 'Produk', id: 'prod-99', deskripsi: 'Menghapus produk Honda Beat 2020', ip: '192.168.1.100' },
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Audit Log</h1>
          <p className="text-xs text-slate-400">Dashboard / Audit Log</p>
        </div>
      </div>

      {/* Filter Header (Mockup 8) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[200px] flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari user, deskripsi, atau IP..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <select 
            value={aksiFilter} 
            onChange={(e) => setAksiFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium"
          >
            <option value="Semua Aksi">Semua Aksi</option>
            <option value="CREATE">CREATE</option>
            <option value="UPDATE">UPDATE</option>
            <option value="DELETE">DELETE</option>
            <option value="LOGIN">LOGIN</option>
          </select>

          <select 
            value={entitasFilter} 
            onChange={(e) => setEntitasFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium"
          >
            <option value="Semua Entitas">Semua Entitas</option>
            <option value="Transaksi">Transaksi</option>
            <option value="Unit">Unit</option>
            <option value="Produk">Produk</option>
          </select>

          <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs text-slate-600 font-medium flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-purple-600" />
            <span>21 Mei 2024 - 21 Jun 2024</span>
          </div>
        </div>
      </div>

      {/* 2-COLUMN GRID (Mockup 8 Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Audit Log Table (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-600">
              <thead className="text-[11px] text-slate-400 font-semibold bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3">Waktu</th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Aksi</th>
                  <th className="px-4 py-3">Entitas</th>
                  <th className="px-4 py-3">Deskripsi</th>
                  <th className="px-4 py-3">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {mockAuditRows.map((row, idx) => (
                  <tr 
                    key={idx} 
                    onClick={() => setSelectedLog({ ...auditLogs[0], deskripsi: row.deskripsi, aksi: row.aksi as any })}
                    className="hover:bg-purple-50/50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">{row.waktu}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900">{row.user}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${row.badgeAksi}`}>
                        {row.aksi}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-700">{row.entitas}</td>
                    <td className="px-4 py-3 text-slate-700 max-w-xs truncate">{row.deskripsi}</td>
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-400 whitespace-nowrap">{row.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Menampilkan 1 - 7 dari 125 data</span>
            <div className="flex items-center gap-1">
              <button className="w-6 h-6 rounded border border-slate-200 flex items-center justify-center text-slate-400"><ChevronLeft className="w-3.5 h-3.5" /></button>
              <button className="w-6 h-6 rounded bg-purple-600 text-white font-bold flex items-center justify-center">1</button>
              <button className="w-6 h-6 rounded border border-slate-200 flex items-center justify-center text-slate-600">2</button>
              <button className="w-6 h-6 rounded border border-slate-200 flex items-center justify-center text-slate-400"><ChevronRight className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        </div>

        {/* Right: Detail Log Side Panel (Mockup 8) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4 text-xs">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Detail Log</h3>
            <span className="text-[10px] font-mono bg-slate-100 text-slate-500 px-2 py-0.5 rounded">JSON Diff</span>
          </div>

          <div className="space-y-2 text-slate-600">
            <div className="flex justify-between"><span className="text-slate-400">Waktu:</span> <span className="font-semibold text-slate-800">21 Jun 2024, 10:30 WIB</span></div>
            <div className="flex justify-between"><span className="text-slate-400">User:</span> <span className="font-bold text-slate-900">Admin (admin@rentmoto.com)</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Aksi:</span> <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">CREATE</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Entitas:</span> <span className="font-mono text-slate-800">Transaksi</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Entitas ID:</span> <span className="font-mono text-purple-600 font-bold">INV-20240621-0001</span></div>
            <div className="flex justify-between"><span className="text-slate-400">IP Address:</span> <span className="font-mono text-slate-600">192.168.1.100</span></div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Before</span>
            <div className="bg-slate-50 p-2.5 rounded-xl font-mono text-[11px] text-slate-400">
              null
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">After</span>
            <pre className="bg-slate-900 text-emerald-400 p-3 rounded-xl font-mono text-[10px] overflow-x-auto">
{`{
  "invoice": "INV-20240621-0001",
  "total": 450000,
  "status": "pending"
}`}
            </pre>
          </div>
        </div>

      </div>

    </div>
  );
};
