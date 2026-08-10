'use client';

import React, { useState } from 'react';
import { ShieldCheck, User, Phone, Mail, Lock, EyeOff, Eye, Loader2, UserPlus, CheckCircle2, XCircle } from 'lucide-react';
import { z } from 'zod';

const registerStaffSchema = z.object({
  role: z.enum(['karyawan', 'admin']),
  namaLengkap: z.string().min(3, "Nama terlalu pendek"),
  email: z.string().email("Format email tidak valid"),
  phone: z.string().min(10, "Nomor handphone tidak valid"),
  password: z.string().min(12, "Password minimal 12 karakter"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});

export function AdminRegisterStaff() {
  const [formData, setFormData] = useState({
    role: 'karyawan', namaLengkap: '', email: '', phone: '', password: '', confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Dummy data for recent staff
  const [recentStaff, setRecentStaff] = useState([
    { id: 1, nama: 'Budi Santoso', email: 'budi@rentmoto.com', role: 'karyawan', tanggal: '2023-10-25', status: 'Aktif' },
    { id: 2, nama: 'Siti Aminah', email: 'siti@rentmoto.com', role: 'admin', tanggal: '2023-10-20', status: 'Aktif' }
  ]);

  const reqs = {
    length: formData.password.length >= 12,
    upper: /[A-Z]/.test(formData.password),
    lower: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[!@#$%^&*]/.test(formData.password),
  };
  
  const score = Object.values(reqs).filter(Boolean).length;
  let strengthLabel = 'Lemah';
  let strengthColor = 'bg-red-500';
  if (score >= 3) { strengthLabel = 'Cukup'; strengthColor = 'bg-orange-500'; }
  if (score >= 4) { strengthLabel = 'Kuat'; strengthColor = 'bg-yellow-500'; }
  if (score === 5) { strengthLabel = 'Sangat Kuat'; strengthColor = 'bg-green-500'; }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (score < 5) {
      setErrors({ password: "Password belum memenuhi semua kriteria" });
      return;
    }

    try {
      registerStaffSchema.parse(formData);
      setErrors({});
      setIsLoading(true);
      
      const res = await fetch('/api/auth/register-staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      
      if (!res.ok) {
        setErrors({ general: data.error || 'Terjadi kesalahan saat registrasi' });
        return;
      }
      
      const newStaff = {
        id: Date.now(),
        nama: formData.namaLengkap,
        email: formData.email,
        role: formData.role,
        tanggal: new Date().toISOString().split('T')[0],
        status: 'Aktif'
      };
      setRecentStaff([newStaff, ...recentStaff].slice(0, 5));
      
      alert('Registrasi staff berhasil!');
      setFormData({ role: 'karyawan', namaLengkap: '', email: '', phone: '', password: '', confirmPassword: '' });
      
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        const newErrors: any = {};
        (err as any).errors.forEach((e: any) => {
          if (e.path[0]) newErrors[e.path[0]] = e.message;
        });
        setErrors(newErrors);
      } else {
        setErrors({ general: 'Gagal terhubung ke server' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-sm text-slate-500 font-medium mb-1">
          <span>Dashboard</span>
          <span>/</span>
          <span className="text-violet-600">Registrasi Staff</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-violet-100 text-violet-600 rounded-xl">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Registrasi Staff Baru</h1>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden p-6">
        <div className="mb-6 p-4 rounded-xl bg-blue-50 border border-blue-100 flex gap-3 text-blue-700 text-sm">
          <ShieldCheck className="w-5 h-5 shrink-0" />
          <p>Akun staff yang dibuat akan langsung aktif dan dapat digunakan untuk login ke sistem.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {errors.general && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm flex items-center gap-2">
              <XCircle className="w-5 h-5 shrink-0" />
              {errors.general}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Role Staff</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ShieldCheck className="h-5 w-5 text-slate-400" />
                </div>
                <select
                  name="role" value={formData.role} onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-2.5 border border-slate-300 focus:ring-violet-500 focus:border-violet-500 rounded-xl text-sm bg-slate-50 focus:bg-white appearance-none"
                >
                  <option value="karyawan">Karyawan (Operator)</option>
                  <option value="admin">Admin (Manajer)</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Lengkap</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text" name="namaLengkap" value={formData.namaLengkap} onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2.5 border ${errors.namaLengkap ? 'border-red-300' : 'border-slate-300 focus:border-violet-500 focus:ring-violet-500'} rounded-xl text-sm bg-slate-50 focus:bg-white`}
                  placeholder="Nama Staff"
                />
              </div>
              {errors.namaLengkap && <p className="mt-1 text-xs text-red-500">{errors.namaLengkap}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email" name="email" value={formData.email} onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2.5 border ${errors.email ? 'border-red-300' : 'border-slate-300 focus:border-violet-500 focus:ring-violet-500'} rounded-xl text-sm bg-slate-50 focus:bg-white`}
                  placeholder="staff@rentmoto.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">No. Handphone</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text" name="phone" value={formData.phone} onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2.5 border ${errors.phone ? 'border-red-300' : 'border-slate-300 focus:border-violet-500 focus:ring-violet-500'} rounded-xl text-sm bg-slate-50 focus:bg-white`}
                  placeholder="08..."
                />
              </div>
              {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange}
                  className={`block w-full pl-10 pr-10 py-2.5 border ${errors.password ? 'border-red-300' : 'border-slate-300 focus:border-violet-500 focus:ring-violet-500'} rounded-xl text-sm bg-slate-50 focus:bg-white`}
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  {showPassword ? <EyeOff className="h-5 w-5 text-slate-400" /> : <Eye className="h-5 w-5 text-slate-400" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Konfirmasi Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                  className={`block w-full pl-10 pr-10 py-2.5 border ${errors.confirmPassword ? 'border-red-300' : 'border-slate-300 focus:border-violet-500 focus:ring-violet-500'} rounded-xl text-sm bg-slate-50 focus:bg-white`}
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  {showConfirmPassword ? <EyeOff className="h-5 w-5 text-slate-400" /> : <Eye className="h-5 w-5 text-slate-400" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-2 max-w-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-700">Kekuatan Password:</span>
              <span className="text-xs font-bold" style={{ color: strengthColor.replace('bg-', 'text-').replace('500', '600') }}>{formData.password ? strengthLabel : ''}</span>
            </div>
            <div className="flex gap-1 h-1.5 mb-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`flex-1 rounded-full ${formData.password.length > 0 && score >= i ? strengthColor : 'bg-slate-200'}`} />
              ))}
            </div>
            <ul className="grid grid-cols-2 gap-y-1 text-xs">
              <li className={`flex items-center gap-1.5 ${reqs.length ? 'text-green-600' : 'text-slate-500'}`}>
                {reqs.length ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />} Minimal 12 karakter
              </li>
              <li className={`flex items-center gap-1.5 ${reqs.upper ? 'text-green-600' : 'text-slate-500'}`}>
                {reqs.upper ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />} Huruf besar (A-Z)
              </li>
              <li className={`flex items-center gap-1.5 ${reqs.lower ? 'text-green-600' : 'text-slate-500'}`}>
                {reqs.lower ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />} Huruf kecil (a-z)
              </li>
              <li className={`flex items-center gap-1.5 ${reqs.number ? 'text-green-600' : 'text-slate-500'}`}>
                {reqs.number ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />} Angka (0-9)
              </li>
              <li className={`flex items-center gap-1.5 ${reqs.special ? 'text-green-600' : 'text-slate-500'}`}>
                {reqs.special ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />} Karakter spesial
              </li>
            </ul>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
            <button
              type="submit" disabled={isLoading}
              className="flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 transition-colors disabled:opacity-70"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />} Daftarkan Staff
            </button>
            <button
              type="button"
              className="py-2.5 px-6 rounded-xl text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Staff Terdaftar (Terbaru)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="pb-3 font-medium">Nama</th>
                <th className="pb-3 font-medium">Email</th>
                <th className="pb-3 font-medium">Role</th>
                <th className="pb-3 font-medium">Tanggal Daftar</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentStaff.map((staff) => (
                <tr key={staff.id} className="text-slate-700">
                  <td className="py-3 font-medium text-slate-900">{staff.nama}</td>
                  <td className="py-3">{staff.email}</td>
                  <td className="py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium uppercase ${staff.role === 'admin' ? 'bg-violet-100 text-violet-700' : 'bg-blue-100 text-blue-700'}`}>
                      {staff.role}
                    </span>
                  </td>
                  <td className="py-3">{staff.tanggal}</td>
                  <td className="py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      {staff.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
