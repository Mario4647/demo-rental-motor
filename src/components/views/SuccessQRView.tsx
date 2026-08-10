'use client';

import React from 'react';
import { Transaksi } from '@/lib/types';
import { useAppStore } from '@/lib/store';
import { 
  CheckCircle2, QrCode, Download, MapPin, Calendar, Clock, 
  ShieldCheck, ArrowLeft, Bike 
} from 'lucide-react';

interface SuccessQRViewProps {
  transaction: Transaksi;
}

export const SuccessQRView: React.FC<SuccessQRViewProps> = ({ transaction }) => {
  const { setActiveView } = useAppStore();

  const handleDownloadQR = () => {
    const link = document.createElement('a');
    link.href = transaction.qr_code_url || `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${transaction.invoice_id}`;
    link.download = `RentMoto-QR-${transaction.invoice_id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      
      {/* Top Navigation */}
      <button
        onClick={() => setActiveView('riwayat')}
        className="inline-flex items-center gap-2 text-xs font-bold text-purple-600 hover:text-purple-700 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-xs"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Riwayat Pesanan</span>
      </button>

      {/* Success Hero Header (Solid background - NO GRADIENTS) */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl border border-slate-800 text-center space-y-3">
        <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800">
            Pembayaran Sukses & Terverifikasi
          </span>
          <h1 className="text-3xl font-black mt-2">Pembayaran Berhasil!</h1>
          <p className="text-slate-300 text-xs max-w-lg mx-auto mt-1">
            Transaksi invoice <span className="font-mono text-emerald-400 font-bold">{transaction.invoice_id}</span> telah lunas. QR Code di bawah ini siap dipakai untuk pengambilan unit.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* QR Code Panel */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs text-center space-y-5 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg mb-3">
              <QrCode className="w-4 h-4 text-purple-600" />
              <span>QR Code Pengambilan Unit</span>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border-2 border-dashed border-slate-200 inline-block">
              <img 
                src={transaction.qr_code_url || `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${transaction.invoice_id}`}
                alt={`QR Code ${transaction.invoice_id}`}
                className="w-52 h-52 mx-auto rounded-xl shadow-xs border border-white"
              />
              <div className="mt-2 text-[11px] font-mono font-bold text-slate-800">
                {transaction.invoice_id}
              </div>
            </div>

            <div className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-200 text-left flex items-start gap-2">
              <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-[11px]">
                <span className="font-bold text-amber-900 block">Masa Berlaku QR Code</span>
                <p className="text-amber-700">QR valid sampai tanggal {transaction.tanggal_mulai_sewa}.</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleDownloadQR}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 rounded-xl shadow-xs text-xs flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Unduh Simpan QR Code (PNG)</span>
            </button>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Invoice</span>
                <span className="text-base font-bold text-slate-900 font-mono block">{transaction.invoice_id}</span>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 uppercase">
                {transaction.status}
              </span>
            </div>

            <div className="space-y-2 text-slate-600 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex justify-between"><span className="text-slate-400">Motor:</span><span className="font-bold text-slate-900">{transaction.produk_nama}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Penyewa:</span><span className="font-bold text-slate-900">{transaction.nama_penyewa}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">WhatsApp:</span><span className="font-bold text-slate-900">{transaction.no_hp_penyewa}</span></div>
              <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-bold text-slate-900">
                <span>Total Paid:</span>
                <span className="text-purple-600">Rp {transaction.total_harga.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
