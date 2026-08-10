'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { Wrench, Bike, Phone } from 'lucide-react';

export const MaintenanceView: React.FC = () => {
  const { appSettings } = useAppStore();
  const [countdown, setCountdown] = useState(45 * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 relative">
      <div className="max-w-md w-full text-center space-y-6 bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl">
        
        {/* Brand */}
        <div className="inline-flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white">
            <Bike className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-xl font-black text-white tracking-tight">
            Rent<span className="text-purple-400">Moto</span>
          </span>
        </div>

        {/* Maintenance Icon */}
        <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-400/30 text-amber-400 flex items-center justify-center mx-auto shadow-md animate-pulse">
          <Wrench className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-950 px-3 py-0.5 rounded-full border border-amber-800">
            System Maintenance Mode
          </span>
          <h1 className="text-2xl font-bold tracking-tight">Sistem Sedang Ditingkatkan</h1>
          <p className="text-slate-300 text-xs leading-relaxed">
            {appSettings.maintenance_pesan}
          </p>
        </div>

        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Perkiraan Selesai</span>
          <span className="text-2xl font-black font-mono text-purple-400 tracking-widest">{formatTimer(countdown)}</span>
        </div>

        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Bantuan darurat:</span>
          <a href={`https://wa.me/${appSettings.kontak_whatsapp.replace('+', '')}`} target="_blank" rel="noreferrer" className="text-purple-400 font-bold hover:underline flex items-center gap-1">
            <Phone className="w-3.5 h-3.5" />
            <span>WhatsApp CS</span>
          </a>
        </div>

      </div>
    </div>
  );
};
