'use client';

import React, { useState } from 'react';
import { Mail, Lock, EyeOff, Eye, Loader2, Bike } from 'lucide-react';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email({ message: "Format email tidak valid" }),
  password: z.string().min(1, { message: "Password tidak boleh kosong" }),
});

export function LoginPage({ 
  onSwitch, 
  onForgotPassword, 
  onLoginSuccess 
}: { 
  onSwitch: () => void; 
  onForgotPassword: () => void; 
  onLoginSuccess: (user: any) => void; 
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [bruteForceMsg, setBruteForceMsg] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setBruteForceMsg('');
    
    try {
      const parsed = loginSchema.parse({ email, password });
      setErrors({});
      
      setIsLoading(true);
      
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: parsed.email, password: parsed.password }),
      });
      
      const data = await res.json();
      
      if (res.status === 429) {
        const retryAfter = res.headers.get('Retry-After');
        setBruteForceMsg(`Terlalu banyak percobaan. Coba lagi dalam ${retryAfter || '60'} detik.`);
        return;
      }
      
      if (res.status === 403) {
        setBruteForceMsg('Akun diblokir sementara karena terlalu banyak percobaan login gagal. Coba lagi dalam 15 menit.');
        return;
      }
      
      if (!res.ok) {
        setErrorMsg(data.error === 'Invalid credentials' ? 'Email atau password salah' : (data.error || 'Terjadi kesalahan'));
        return;
      }
      
      onLoginSuccess(data.user);
      
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        const newErrors: any = {};
        const errorsList = (err as any).issues || (err as any).errors || [];
        errorsList.forEach((e: any) => {
          if (e.path && e.path[0]) newErrors[e.path[0]] = e.message;
        });
        setErrors(newErrors);
      } else {
        setErrorMsg('Koneksi gagal. Periksa jaringan Anda.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-slate-200/60">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-violet-600 text-white mb-4">
            <Bike className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Masuk ke Akun Anda</h2>
          <p className="text-sm text-slate-500 mt-2">Selamat datang kembali di RentMoto</p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100 flex items-center gap-2">
            {errorMsg}
          </div>
        )}

        {bruteForceMsg && (
          <div className="mb-4 p-3 rounded-lg bg-orange-50 text-orange-600 text-sm border border-orange-100 flex items-center gap-2">
            {bruteForceMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`block w-full pl-10 pr-3 py-2.5 border ${errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 focus:ring-violet-500 focus:border-violet-500'} rounded-xl text-sm transition-all duration-200 bg-slate-50 focus:bg-white`}
                placeholder="nama@email.com"
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`block w-full pl-10 pr-10 py-2.5 border ${errors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 focus:ring-violet-500 focus:border-violet-500'} rounded-xl text-sm transition-all duration-200 bg-slate-50 focus:bg-white`}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600 transition-colors" />
                ) : (
                  <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600 transition-colors" />
                )}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
          </div>

          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-sm font-medium text-violet-600 hover:text-violet-700 transition-colors"
            >
              Lupa Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-all duration-200 disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Masuk'}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">atau</span>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Belum punya akun?{' '}
              <button
                type="button"
                onClick={onSwitch}
                className="font-medium text-violet-600 hover:text-violet-700 transition-colors"
              >
                Daftar Sekarang
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
