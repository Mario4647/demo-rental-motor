'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Search, Plus, Bike, MoreVertical, X, Check } from 'lucide-react';
import { UnitStatus } from '@/lib/types';

export const AdminUnitView: React.FC = () => {
  const { units, products, addUnit, updateUnitStatus } = useAppStore();
  const [search, setSearch] = useState('');
  const [produkFilter, setProdukFilter] = useState('Semua Produk');
  const [statusFilter, setStatusFilter] = useState('Semua Status');

  // Modal State for Tambah Unit
  const [isAddUnitOpen, setIsAddUnitOpen] = useState(false);
  const [nomorPlat, setNomorPlat] = useState('');
  const [selectedProdukId, setSelectedProdukId] = useState(products[0]?.id || 'prod-1');
  const [unitStatus, setUnitStatus] = useState<UnitStatus>('tersedia');
  const [tahun, setTahun] = useState(2024);
  const [km, setKm] = useState(1500);

  const handleSaveUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomorPlat) return;

    addUnit({
      produk_id: selectedProdukId,
      nomor_plat: nomorPlat.toUpperCase(),
      status: unitStatus,
      tahun: Number(tahun),
      km: Number(km),
    });

    setIsAddUnitOpen(false);
    setNomorPlat('');
  };

  const getProductName = (produkId: string) => {
    const prod = products.find(p => p.id === produkId);
    return prod ? prod.nama : 'Honda Vario 125';
  };

  const filteredUnits = units.filter((u) => {
    const matchesSearch = u.nomor_plat.toLowerCase().includes(search.toLowerCase());
    const prodName = getProductName(u.produk_id);
    const matchesProduk = produkFilter === 'Semua Produk' || prodName.toLowerCase().includes(produkFilter.toLowerCase());
    const matchesStatus = statusFilter === 'Semua Status' || u.status === statusFilter.toLowerCase();
    return matchesSearch && matchesProduk && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Unit</h1>
          <p className="text-xs text-slate-400">Dashboard / Unit</p>
        </div>

        <button
          onClick={() => setIsAddUnitOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Unit</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[200px] flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari no. plat..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <select 
            value={produkFilter} 
            onChange={(e) => setProdukFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium"
          >
            <option value="Semua Produk">Semua Produk</option>
            {products.map(p => <option key={p.id} value={p.nama}>{p.nama}</option>)}
          </select>

          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium"
          >
            <option value="Semua Status">Semua Status</option>
            <option value="Tersedia">Tersedia</option>
            <option value="Disewa">Disewa</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-600">
            <thead className="text-[11px] text-slate-400 font-semibold bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-5 py-3">No. Plat</th>
                <th className="px-5 py-3">Produk</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Tahun / KM</th>
                <th className="px-5 py-3 text-right">Aksi Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredUnits.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3.5 font-mono font-bold text-slate-900">{u.nomor_plat}</td>
                  <td className="px-5 py-3.5 text-slate-700">{getProductName(u.produk_id)}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      u.status === 'tersedia' ? 'bg-emerald-100 text-emerald-700' :
                      u.status === 'disewa' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {u.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">{u.tahun} / {u.km} km</td>
                  <td className="px-5 py-3.5 text-right space-x-1">
                    <button 
                      onClick={() => updateUnitStatus(u.id, u.status === 'tersedia' ? 'maintenance' : 'tersedia')}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                    >
                      {u.status === 'maintenance' ? 'Set Tersedia' : 'Set Maintenance'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FORM TAMBAH UNIT MODAL */}
      {isAddUnitOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Bike className="w-5 h-5 text-purple-600" />
                <span>Tambah Unit Fisik Motor</span>
              </h3>
              <button onClick={() => setIsAddUnitOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <form onSubmit={handleSaveUnit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Pilih Model Produk *</label>
                <select
                  value={selectedProdukId}
                  onChange={(e) => setSelectedProdukId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  {products.map(p => <option key={p.id} value={p.id}>{p.nama}</option>)}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nomor Plat Polisi *</label>
                <input
                  type="text"
                  placeholder="Misal: B 1234 ABC"
                  value={nomorPlat}
                  onChange={(e) => setNomorPlat(e.target.value)}
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tahun Perakitan</label>
                  <input
                    type="number"
                    value={tahun}
                    onChange={(e) => setTahun(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Kilometer (KM)</label>
                  <input
                    type="number"
                    value={km}
                    onChange={(e) => setKm(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Status Awal</label>
                <select
                  value={unitStatus}
                  onChange={(e) => setUnitStatus(e.target.value as UnitStatus)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                >
                  <option value="tersedia">TERSEDIA</option>
                  <option value="maintenance">MAINTENANCE</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setIsAddUnitOpen(false)} 
                  className="px-4 py-2 rounded-xl text-slate-600 border border-slate-200 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-xs"
                >
                  Simpan Unit Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
