'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Lock, EyeOff, Eye, Loader2, Bike, User, Phone, CreditCard, CheckCircle2, XCircle } from 'lucide-react';
import { z } from 'zod';

const registerSchema = z.object({
  namaLengkap: z.string().min(3, "Nama terlalu pendek"),
  email: z.string().email("Format email tidak valid"),
  nik: z.string().length(16, "NIK harus 16 digit").regex(/^\d+$/, "NIK hanya boleh berisi angka"),
  phone: z.string().min(10, "Nomor handphone tidak valid").regex(/^[0-9+]+$/, "Format nomor tidak valid"),
  password: z.string().min(12, "Password minimal 12 karakter"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});

export function RegisterPage({ 
  onSwitch, 
  onRegisterSuccess 
}: { 
  onSwitch: () => void; 
  onRegisterSuccess: () => void; 
}) {
  const [formData, setFormData] = useState({
    namaLengkap: '', email: '', nik: '', phone: '', password: '', confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  // Password requirements
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
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!acceptedTerms) {
      setErrors({ terms: "Anda harus menyetujui syarat & ketentuan" });
      return;
    }
    if (score < 5) {
      setErrors({ password: "Password belum memenuhi semua kriteria" });
      return;
    }

    try {
      // Map frontend fields to backend schema expected fields
      const dataToValidate = {
        email: formData.email,
        password: formData.password,
        nama_lengkap: formData.namaLengkap,
        nik: formData.nik,
        no_hp: formData.phone,
      };
      
      registerSchema.parse(dataToValidate);
      setErrors({});
      setIsLoading(true);
      
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToValidate),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setErrors({ general: data.error || data.details || 'Registrasi gagal. Silakan coba lagi.' });
        return;
      }
      
      setSuccess(true);
      setTimeout(() => {
        onRegisterSuccess();
      }, 2000);
      
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        const newErrors: any = {};
        const errorsList = (err as any).issues || (err as any).errors || [];
        errorsList.forEach((e: any) => {
          if (e.path && e.path[0]) {
            // Map backend schema field names back to frontend state names for error display
            let fieldName = e.path[0];
            if (fieldName === 'nama_lengkap') fieldName = 'namaLengkap';
            if (fieldName === 'no_hp') fieldName = 'phone';
            newErrors[fieldName] = e.message;
          }
        });
        setErrors(newErrors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-slate-200/60 text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Registrasi Berhasil!</h2>
          <p className="text-slate-600 mb-6">Akun Anda telah berhasil dibuat. Silakan masuk dengan akun baru Anda.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full bg-white p-8 rounded-2xl shadow-sm border border-slate-200/60">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-violet-600 text-white mb-4">
            <Bike className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Buat Akun Baru</h2>
          <p className="text-sm text-slate-500 mt-2">Bergabung dengan RentMoto untuk pengalaman rental motor terbaik</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Lengkap</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text" name="namaLengkap" value={formData.namaLengkap} onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border ${errors.namaLengkap ? 'border-red-300 focus:ring-red-500' : 'border-slate-300 focus:ring-violet-500'} rounded-xl text-sm bg-slate-50 focus:bg-white transition-all`}
                  placeholder="John Doe"
                />
              </div>
              {errors.namaLengkap && <p className="mt-1 text-xs text-red-500">{errors.namaLengkap}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="email" name="email" value={formData.email} onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border ${errors.email ? 'border-red-300 focus:ring-red-500' : 'border-slate-300 focus:ring-violet-500'} rounded-xl text-sm bg-slate-50 focus:bg-white transition-all`}
                  placeholder="nama@email.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">NIK KTP</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CreditCard className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text" name="nik" value={formData.nik} onChange={handleChange} maxLength={16}
                  className={`block w-full pl-10 pr-3 py-2 border ${errors.nik ? 'border-red-300 focus:ring-red-500' : 'border-slate-300 focus:ring-violet-500'} rounded-xl text-sm bg-slate-50 focus:bg-white transition-all`}
                  placeholder="16 Digit NIK"
                />
              </div>
              {errors.nik ? <p className="mt-1 text-xs text-red-500">{errors.nik}</p> : <p className="mt-1 text-xs text-slate-400">Nomor Induk Kependudukan 16 digit</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">No. Handphone</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text" name="phone" value={formData.phone} onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border ${errors.phone ? 'border-red-300 focus:ring-red-500' : 'border-slate-300 focus:ring-violet-500'} rounded-xl text-sm bg-slate-50 focus:bg-white transition-all`}
                  placeholder="0812..."
                />
              </div>
              {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange}
                  className={`block w-full pl-10 pr-10 py-2 border ${errors.password ? 'border-red-300 focus:ring-red-500' : 'border-slate-300 focus:ring-violet-500'} rounded-xl text-sm bg-slate-50 focus:bg-white transition-all`}
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  {showPassword ? <EyeOff className="h-4 w-4 text-slate-400" /> : <Eye className="h-4 w-4 text-slate-400" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Konfirmasi Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                  className={`block w-full pl-10 pr-10 py-2 border ${errors.confirmPassword ? 'border-red-300 focus:ring-red-500' : 'border-slate-300 focus:ring-violet-500'} rounded-xl text-sm bg-slate-50 focus:bg-white transition-all`}
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  {showConfirmPassword ? <EyeOff className="h-4 w-4 text-slate-400" /> : <Eye className="h-4 w-4 text-slate-400" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-2">
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

          <div className="flex items-start mt-4">
            <div className="flex items-center h-5">
              <input
                id="terms" type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="w-4 h-4 text-violet-600 bg-slate-100 border-slate-300 rounded focus:ring-violet-500"
              />
            </div>
            <label htmlFor="terms" className="ml-2 text-sm text-slate-600">
              Saya menyetujui Syarat & Ketentuan serta Kebijakan Privasi
            </label>
          </div>
          {errors.terms && <p className="text-xs text-red-500 mt-1">{errors.terms}</p>}

          <button
            type="submit" disabled={isLoading}
            className="w-full flex justify-center items-center py-2.5 px-4 mt-6 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-all duration-200 disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Daftar'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            Sudah punya akun?{' '}
            <button type="button" onClick={onSwitch} className="font-medium text-violet-600 hover:text-violet-700 transition-colors">
              Masuk
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
