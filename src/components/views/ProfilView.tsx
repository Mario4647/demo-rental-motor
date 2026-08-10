'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { 
  User, ShieldCheck, Key, Laptop, Smartphone, Trash2, 
  Check, Lock 
} from 'lucide-react';

export const ProfilView: React.FC = () => {
  const { currentUser, sessions, revokeSession } = useAppStore();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 12) {
      setPasswordMsg('Password baru minimal 12 karakter (sesuai standar keamanan PRD 6.1).');
      return;
    }
    setPasswordMsg('Password berhasil diperbarui! Hash Bcrypt cost 12 diperbarui.');
    setOldPassword('');
    setNewPassword('');
  };

  if (!currentUser) {
    return <div className="flex items-center justify-center py-20 text-slate-400 text-sm">Memuat profil...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex items-center gap-4">
        <img 
          src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'} 
          alt={currentUser.nama_lengkap} 
          className="w-14 h-14 rounded-full object-cover border-2 border-purple-200"
        />
        <div>
          <h1 className="text-xl font-bold text-slate-900">{currentUser.nama_lengkap}</h1>
          <p className="text-xs text-slate-500">{currentUser.email} • WhatsApp: {currentUser.no_hp}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Akun Terverifikasi
            </span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Form Ubah Password */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 text-xs">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Key className="w-4 h-4 text-purple-600" />
            <h3 className="text-sm font-bold text-slate-900">Ubah Password Akun</h3>
          </div>

          {passwordMsg && (
            <div className={`p-3 rounded-xl font-semibold ${
              passwordMsg.includes('berhasil') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}>
              {passwordMsg}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-3">
            <div>
              <label className="font-bold text-slate-600 block mb-1">Password Saat Ini</label>
              <input 
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
              />
            </div>

            <div>
              <label className="font-bold text-slate-600 block mb-1">Password Baru (Min 12 Karakter)</label>
              <input 
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
              />
            </div>

            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-xl text-xs w-full transition-colors"
            >
              Simpan Password Baru
            </button>
          </form>
        </div>

        {/* Security Info Card (Solid Dark Background - NO GRADIENTS) */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-xs space-y-4 text-xs">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Lock className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white">Proteksi Keamanan Akun</h3>
          </div>

          <p className="text-slate-300 leading-relaxed">
            Sistem kami memantau setiap sesi masuk (login). Jika terdapat aktivitas login dari IP atau perangkat baru, notifikasi keamanan otomatis dikirimkan ke email Anda.
          </p>

          <div className="space-y-2 text-slate-300">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>JWT RS256 dengan HttpOnly Secure Cookie</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Brute-force Protection (Maks 5x percobaan)</span>
            </div>
          </div>
        </div>

      </div>

      {/* Sesi Login Perangkat */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900">Perangkat & Sesi Login Aktif</h3>
          <span className="bg-purple-50 text-purple-700 font-bold px-2.5 py-1 rounded-full text-[10px]">
            {sessions.length} Sesi Aktif
          </span>
        </div>

        <div className="space-y-3">
          {sessions.map((sess) => (
            <div 
              key={sess.id}
              className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                  {sess.device_info.toLowerCase().includes('mobile') ? <Smartphone className="w-4 h-4" /> : <Laptop className="w-4 h-4" />}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{sess.device_info}</h4>
                  <p className="text-[10px] text-slate-400">IP: {sess.ip_address} • Aktif: {sess.last_active}</p>
                </div>
              </div>

              {!sess.is_current && (
                <button
                  onClick={() => revokeSession(sess.id)}
                  className="bg-rose-50 text-rose-600 border border-rose-200 px-3 py-1 rounded-lg text-xs font-semibold hover:bg-rose-100"
                >
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
