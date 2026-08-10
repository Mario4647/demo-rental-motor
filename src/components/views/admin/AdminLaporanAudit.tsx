'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { AuditLog } from '@/lib/types';
import { Search, Calendar, FileCode, Download, BarChart2, Activity, Lock, AlertTriangle } from 'lucide-react';

export const AdminLaporanAudit: React.FC = () => {
  const { auditLogs, transactions, products } = useAppStore();
  const [search, setSearch] = useState('');
  const [selectedLogJson, setSelectedLogJson] = useState<AuditLog | null>(null);

  const totalOmzet = transactions.reduce((acc, t) => acc + (t.status !== 'dibatalkan' && t.status !== 'refund' ? t.total_harga : 0), 0);
  const totalBerhasil = transactions.filter(t => t.status === 'selesai' || t.status === 'berlangsung' || t.status === 'dibayar').length;

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Waktu,User,Role,Aksi,Entitas,Deskripsi,IP"].join(",") + "\n"
      + auditLogs.map(l => `"${l.created_at}","${l.user_nama}","${l.user_role}","${l.aksi}","${l.entitas}","${l.deskripsi.replace(/"/g, '""')}","${l.ip_address}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `RentMoto-LaporanAudit-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Laporan & Audit Log</h1>
          <p className="text-xs text-slate-400">Dashboard / Laporan & Audit Log</p>
        </div>

        <button
          onClick={handleExportCSV}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Ekspor Laporan & Audit (CSV)</span>
        </button>
      </div>

      {/* Summary Report Cards (Laporan Header) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-medium text-slate-400">Total Omzet Rental (Agustus 2026)</span>
          <div className="text-xl font-black text-purple-600">Rp {totalOmzet.toLocaleString('id-ID')}</div>
          <span className="text-[10px] text-emerald-600 font-semibold">Verified Midtrans & Cash</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-medium text-slate-400">Total Transaksi Sukses</span>
          <div className="text-xl font-bold text-slate-900">{totalBerhasil} Transaksi</div>
          <span className="text-[10px] text-slate-400">Tingkat keberhasilan 98%</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-medium text-slate-400">Utilisasi Armada Physical Units</span>
          <div className="text-xl font-bold text-slate-900">82.4%</div>
          <span className="text-[10px] text-purple-600 font-semibold">Tinggi (32 unit aktif)</span>
        </div>
      </div>

      {/* H-45 Retention Notice */}
      <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-2xl flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
        <div>
          <span className="font-bold block">Peringatan Retensi Audit Log (H-45)</span>
          <span className="text-[11px] text-amber-800">142 baris audit log mendekati batas 6 bulan. Lakukan ekspor CSV sebelum pembersihan otomatis.</span>
        </div>
      </div>

      {/* 2-Column Layout (Table & Side JSON View matching Mockup 8) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Table (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Immutable Audit Log Table</h3>
            <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              SELECT + INSERT ONLY
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-600">
              <thead className="text-[11px] text-slate-400 font-semibold bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-4 py-2.5">Waktu</th>
                  <th className="px-4 py-2.5">User</th>
                  <th className="px-4 py-2.5">Aksi</th>
                  <th className="px-4 py-2.5">Entitas</th>
                  <th className="px-4 py-2.5">Deskripsi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {auditLogs.map((log) => (
                  <tr 
                    key={log.id} 
                    onClick={() => setSelectedLogJson(log)}
                    className="hover:bg-purple-50/50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-400">{new Date(log.created_at).toLocaleTimeString('id-ID')}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900">{log.user_nama}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700">
                        {log.aksi}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-700">{log.entitas}</td>
                    <td className="px-4 py-3 max-w-xs truncate">{log.deskripsi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* JSON Diff Panel (1 Col) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4 text-xs">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Detail Log Viewer</h3>
            <FileCode className="w-4 h-4 text-purple-600" />
          </div>

          {selectedLogJson ? (
            <div className="space-y-3">
              <div className="space-y-1.5 text-slate-600">
                <div className="flex justify-between"><span className="text-slate-400">Log ID:</span> <span className="font-mono text-slate-900">{selectedLogJson.id}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">User:</span> <span className="font-bold text-slate-900">{selectedLogJson.user_nama}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Aksi:</span> <span className="font-bold text-purple-600">{selectedLogJson.aksi}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">IP:</span> <span className="font-mono text-slate-700">{selectedLogJson.ip_address}</span></div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">JSON Metadata Payload</span>
                <pre className="bg-slate-900 text-emerald-400 p-3 rounded-xl font-mono text-[10px] overflow-x-auto max-h-48">
                  {JSON.stringify(selectedLogJson, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <p className="text-slate-400 text-center py-8">Klik salah satu baris audit log untuk melihat detail JSON metadata payload.</p>
          )}
        </div>

      </div>

    </div>
  );
};
