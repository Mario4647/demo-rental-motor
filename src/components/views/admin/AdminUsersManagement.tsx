'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { UserCheck, Users, Shield, Plus, X, Laptop, Smartphone } from 'lucide-react';
import { Role } from '@/lib/types';

interface AdminUsersManagementProps {
  targetRole?: 'user' | 'karyawan' | 'admin';
}

export const AdminUsersManagement: React.FC<AdminUsersManagementProps> = ({ targetRole = 'user' }) => {
  const { users, addKaryawan } = useAppStore();

  const [isAddEmpOpen, setIsAddEmpOpen] = useState(false);
  const [namaEmp, setNamaEmp] = useState('');
  const [emailEmp, setEmailEmp] = useState('');
  const [noHpEmp, setNoHpEmp] = useState('');
  const [nikEmp, setNikEmp] = useState('');

  const filteredUsers = users.filter((u) => u.role === targetRole);

  const handleCreateEmp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaEmp || !emailEmp) return;

    addKaryawan({
      email: emailEmp,
      nama_lengkap: namaEmp,
      nik: nikEmp || '3174081500000000',
      no_hp: noHpEmp || '081234567890',
      role: 'karyawan',
      is_active: true,
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
    });

    setIsAddEmpOpen(false);
    setNamaEmp('');
    setEmailEmp('');
    setNoHpEmp('');
  };

  const getPageTitle = () => {
    if (targetRole === 'karyawan') return 'Data Karyawan & Operator Lapangan';
    if (targetRole === 'admin') return 'Data Administrator & Pemilik';
    return 'Data Pelanggan (User)';
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900">{getPageTitle()}</h1>
          <p className="text-xs text-slate-400">Dashboard / {targetRole.toUpperCase()}</p>
        </div>

        {targetRole === 'karyawan' && (
          <button
            onClick={() => setIsAddEmpOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Karyawan</span>
          </button>
        )}
      </div>

      {/* Main Table Filtered by Role */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-600">
            <thead className="text-[11px] text-slate-400 font-semibold bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-5 py-3">Nama Lengkap</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">No. WhatsApp</th>
                <th className="px-5 py-3">Perangkat Login Terakhir</th>
                <th className="px-5 py-3">IP Address</th>
                <th className="px-5 py-3">Waktu Login</th>
                <th className="px-5 py-3 text-right">Status Akun</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3.5 flex items-center gap-3">
                    <img 
                      src={u.avatar_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'} 
                      alt={u.nama_lengkap} 
                      className="w-8 h-8 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <span className="font-bold text-slate-900 block">{u.nama_lengkap}</span>
                      <span className="text-[10px] text-slate-400">{u.email}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                      u.role === 'karyawan' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-800">{u.no_hp}</td>
                  <td className="px-5 py-3.5 text-slate-800">{u.last_device || 'Chrome 127 on Windows 11'}</td>
                  <td className="px-5 py-3.5 font-mono text-[11px] text-slate-500">{u.last_ip || '182.253.120.44'}</td>
                  <td className="px-5 py-3.5 text-slate-500">{u.last_login ? new Date(u.last_login).toLocaleString('id-ID') : 'Aktif'}</td>
                  <td className="px-5 py-3.5 text-right">
                    <span className="bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                      AKTIF
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL TAMBAH KARYAWAN */}
      {isAddEmpOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                <span>Tambah Karyawan Operator Baru</span>
              </h3>
              <button onClick={() => setIsAddEmpOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <form onSubmit={handleCreateEmp} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nama Lengkap Karyawan *</label>
                <input
                  type="text"
                  placeholder="Misal: Bambang Susanto"
                  value={namaEmp}
                  onChange={(e) => setNamaEmp(e.target.value)}
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Email Perusahaan *</label>
                <input
                  type="email"
                  placeholder="operator2@rentmoto.id"
                  value={emailEmp}
                  onChange={(e) => setEmailEmp(e.target.value)}
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">No. WhatsApp / HP</label>
                <input
                  type="text"
                  placeholder="081234567890"
                  value={noHpEmp}
                  onChange={(e) => setNoHpEmp(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setIsAddEmpOpen(false)} 
                  className="px-4 py-2 rounded-xl text-slate-600 border border-slate-200 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-xs"
                >
                  Simpan Karyawan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
