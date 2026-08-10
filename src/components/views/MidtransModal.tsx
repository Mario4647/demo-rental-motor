'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Transaksi } from '@/lib/types';
import { CheckCircle2, QrCode, CreditCard, Lock, X, Building2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MidtransModalProps {
  transaction: Transaksi | null;
  onClose: () => void;
  onSuccess: (trx: Transaksi) => void;
}

export const MidtransModal: React.FC<MidtransModalProps> = ({ transaction, onClose, onSuccess }) => {
  const { updateTransactionStatus, setActiveMidtransTrx } = useAppStore();
  const [selectedChannel, setSelectedChannel] = useState<'qris' | 'bca' | 'gopay'>('qris');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!transaction) return null;

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      updateTransactionStatus(transaction.id, 'dibayar');

      setIsProcessing(false);
      setActiveMidtransTrx(null);
      
      const updatedTrx = { ...transaction, status: 'dibayar' as const };
      onSuccess(updatedTrx);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-900 text-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-800 relative">
        
        {/* Midtrans Snap Header */}
        <div className="bg-slate-900 p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white font-black text-xs">
              M
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Midtrans Payment Gateway</span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold border border-emerald-500/30">
                  SANDBOX
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Order ID: {transaction.midtrans_order_id}</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount Summary */}
        <div className="p-5 bg-slate-800/80 border-b border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Tagihan</span>
            <span className="text-2xl font-black text-emerald-400">Rp {transaction.total_harga.toLocaleString('id-ID')}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Penyewa</span>
            <span className="text-xs font-semibold text-white">{transaction.nama_penyewa}</span>
          </div>
        </div>

        {/* Payment Channels */}
        <div className="p-6 space-y-4">
          <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">Pilih Kanal Pembayaran Simulasi</p>

          <div className="space-y-2.5">
            <div 
              onClick={() => setSelectedChannel('qris')}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                selectedChannel === 'qris'
                  ? 'bg-purple-600/20 border-purple-500 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <QrCode className="w-5 h-5 text-purple-400" />
                <div>
                  <h4 className="text-xs font-bold text-white">QRIS Instan (GoPay, ShopeePay, OVO, Dana)</h4>
                  <p className="text-[10px] text-slate-400">Scan kode QR langsung dari aplikasi e-wallet</p>
                </div>
              </div>
              {selectedChannel === 'qris' && <CheckCircle2 className="w-5 h-5 text-purple-400" />}
            </div>

            <div 
              onClick={() => setSelectedChannel('bca')}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                selectedChannel === 'bca'
                  ? 'bg-purple-600/20 border-purple-500 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-purple-400" />
                <div>
                  <h4 className="text-xs font-bold text-white">BCA Virtual Account</h4>
                  <p className="text-[10px] text-slate-400">VA Code: 89012399418820 (Otomatis)</p>
                </div>
              </div>
              {selectedChannel === 'bca' && <CheckCircle2 className="w-5 h-5 text-purple-400" />}
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-5 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-400 hover:text-white"
          >
            Batal
          </button>

          <button
            onClick={handleSimulatePayment}
            disabled={isProcessing}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-xs transition-colors flex items-center gap-2"
          >
            {isProcessing ? (
              <span>Memproses...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Simulasi Bayar Rp {transaction.total_harga.toLocaleString('id-ID')}</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
