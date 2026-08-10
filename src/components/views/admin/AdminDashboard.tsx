'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { 
  DollarSign, ShoppingCart, Bike, CheckCircle2, Users, Package, 
  Calendar, Activity, ArrowUpRight, ChevronRight, Filter
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const AdminDashboard: React.FC = () => {
  const { transactions, products, users, auditLogs, setActiveView } = useAppStore();

  const revenueData = [
    { month: 'Jan', revenue: 65000000 },
    { month: 'Feb', revenue: 78000000 },
    { month: 'Mar', revenue: 92000000 },
    { month: 'Apr', revenue: 85000000 },
    { month: 'Mei', revenue: 110000000 },
    { month: 'Jun', revenue: 128750000 },
  ];

  const pieData = [
    { name: 'Berlangsung', value: 18, color: '#7c3aed' },
    { name: 'Selesai', value: 32, color: '#10b981' },
    { name: 'Dibatalkan', value: 4, color: '#ef4444' },
    { name: 'Menunggu', value: 12, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Top Bar matching Mockup 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-xs text-slate-400">Dashboard</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs text-slate-600 font-medium flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-600" />
            <span>21 Mei - 21 Jun 2024</span>
          </div>
        </div>
      </div>

      {/* 6 STAT CARDS (Matching Mockup 1 Grid Exactly) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        
        {/* Card 1: Total Pendapatan */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium text-slate-500">Total Pendapatan</span>
            <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-base font-bold text-slate-900">Rp 128.750.000</div>
          <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
            <span>+12.5% dari bulan lalu</span>
          </div>
        </div>

        {/* Card 2: Transaksi Hari Ini */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium text-slate-500">Transaksi Hari ini</span>
            <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-base font-bold text-slate-900">24</div>
          <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
            <span>+4 dari hari kemarin</span>
          </div>
        </div>

        {/* Card 3: Unit Disewa */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium text-slate-500">Unit Disewa</span>
            <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
              <Bike className="w-4 h-4" />
            </div>
          </div>
          <div className="text-base font-bold text-slate-900">32</div>
          <div className="text-[10px] text-purple-600 font-semibold flex items-center gap-0.5">
            <span>+2 unit dari kemarin</span>
          </div>
        </div>

        {/* Card 4: Unit Tersedia */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium text-slate-500">Unit Tersedia</span>
            <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-base font-bold text-slate-900">18</div>
          <div className="text-[10px] text-slate-500 font-medium">12 unit siap disewa</div>
        </div>

        {/* Card 5: User Terdaftar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium text-slate-500">User Terdaftar</span>
            <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-base font-bold text-slate-900">142</div>
          <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
            <span>+8 dari bulan lalu</span>
          </div>
        </div>

        {/* Card 6: Produk */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium text-slate-500">Produk</span>
            <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-base font-bold text-slate-900">24</div>
          <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
            <span>+2 produk bulan ini</span>
          </div>
        </div>

      </div>

      {/* CHARTS SECTION (Mockup 1 Middle Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Line Chart (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Grafik Pendapatan (12 Bulan Terakhir)</h3>
              <p className="text-xs text-slate-400">Ringkasan total pendapatan bulanan</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
              <span>Pendapatan</span>
            </div>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <XAxis dataKey="month" stroke="#cbd5e1" fontSize={11} />
                <YAxis stroke="#cbd5e1" fontSize={11} tickFormatter={(val) => `${val/1000000}M`} />
                <Tooltip 
                  formatter={(val: any) => [`Rp ${Number(val || 0).toLocaleString('id-ID')}`, 'Pendapatan']} 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', color: '#0f172a', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#7c3aed" strokeWidth={2.5} dot={{ r: 4, fill: '#7c3aed' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Status Rental Donut (1 Col) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Status Rental</h3>
          </div>

          <div className="h-44 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={48}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', color: '#0f172a', fontSize: '11px', borderColor: '#e2e8f0' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs pt-1">
            {pieData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.name}</span>
                </div>
                <span className="font-bold text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* RECENT TRANSACTIONS & RECENT ACTIVITY (Mockup 1 Bottom Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Transaksi Terbaru Table (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Transaksi Terbaru</h3>
            <button 
              onClick={() => setActiveView('admin-data-rental')}
              className="text-xs text-purple-600 font-bold hover:underline"
            >
              Lihat Semua
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-600">
              <thead className="text-[11px] text-slate-400 font-semibold bg-slate-50 border-y border-slate-100">
                <tr>
                  <th className="px-4 py-2.5">Invoice</th>
                  <th className="px-4 py-2.5">Penyewa</th>
                  <th className="px-4 py-2.5">Unit</th>
                  <th className="px-4 py-2.5">Mulai</th>
                  <th className="px-4 py-2.5">Durasi</th>
                  <th className="px-4 py-2.5">Total</th>
                  <th className="px-4 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-bold text-purple-600">INV-20240621-0001</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">Budi Santoso</td>
                  <td className="px-4 py-3">Vario 125</td>
                  <td className="px-4 py-3">21 Jun 2024</td>
                  <td className="px-4 py-3">3 Hari</td>
                  <td className="px-4 py-3 font-bold text-slate-900">Rp 450.000</td>
                  <td className="px-4 py-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700">
                      Berlangsung
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-bold text-purple-600">INV-20240621-0002</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">Andi Wijaya</td>
                  <td className="px-4 py-3">Beat 2023</td>
                  <td className="px-4 py-3">21 Jun 2024</td>
                  <td className="px-4 py-3">2 Hari</td>
                  <td className="px-4 py-3 font-bold text-slate-900">Rp 300.000</td>
                  <td className="px-4 py-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">
                      Menunggu
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-bold text-purple-600">INV-20240620-0003</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">Siti Rahma</td>
                  <td className="px-4 py-3">NMAX 155</td>
                  <td className="px-4 py-3">20 Jun 2024</td>
                  <td className="px-4 py-3">5 Hari</td>
                  <td className="px-4 py-3 font-bold text-slate-900">Rp 900.000</td>
                  <td className="px-4 py-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                      Selesai
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-bold text-purple-600">INV-20240620-0004</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">Rudi Hermawan</td>
                  <td className="px-4 py-3">PCX 160</td>
                  <td className="px-4 py-3">20 Jun 2024</td>
                  <td className="px-4 py-3">3 Hari</td>
                  <td className="px-4 py-3 font-bold text-slate-900">Rp 550.000</td>
                  <td className="px-4 py-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700">
                      Berlangsung
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Aktivitas Terbaru (1 Col) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Aktivitas Terbaru</h3>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <div>
                <h5 className="font-bold text-slate-900">Pembayaran Diterima</h5>
                <p className="text-slate-500 text-[11px]">Pembayaran via Midtrans Rp 450.000 untuk INV-20240621-0001</p>
                <span className="text-[10px] text-slate-400">2 menit lalu</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 shrink-0" />
              <div>
                <h5 className="font-bold text-slate-900">Unit Dikembalikan</h5>
                <p className="text-slate-500 text-[11px]">Unit NMAX 155 (B 1234 ABC) dikembalikan oleh Siti Rahma</p>
                <span className="text-[10px] text-slate-400">15 menit lalu</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <div>
                <h5 className="font-bold text-slate-900">Rental Baru Dibuat</h5>
                <p className="text-slate-500 text-[11px]">Rental baru INV-20240621-0002 dibuat oleh Andi Wijaya</p>
                <span className="text-[10px] text-slate-400">1 jam lalu</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
              <div>
                <h5 className="font-bold text-slate-900">User Baru Mendaftar</h5>
                <p className="text-slate-500 text-[11px]">Rian Hidayat mendaftar akun pelanggan baru</p>
                <span className="text-[10px] text-slate-400">2 jam lalu</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
