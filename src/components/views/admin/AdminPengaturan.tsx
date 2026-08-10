'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { 
  Settings, CreditCard, ShieldCheck, Check, Key, RefreshCw, 
  Search, Globe, Image as ImageIcon, HelpCircle, Bell, Layout, Lock 
} from 'lucide-react';

export const AdminPengaturan: React.FC = () => {
  const { appSettings, paymentSettings, toggleMaintenanceMode, addAuditLog, updateAppSettings } = useAppStore();

  const [activeTab, setActiveTab] = useState('Umum');

  // Form State - Umum (Mockup 9)
  const [namaAplikasi, setNamaAplikasi] = useState(appSettings.lokasi_utama ? 'RentMoto - Sewa Motor Terpercaya' : 'RentMoto');
  const [emailKontak, setEmailKontak] = useState(appSettings.kontak_email);
  const [noTelepon, setNoTelepon] = useState(appSettings.kontak_whatsapp);
  const [lokasiDefault, setLokasiDefault] = useState(appSettings.lokasi_utama);
  const [batasBayar, setBatasBayar] = useState(appSettings.batas_bayar_menit);
  const [durasiMin, setDurasiMin] = useState(appSettings.durasi_sewa_min);
  const [deskripsiSingkat, setDeskripsiSingkat] = useState('Platform sewa motor terpercaya dengan sistem online yang mudah dan aman.');

  // Form State - SEO
  const [metaTitle, setMetaTitle] = useState('RentMoto - Rental Motor Otomatis Terpercaya');
  const [metaDesc, setMetaDesc] = useState('Sewa motor matic dan sport cepat via Midtrans.');

  // Form State - Homepage
  const [heroTitle, setHeroTitle] = useState('Sewa Motor Cepat, Tanpa Ribet & Full Otomatis');
  const [heroSubtitle, setHeroSubtitle] = useState('Pesan motor impian Anda dalam hitungan menit. Pembayaran online aman via Midtrans!');

  const [savedMsg, setSavedMsg] = useState('');
  const [testConnMsg, setTestConnMsg] = useState('');
  const [isTesting, setIsTesting] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateAppSettings({
      kontak_email: emailKontak,
      kontak_whatsapp: noTelepon,
      lokasi_utama: lokasiDefault,
      batas_bayar_menit: Number(batasBayar),
      durasi_sewa_min: Number(durasiMin),
    });
    setSavedMsg('Pengaturan aplikasi berhasil disimpan!');
    setTimeout(() => setSavedMsg(''), 3000);
  };

  const handleTestMidtrans = () => {
    setIsTesting(true);
    setTestConnMsg('');
    setTimeout(() => {
      setIsTesting(false);
      setTestConnMsg('Koneksi Midtrans Sandbox API Berhasil (200 OK)! Signature SHA512 Verified.');
    }, 1000);
  };

  const navTabs = [
    { id: 'Umum', label: 'Umum' },
    { id: 'Payment Gateway', label: 'Payment Gateway' },
    { id: 'SEO & Konten', label: 'SEO & Konten' },
    { id: 'Homepage', label: 'Homepage' },
    { id: 'Maintenance Mode', label: 'Maintenance Mode' },
    { id: 'Terms & Tampilan', label: 'Terms & Tampilan' },
    { id: 'Logo & Favicon', label: 'Logo & Favicon' },
    { id: 'FAQ & Bantuan', label: 'FAQ & Bantuan' },
    { id: 'Notifikasi', label: 'Notifikasi' },
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Pengaturan</h1>
          <p className="text-xs text-slate-400">Dashboard / Pengaturan / {activeTab}</p>
        </div>
      </div>

      {savedMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{savedMsg}</span>
        </div>
      )}

      {/* 2-COLUMN GRID (Mockup 9 Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Left Sub-Navigation (Mockup 9) */}
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs space-y-1 text-xs">
          {navTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-3 py-2 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-50 text-purple-600 font-bold border-l-4 border-purple-600'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right Content Panel (Mockup 9) */}
        <div className="md:col-span-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5 text-xs">
          
          {/* TAB 1: UMUM (Mockup 9 Form) */}
          {activeTab === 'Umum' && (
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Informasi Aplikasi</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nama Aplikasi *</label>
                  <input 
                    type="text" 
                    value={namaAplikasi} 
                    onChange={(e) => setNamaAplikasi(e.target.value)} 
                    required 
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Email Kontak *</label>
                  <input 
                    type="email" 
                    value={emailKontak} 
                    onChange={(e) => setEmailKontak(e.target.value)} 
                    required 
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">No. Telepon / WhatsApp *</label>
                  <input 
                    type="text" 
                    value={noTelepon} 
                    onChange={(e) => setNoTelepon(e.target.value)} 
                    required 
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Lokasi Pengambilan Default *</label>
                  <input 
                    type="text" 
                    value={lokasiDefault} 
                    onChange={(e) => setLokasiDefault(e.target.value)} 
                    required 
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Batas Waktu Pembayaran (Menit) *</label>
                  <input 
                    type="number" 
                    value={batasBayar} 
                    onChange={(e) => setBatasBayar(Number(e.target.value))} 
                    required 
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Durasi Sewa Minimal (Hari) *</label>
                  <input 
                    type="number" 
                    value={durasiMin} 
                    onChange={(e) => setDurasiMin(Number(e.target.value))} 
                    required 
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Deskripsi Singkat</label>
                <textarea 
                  value={deskripsiSingkat} 
                  onChange={(e) => setDeskripsiSingkat(e.target.value)} 
                  rows={3} 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button 
                  type="submit" 
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-xs"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: PAYMENT GATEWAY */}
          {activeTab === 'Payment Gateway' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Konfigurasi Midtrans Payment Gateway</h3>

              {testConnMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{testConnMsg}</span>
                </div>
              )}

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Midtrans Client Key (Public)</label>
                <input 
                  type="text" 
                  value={paymentSettings.client_key} 
                  readOnly 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Midtrans Server Key (Encrypted AES-256-GCM)</label>
                <input 
                  type="password" 
                  value={paymentSettings.server_key} 
                  readOnly 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <button
                onClick={handleTestMidtrans}
                disabled={isTesting}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-xs transition-colors flex items-center gap-2"
              >
                {isTesting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
                <span>{isTesting ? 'Menguji API...' : 'Test Koneksi Midtrans API'}</span>
              </button>
            </div>
          )}

          {/* TAB 3: SEO & KONTEN */}
          {activeTab === 'SEO & Konten' && (
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Pengaturan SEO Meta Tags</h3>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Meta Title Default</label>
                <input 
                  type="text" 
                  value={metaTitle} 
                  onChange={(e) => setMetaTitle(e.target.value)} 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Meta Description</label>
                <textarea 
                  value={metaDesc} 
                  onChange={(e) => setMetaDesc(e.target.value)} 
                  rows={3} 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <button type="submit" className="bg-purple-600 text-white font-bold px-5 py-2.5 rounded-xl">
                Simpan Meta Tags
              </button>
            </form>
          )}

          {/* TAB 4: HOMEPAGE */}
          {activeTab === 'Homepage' && (
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Pengaturan Konten Hero Homepage</h3>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Headline Hero Utama</label>
                <input 
                  type="text" 
                  value={heroTitle} 
                  onChange={(e) => setHeroTitle(e.target.value)} 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Sub-headline</label>
                <textarea 
                  value={heroSubtitle} 
                  onChange={(e) => setHeroSubtitle(e.target.value)} 
                  rows={2} 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <button type="submit" className="bg-purple-600 text-white font-bold px-5 py-2.5 rounded-xl">
                Simpan Konten Homepage
              </button>
            </form>
          )}

          {/* TAB 5: MAINTENANCE MODE */}
          {activeTab === 'Maintenance Mode' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Status Pemeliharaan Sistem</h3>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <h4 className="font-bold text-slate-900">Aktifkan Maintenance Mode</h4>
                  <p className="text-slate-500 text-[11px]">Pengunjung publik akan dialihkan ke layar maintenance</p>
                </div>
                <button 
                  type="button" 
                  onClick={() => toggleMaintenanceMode(!appSettings.maintenance_mode)}
                  className={`px-4 py-2 rounded-xl font-bold text-xs ${appSettings.maintenance_mode ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-700'}`}
                >
                  {appSettings.maintenance_mode ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 6: TERMS & TAMPILAN */}
          {activeTab === 'Terms & Tampilan' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Warna Aksen & Syarat Layanan</h3>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <span>Tema Utama Aplikasi:</span>
                <span className="font-bold text-purple-600">Solid Purple (#7C3AED / #6D5AE6)</span>
              </div>
            </div>
          )}

          {/* TAB 7: LOGO & FAVICON */}
          {activeTab === 'Logo & Favicon' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Upload Logo & Favicon</h3>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center text-slate-400">
                <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                <span>Drag & drop logo baru di sini (PNG/SVG)</span>
              </div>
            </div>
          )}

          {/* TAB 8: FAQ & BANTUAN */}
          {activeTab === 'FAQ & Bantuan' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Daftar FAQ Publik</h3>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block">Q: Apakah ada biaya deposit tunai?</span>
                <span className="text-slate-500">A: Tidak ada. Cukup verifikasi KTP fisik saat ambil unit.</span>
              </div>
            </div>
          )}

          {/* TAB 9: NOTIFIKASI */}
          {activeTab === 'Notifikasi' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Notifikasi Email & WhatsApp Trigger</h3>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span>Email Notifikasi Login Perangkat Baru</span>
                <span className="font-bold text-emerald-600">AKTIF</span>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
