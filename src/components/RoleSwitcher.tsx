'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { Shield, UserCheck, Wrench, Sparkles, AlertTriangle } from 'lucide-react';

export const RoleSwitcher: React.FC = () => {
  const { activeRole, setActiveRole, appSettings, toggleMaintenanceMode } = useAppStore();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {appSettings.maintenance_mode && (
        <div className="bg-amber-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 animate-pulse">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Mode Maintenance Aktif</span>
        </div>
      )}

      {/* Floating Control Bar */}
      <div className="bg-slate-900 text-white p-2 rounded-2xl shadow-xl border border-slate-800 flex items-center gap-1 text-xs">
        <div className="px-2 py-1 text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1 text-[10px]">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Demo Role:</span>
        </div>

        <button
          onClick={() => setActiveRole('guest')}
          className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
            activeRole === 'guest'
              ? 'bg-purple-600 text-white font-bold shadow-xs'
              : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          <span>Pengunjung</span>
        </button>

        <button
          onClick={() => setActiveRole('user')}
          className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1 ${
            activeRole === 'user'
              ? 'bg-purple-600 text-white font-bold shadow-xs'
              : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Pelanggan</span>
        </button>

        <button
          onClick={() => setActiveRole('karyawan')}
          className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1 ${
            activeRole === 'karyawan'
              ? 'bg-purple-600 text-white font-bold shadow-xs'
              : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>Operator</span>
        </button>

        <button
          onClick={() => setActiveRole('admin')}
          className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1 ${
            activeRole === 'admin'
              ? 'bg-purple-600 text-white font-bold shadow-xs'
              : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Admin</span>
        </button>

        <div className="w-px h-4 bg-slate-800 mx-1" />

        <button
          onClick={() => toggleMaintenanceMode(!appSettings.maintenance_mode)}
          className={`px-2.5 py-1.5 rounded-xl font-medium text-[11px] transition-all flex items-center gap-1 ${
            appSettings.maintenance_mode
              ? 'bg-amber-500 text-white font-bold'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <AlertTriangle className="w-3 h-3 text-amber-400" />
          <span>{appSettings.maintenance_mode ? 'Off Maint' : 'Test Maint'}</span>
        </button>
      </div>
    </div>
  );
};
