'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { 
  DollarSign, ShoppingBag, Bike, Users, Calendar, ArrowUpRight, 
  TrendingUp, Activity, CheckCircle2, Clock, XCircle
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const { transactions, products, units, users } = useAppStore();

  // Compute Dynamic Data
  const totalPendapatan = transactions.reduce((acc, trx) => acc + (trx.total_harga || 0), 0);
  const trxHariIni = transactions.filter(t => new Date(t.created_at || '').toDateString() === new Date().toDateString()).length;
  
  const unitDisewa = units.filter(u => u.status === 'disewa').length;
  const totalUnit = units.length;
  
  const totalPelanggan = users.filter(u => u.role === 'user').length;
  
  const trxMenunggu = transactions.filter(t => t.status.toLowerCase().includes('menunggu')).length;
  
  const trxBerlangsung = transactions.filter(t => t.status === 'berlangsung').length;

  const revenueData = [
    { month: 'Bulan Ini', revenue: totalPendapatan }
  ];

  const statusDonutData = [
    { name: 'Berlangsung', value: trxBerlangsung, color: '#7C3AED' },
    { name: 'Menunggu', value: trxMenunggu, color: '#F59E0B' },
    { name: 'Selesai', value: transactions.filter(t => t.status === 'selesai').length, color: '#10B981' },
    { name: 'Dibatalkan', value: transactions.filter(t => t.status === 'dibatalkan').length, color: '#EF4444' },
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* 1. Header Top Bar matching Mockup 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-xs text-slate-500">Ringkasan performa bisnis rental motor Anda</p>
        </div>

        <div className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-xs text-slate-700 font-semibold flex items-center gap-2 self-start sm:self-auto">
          <Calendar className="w-4 h-4 text-purple-600" />
          <span>Real-time Data</span>
        </div>
      </div>

      {/* 2. STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        
        {/* Card 1: Total Pendapatan */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-2 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Total Pendapatan</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-lg font-black text-slate-900 tracking-tight">Rp {totalPendapatan.toLocaleString('id-ID')}</div>
            <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 mt-0.5">
              <span>Berdasarkan seluruh riwayat</span>
            </div>
          </div>
        </div>

        {/* Card 2: Transaksi Hari Ini */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-2 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Transaksi Hari Ini</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-lg font-black text-slate-900 tracking-tight">{trxHariIni}</div>
            <div className="text-[10px] font-semibold text-slate-500 mt-0.5">Transaksi masuk hari ini</div>
          </div>
        </div>

        {/* Card 3: Unit Disewa */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-2 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Unit Disewa</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Bike className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-lg font-black text-slate-900 tracking-tight">{unitDisewa}</div>
            <div className="text-[10px] font-semibold text-slate-500 mt-0.5">Dari {totalUnit} unit armada</div>
          </div>
        </div>

        {/* Card 4: Total Pelanggan */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-2 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Total Pelanggan</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-lg font-black text-slate-900 tracking-tight">{totalPelanggan}</div>
            <div className="text-[10px] font-semibold text-slate-500 mt-0.5">Pengguna terdaftar</div>
          </div>
        </div>

        {/* Card 5: Menunggu Bayar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-2 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Menunggu Bayar</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-lg font-black text-slate-900 tracking-tight">{trxMenunggu}</div>
            <div className="text-[10px] font-semibold text-slate-500 mt-0.5">Perlu tindak lanjut</div>
          </div>
        </div>

        {/* Card 6: Batal/Refund */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-2 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Batal / Refund</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-lg font-black text-slate-900 tracking-tight">{statusDonutData[3].value}</div>
            <div className="text-[10px] font-semibold text-slate-500 mt-0.5">Bulan ini</div>
          </div>
        </div>

      </div>

      {/* 3. CHARTS ROW (2/3 Line Chart + 1/3 Donut Chart matching Mockup 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Line Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Grafik Pendapatan (6 Bulan Terakhir)</h3>
              <p className="text-xs text-slate-500">Pertumbuhan omzet bulanan dalam Rupiah</p>
            </div>
            <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-lg">
              Total Rp {totalPendapatan.toLocaleString('id-ID')}
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={10} tickFormatter={(v) => `${v/1000000}M`} />
                <Tooltip formatter={(val: any) => [`Rp ${Number(val).toLocaleString('id-ID')}`, 'Pendapatan']} />
                <Line type="monotone" dataKey="revenue" stroke="#7C3AED" strokeWidth={3} dot={{ r: 4, fill: '#7C3AED' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Rental Donut Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Status Rental</h3>
            <p className="text-xs text-slate-500">Persentase distribusi status reservasi</p>
          </div>

          <div className="h-44 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusDonutData} innerRadius={50} outerRadius={70} paddingAngle={4} dataKey="value">
                  {statusDonutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <span className="text-xl font-black text-slate-900">137</span>
              <span className="text-[10px] text-slate-500 block font-semibold">Total Unit</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2">
            {statusDonutData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 font-medium">{item.name}: <strong className="text-slate-900">{item.value}</strong></span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 4. RECENT TRANSACTIONS TABLE & FEED (Mockup 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Transactions Table (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Transaksi Terbaru</h3>
            <span className="text-xs text-purple-600 font-bold hover:underline cursor-pointer">Lihat Semua</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-600">
              <thead className="text-[11px] text-slate-400 font-semibold bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3">Invoice</th>
                  <th className="px-4 py-3">Penyewa</th>
                  <th className="px-4 py-3">Unit</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {transactions.slice(0, 5).map((trx) => (
                  <tr key={trx.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono font-bold text-purple-600">{trx.invoice_id}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900">{trx.nama_penyewa}</td>
                    <td className="px-4 py-3 text-slate-700">{trx.produk_nama}</td>
                    <td className="px-4 py-3 font-bold text-slate-900">Rp {trx.total_harga.toLocaleString('id-ID')}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        trx.status === 'berlangsung' ? 'bg-purple-100 text-purple-700' :
                        trx.status === 'dibayar' || trx.status === 'selesai' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {trx.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Aktivitas Terbaru Feed (1 col) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Aktivitas Terbaru</h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-purple-600 mt-1.5 shrink-0" />
              <div>
                <p className="text-slate-800 font-semibold">Budi Santoso membuat reservasi INV-20240621-0001</p>
                <span className="text-[10px] text-slate-400">10 menit yang lalu</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <div>
                <p className="text-slate-800 font-semibold">Pembayaran Midtrans dikonfirmasi Rp 450.000</p>
                <span className="text-[10px] text-slate-400">25 menit yang lalu</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <div>
                <p className="text-slate-800 font-semibold">Operator memverifikasi KTP fisik unit B 1234 ABC</p>
                <span className="text-[10px] text-slate-400">1 jam yang lalu</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
