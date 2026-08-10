'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Transaksi } from '@/lib/types';
import { 
  QrCode, Camera, Upload, CheckCircle2, ShieldCheck, 
  AlertTriangle, Clock, ArrowRight, X, Image as ImageIcon 
} from 'lucide-react';

export const OperatorScanQR: React.FC = () => {
  const { transactions, uploadKTP, updateTransactionStatus } = useAppStore();

  const [inputInvoice, setInputInvoice] = useState('');
  const [scannedTrx, setScannedTrx] = useState<Transaksi | null>(null);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Get paid transactions waiting for QR scan
  const eligibleTransactions = transactions.filter(
    (t) => t.status === 'dibayar' || t.status === 'qr_scanned' || t.status === 'menunggu_pembayaran'
  );

  const handleSimulateScan = (trx: Transaksi) => {
    // Check expiry
    if (trx.qr_expires_at && new Date(trx.qr_expires_at) < new Date()) {
      setErrorMsg(`QR Code untuk Invoice ${trx.invoice_id} sudah Kedaluwarsa (Expired)! Transaksi ditolak.`);
      setScannedTrx(null);
      return;
    }

    setErrorMsg('');
    setScannedTrx(trx);
    setInputInvoice(trx.invoice_id);
    setUploadedPhotos([
      'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80'
    ]);
  };

  const handleAddMockPhoto = () => {
    if (uploadedPhotos.length >= 3) return;
    setUploadedPhotos((prev) => [
      ...prev,
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
    ]);
  };

  const handleConfirmVerification = () => {
    if (!scannedTrx) return;
    if (uploadedPhotos.length === 0) {
      setErrorMsg('Wajib mengunggah minimal 1 foto KTP identitas penyewa!');
      return;
    }

    // 1. Upload KTP with 72h auto-delete schedule
    uploadKTP(scannedTrx.id, uploadedPhotos);

    // 2. Set status to unit berangkat (berlangsung)
    updateTransactionStatus(scannedTrx.id, 'berlangsung', 'usr-karyawan-1');

    setSuccessMsg(`Verifikasi QR & KTP Sukses untuk ${scannedTrx.invoice_id}! Status unit kini "BERLANGSUNG" (Unit Berangkat).`);
    setScannedTrx(null);
    setUploadedPhotos([]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs">
        <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest block">Operator Field Scanner</span>
        <h1 className="text-2xl font-extrabold text-slate-900">Scan QR Code & Upload Identitas KTP</h1>
        <p className="text-slate-500 text-xs mt-1">Verifikasi kecocokan identitas fisik penyewa sebelum serah terima unit motor.</p>
      </div>

      {/* Messages */}
      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Main Grid: Camera Simulation & Scanner Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Camera Scanner Simulation */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-indigo-400 bg-slate-800 px-3.5 py-1.5 rounded-full border border-slate-700">
            <Camera className="w-4 h-4" />
            <span>Kamera QR Scanner Aktif</span>
          </div>

          {/* Viewfinder Graphic */}
          <div className="relative bg-slate-950 rounded-2xl p-8 border-2 border-indigo-500/40 aspect-square flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute inset-4 border-2 border-dashed border-indigo-400/60 rounded-xl animate-pulse" />
            <QrCode className="w-24 h-24 text-indigo-400 stroke-[1.5] mb-2" />
            <p className="text-xs text-slate-400 max-w-xs font-medium">Arahkan kamera ke QR Code di layar HP penyewa</p>
          </div>

          {/* Quick Select Buttons */}
          <div className="space-y-2 text-left">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Pilih Transaksi untuk Di-scan (Simulasi):</label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {eligibleTransactions.map((trx) => (
                <div
                  key={trx.id}
                  onClick={() => handleSimulateScan(trx)}
                  className="p-3 bg-slate-800 hover:bg-slate-700/80 rounded-xl border border-slate-700 cursor-pointer transition-all flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-mono font-bold text-indigo-400 block">{trx.invoice_id}</span>
                    <span className="text-slate-300">{trx.nama_penyewa} ({trx.produk_nama})</span>
                  </div>
                  <span className="bg-indigo-600 text-white px-2.5 py-1 rounded text-[10px] font-bold">
                    Scan
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 2: Identitas Penyewa & KTP Upload Form (Section 6.15 PRD) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 flex flex-col justify-between">
          {scannedTrx ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-indigo-600 uppercase">Data Terdeteksi</span>
                  <h3 className="text-base font-extrabold text-slate-900">{scannedTrx.invoice_id}</h3>
                </div>
                <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                  {scannedTrx.status}
                </span>
              </div>

              {/* Transaction Summary */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1 text-slate-700">
                <p><span className="font-bold">Penyewa:</span> {scannedTrx.nama_penyewa}</p>
                <p><span className="font-bold">WhatsApp:</span> {scannedTrx.no_hp_penyewa}</p>
                <p><span className="font-bold">Kendaraan:</span> {scannedTrx.produk_nama}</p>
                <p><span className="font-bold">Masa Sewa:</span> {scannedTrx.durasi_hari} Hari ({scannedTrx.tanggal_mulai_sewa})</p>
              </div>

              {/* Upload 1-3 KTP Photos */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Upload Foto KTP Penyewa ({uploadedPhotos.length}/3)
                  </label>
                  {uploadedPhotos.length < 3 && (
                    <button
                      type="button"
                      onClick={handleAddMockPhoto}
                      className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>+ Tambah Foto</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {uploadedPhotos.map((url, idx) => (
                    <div key={idx} className="relative h-20 bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                      <img src={url} alt={`KTP ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        onClick={() => setUploadedPhotos(prev => prev.filter((_, i) => i !== idx))}
                        className="absolute top-1 right-1 bg-slate-900/80 text-white rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {uploadedPhotos.length < 3 && (
                    <div 
                      onClick={handleAddMockPhoto}
                      className="h-20 border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-xl flex flex-col items-center justify-center text-slate-400 cursor-pointer transition-colors"
                    >
                      <Camera className="w-5 h-5" />
                      <span className="text-[10px] font-bold mt-1">Upload KTP</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Auto-delete Grace Period Notice Banner (6.15 PRD) */}
              <div className="p-3 bg-indigo-50/80 border border-indigo-100 rounded-2xl text-[11px] text-indigo-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-indigo-900">
                  <Clock className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Skema Retensi PII (Auto-Delete 72 Jam)</span>
                </div>
                <p className="text-[10px] text-indigo-800 leading-relaxed">
                  Foto KTP ini akan disimpan di bucket private Supabase dan dijadwalkan hapus otomatis secara permanen dalam <span className="font-bold">72 jam</span> setelah masa sewa selesai demi keamanan data pribadi.
                </p>
              </div>

              {/* Action */}
              <button
                type="button"
                onClick={handleConfirmVerification}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-3 rounded-2xl shadow-lg shadow-indigo-600/30 transition-all text-xs flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Verifikasi KTP & Serahkan Unit Motor</span>
              </button>
            </div>
          ) : (
            <div className="text-center py-12 space-y-3">
              <QrCode className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="text-sm font-bold text-slate-700">Belum Ada Transaksi Ditolak/Di-scan</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Pilih salah satu transaksi aktif dari daftar di sebelah kiri untuk me-simulasikan hasil scan QR Code pelanggan.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
