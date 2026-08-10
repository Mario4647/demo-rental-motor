'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Produk } from '@/lib/types';
import { 
  Package, Plus, Search, Filter, Edit, Trash2, Check, X, Bike, 
  ChevronLeft, ChevronRight, Upload, Image as ImageIcon, Bold, Italic, List
} from 'lucide-react';

export const AdminProdukCRUD: React.FC = () => {
  const { products, addProduct, updateProduct } = useAppStore();

  const [activeSubView, setActiveSubView] = useState<'grid' | 'tambah' | 'detail'>('grid');
  const [selectedProduct, setSelectedProduct] = useState<Produk | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua Status');

  // Form State for Tambah Produk (Mockup 6)
  const [namaProduk, setNamaProduk] = useState('');
  const [hargaPerHari, setHargaPerHari] = useState(150000);
  const [deskripsiProduk, setDeskripsiProduk] = useState('');
  const [statusProduk, setStatusProduk] = useState('AKTIF');

  const filteredProducts = products.filter(p => 
    p.nama.toLowerCase().includes(search.toLowerCase())
  );

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaProduk) return;

    addProduct({
      nama: namaProduk,
      slug: namaProduk.toLowerCase().replace(/ /g, '-'),
      kategori: 'Matic Premium',
      deskripsi: deskripsiProduk || 'Motor matic handal dengan performa responsif untuk harian.',
      harga_per_hari: Number(hargaPerHari),
      gambar_url: ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80'],
      jumlah_unit_tersedia: 8,
      total_unit: 8,
      is_active: statusProduk === 'AKTIF',
      fitur: ['Keyless System', 'CBS', 'Digital Speedo'],
      cc: 125,
    });

    setActiveSubView('grid');
    setNamaProduk('');
    setDeskripsiProduk('');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* 1. MOCKUP 6: TAMBAH PRODUK FORM */}
      {activeSubView === 'tambah' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Tambah Produk</h1>
              <p className="text-xs text-slate-400">Dashboard / Produk / Tambah</p>
            </div>
            <button 
              onClick={() => setActiveSubView('grid')}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 px-3 py-1.5 rounded-xl"
            >
              Kembali ke Katalog
            </button>
          </div>

          <form onSubmit={handleSaveProduct} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Column: Informasi Produk */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Informasi Produk</h3>
                
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nama Produk *</label>
                  <input 
                    type="text" 
                    placeholder="Masukkan nama produk..." 
                    value={namaProduk} 
                    onChange={(e) => setNamaProduk(e.target.value)} 
                    required 
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Harga per Hari *</label>
                  <input 
                    type="number" 
                    placeholder="Masukkan harga per hari..." 
                    value={hargaPerHari} 
                    onChange={(e) => setHargaPerHari(Number(e.target.value))} 
                    required 
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-slate-700 block">Deskripsi *</label>
                    <div className="flex items-center gap-1 text-slate-400">
                      <button type="button" className="p-1 hover:text-slate-700"><Bold className="w-3.5 h-3.5" /></button>
                      <button type="button" className="p-1 hover:text-slate-700"><Italic className="w-3.5 h-3.5" /></button>
                      <button type="button" className="p-1 hover:text-slate-700"><List className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                  <textarea 
                    placeholder="Masukkan deskripsi produk..." 
                    value={deskripsiProduk} 
                    onChange={(e) => setDeskripsiProduk(e.target.value)} 
                    rows={4} 
                    required 
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Status</label>
                  <select 
                    value={statusProduk} 
                    onChange={(e) => setStatusProduk(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value="AKTIF">AKTIF</option>
                    <option value="NON-AKTIF">NON-AKTIF</option>
                  </select>
                </div>
              </div>

              {/* Right Column: Gambar Produk (Drag & Drop Mockup 6) */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Gambar Produk</h3>

                <div className="border-2 border-dashed border-slate-200 hover:border-purple-500 rounded-2xl p-10 text-center flex flex-col items-center justify-center space-y-2 cursor-pointer transition-colors bg-slate-50/50 min-h-[260px]">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-slate-800 text-xs">Drag & drop gambar di sini atau <span className="text-purple-600 underline">klik untuk upload</span></span>
                  <span className="text-[10px] text-slate-400">Format: JPG, PNG, WEBP. Maks 2MB</span>
                  <span className="text-[10px] text-slate-400">Maksimal 5 gambar</span>
                </div>
              </div>

            </div>

            {/* Bottom Form Actions (Mockup 6) */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button 
                type="button" 
                onClick={() => setActiveSubView('grid')}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Batal
              </button>
              <button 
                type="submit" 
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs"
              >
                Simpan Produk
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 2. MOCKUP 5: DETAIL PRODUK VIEW */}
      {activeSubView === 'detail' && selectedProduct && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Detail Produk</h1>
              <p className="text-xs text-slate-400">Dashboard / Produk / Detail</p>
            </div>
            <button 
              onClick={() => setActiveSubView('grid')}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 px-3 py-1.5 rounded-xl"
            >
              Kembali ke Produk
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Product Image Carousel */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative flex items-center justify-center">
              <img src={selectedProduct.gambar_url[0]} alt={selectedProduct.nama} className="w-full h-72 object-cover rounded-xl" />
              <button className="absolute left-4 w-8 h-8 rounded-full bg-white/80 border border-slate-200 flex items-center justify-center shadow-xs">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="absolute right-4 w-8 h-8 rounded-full bg-white/80 border border-slate-200 flex items-center justify-center shadow-xs">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Right: Product Specs */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Informasi Produk</h3>

              <div className="space-y-2 text-slate-600">
                <div className="flex justify-between"><span className="text-slate-400">Nama:</span> <span className="font-bold text-slate-900">{selectedProduct.nama}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Harga per Hari:</span> <span className="font-bold text-purple-600">Rp {selectedProduct.harga_per_hari.toLocaleString('id-ID')} / hari</span></div>
                <div><span className="text-slate-400 block mb-1">Deskripsi:</span> <p className="text-slate-700 bg-slate-50 p-2.5 rounded-xl leading-relaxed">{selectedProduct.deskripsi}</p></div>
                <div className="flex justify-between items-center"><span className="text-slate-400">Status:</span> <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">Aktif</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Jumlah Unit Tersedia:</span> <span className="font-semibold text-slate-900">{selectedProduct.jumlah_unit_tersedia} unit</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Tanggal Dibuat:</span> <span className="text-slate-800">20 Mei 2024, 10:00 WIB</span></div>
              </div>

              <div className="pt-2 flex gap-2">
                <button className="flex-1 border border-purple-600 text-purple-600 hover:bg-purple-50 font-bold py-2 rounded-xl text-xs">Edit Produk</button>
                <button className="flex-1 border border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold py-2 rounded-xl text-xs">Nonaktifkan</button>
              </div>
            </div>
          </div>

          {/* Bottom: Daftar Unit Table (Mockup 5) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Daftar Unit</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-600">
                <thead className="text-[11px] text-slate-400 font-semibold bg-slate-50 border-y border-slate-100">
                  <tr>
                    <th className="px-4 py-2.5">No Plat</th>
                    <th className="px-4 py-2.5">Status</th>
                    <th className="px-4 py-2.5">Terakhir Disewa</th>
                    <th className="px-4 py-2.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono font-bold text-slate-900">B 1234 ABC</td>
                    <td className="px-4 py-3"><span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">Tersedia</span></td>
                    <td className="px-4 py-3 text-slate-400">-</td>
                    <td className="px-4 py-3 text-right text-slate-400">-</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono font-bold text-slate-900">B 2345 DEF</td>
                    <td className="px-4 py-3"><span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">Disewa</span></td>
                    <td className="px-4 py-3 text-slate-600">21 Jun 2024</td>
                    <td className="px-4 py-3 text-right text-slate-400">-</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono font-bold text-slate-900">B 4567 JKL</td>
                    <td className="px-4 py-3"><span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">Maintenance</span></td>
                    <td className="px-4 py-3 text-slate-600">10 Jun 2024</td>
                    <td className="px-4 py-3 text-right text-slate-400">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. MOCKUP 4: PRODUK CATALOG GRID */}
      {activeSubView === 'grid' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Produk</h1>
              <p className="text-xs text-slate-400">Dashboard / Produk</p>
            </div>
          </div>

          {/* Filter & Action Header (Mockup 4) */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative min-w-[240px] flex-1">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari produk..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium"
              >
                <option value="Semua Status">Semua Status</option>
                <option value="Aktif">Aktif</option>
                <option value="Non-Aktif">Non-Aktif</option>
              </select>
            </div>

            <button
              onClick={() => setActiveSubView('tambah')}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah Produk</span>
            </button>
          </div>

          {/* Product Grid (4 Columns matching Mockup 4) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredProducts.map((prod) => (
              <div key={prod.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="h-40 bg-slate-100 relative">
                    <img src={prod.gambar_url[0]} alt={prod.nama} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="font-bold text-slate-900 text-sm">{prod.nama}</h3>
                    <div className="text-xs font-bold text-purple-600">
                      Rp {prod.harga_per_hari.toLocaleString('id-ID')} <span className="text-slate-400 text-[10px] font-normal">/ hari</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">
                    Stok: {prod.jumlah_unit_tersedia} unit
                  </span>

                  <button
                    onClick={() => {
                      setSelectedProduct(prod);
                      setActiveSubView('detail');
                    }}
                    className="px-3 py-1 rounded-lg text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    Detail
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
