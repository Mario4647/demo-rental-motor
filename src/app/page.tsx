'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Produk, Transaksi } from '@/lib/types';

// Layouts
import { Navbar } from '@/components/layout/Navbar';
import { SidebarCustomer } from '@/components/layout/SidebarCustomer';
import { SidebarAdmin } from '@/components/layout/SidebarAdmin';
import { Footer } from '@/components/layout/Footer';
import { RoleSwitcher } from '@/components/RoleSwitcher';

// Views
import { HomeView } from '@/components/views/HomeView';
import { KatalogView } from '@/components/views/KatalogView';
import { ProductDetailModal } from '@/components/views/ProductDetailModal';
import { CheckoutModal } from '@/components/views/CheckoutModal';
import { MidtransModal } from '@/components/views/MidtransModal';
import { SuccessQRView } from '@/components/views/SuccessQRView';
import { RiwayatView } from '@/components/views/RiwayatView';
import { ProfilView } from '@/components/views/ProfilView';
import { MaintenanceView } from '@/components/views/MaintenanceView';

// Operator Views
import { OperatorDashboard } from '@/components/views/operator/OperatorDashboard';
import { OperatorScanQR } from '@/components/views/operator/OperatorScanQR';
import { OperatorDataRental } from '@/components/views/operator/OperatorDataRental';

// Admin Views
import { AdminDashboard } from '@/components/views/admin/AdminDashboard';
import { AdminDataRental } from '@/components/views/admin/AdminDataRental';
import { AdminProdukCRUD } from '@/components/views/admin/AdminProdukCRUD';
import { AdminUnitView } from '@/components/views/admin/AdminUnitView';
import { AdminTransaksiPembayaran } from '@/components/views/admin/AdminTransaksiPembayaran';
import { AdminUsersManagement } from '@/components/views/admin/AdminUsersManagement';
import { AdminLaporanAudit } from '@/components/views/admin/AdminLaporanAudit';
import { AdminPengaturan } from '@/components/views/admin/AdminPengaturan';

export default function Page() {
  const { 
    activeRole, activeView, setActiveView, appSettings, 
    activeMidtransTrx, setActiveMidtransTrx 
  } = useAppStore();

  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Produk | null>(null);
  const [selectedProductForBooking, setSelectedProductForBooking] = useState<Produk | null>(null);
  const [activeSuccessTrx, setActiveSuccessTrx] = useState<Transaksi | null>(null);

  // 1. Maintenance Mode Override for Guest & Customer Users
  if (appSettings.maintenance_mode && (activeRole === 'guest' || activeRole === 'user')) {
    return (
      <main>
        <MaintenanceView />
        <RoleSwitcher />
      </main>
    );
  }

  // Helper for success booking handler
  const handleBookingSuccess = (trx: Transaksi) => {
    setActiveSuccessTrx(trx);
    setActiveView('success-qr');
  };

  return (
    <div className="min-h-screen bg-[#f6f6fb] text-slate-900 flex flex-col font-sans">
      
      {/* Dynamic Role Layout Rendering */}

      {/* A. GUEST / PUBLIC LAYOUT */}
      {activeRole === 'guest' && (
        <div className="flex-1 flex flex-col">
          <Navbar />
          
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            {activeView === 'success-qr' && activeSuccessTrx ? (
              <SuccessQRView transaction={activeSuccessTrx} />
            ) : activeView === 'katalog' ? (
              <KatalogView
                onSelectProduct={(p) => setSelectedProductForDetail(p)}
                onBookProduct={(p) => setSelectedProductForBooking(p)}
              />
            ) : activeView === 'keranjang' || activeView === 'riwayat' ? (
              <RiwayatView onViewSuccessQR={(t) => { setActiveSuccessTrx(t); setActiveView('success-qr'); }} />
            ) : (
              <HomeView
                onSelectProduct={(p) => setSelectedProductForDetail(p)}
                onBookProduct={(p) => setSelectedProductForBooking(p)}
              />
            )}
          </main>

          <Footer />
        </div>
      )}

      {/* B. CUSTOMER LOGGED-IN USER LAYOUT */}
      {activeRole === 'user' && (
        <div className="flex min-h-screen">
          <SidebarCustomer />

          <main className="flex-1 p-6 sm:p-8 max-w-6xl mx-auto overflow-y-auto">
            {activeView === 'success-qr' && activeSuccessTrx ? (
              <SuccessQRView transaction={activeSuccessTrx} />
            ) : activeView === 'riwayat' ? (
              <RiwayatView onViewSuccessQR={(t) => { setActiveSuccessTrx(t); setActiveView('success-qr'); }} />
            ) : activeView === 'profil' ? (
              <ProfilView />
            ) : activeView === 'katalog' ? (
              <KatalogView
                onSelectProduct={(p) => setSelectedProductForDetail(p)}
                onBookProduct={(p) => setSelectedProductForBooking(p)}
              />
            ) : (
              <HomeView
                onSelectProduct={(p) => setSelectedProductForDetail(p)}
                onBookProduct={(p) => setSelectedProductForBooking(p)}
              />
            )}
          </main>
        </div>
      )}

      {/* C. KARYAWAN / OPERATOR LAYOUT */}
      {activeRole === 'karyawan' && (
        <div className="flex min-h-screen">
          <SidebarAdmin />

          <main className="flex-1 p-6 sm:p-8 max-w-6xl mx-auto overflow-y-auto">
            {activeView === 'operator-scan-qr' ? (
              <OperatorScanQR />
            ) : activeView === 'operator-data-rental' ? (
              <OperatorDataRental />
            ) : (
              <OperatorDashboard />
            )}
          </main>
        </div>
      )}

      {/* D. ADMIN / OWNER LAYOUT */}
      {activeRole === 'admin' && (
        <div className="flex min-h-screen">
          <SidebarAdmin />

          <main className="flex-1 p-6 sm:p-8 max-w-6xl mx-auto overflow-y-auto">
            {activeView === 'admin-data-rental' ? (
              <AdminDataRental />
            ) : activeView === 'admin-produk' ? (
              <AdminProdukCRUD />
            ) : activeView === 'admin-unit' ? (
              <AdminUnitView />
            ) : activeView === 'admin-transaksi-pembayaran' ? (
              <AdminTransaksiPembayaran />
            ) : activeView === 'admin-pelanggan' ? (
              <AdminUsersManagement targetRole="user" />
            ) : activeView === 'admin-karyawan' ? (
              <AdminUsersManagement targetRole="karyawan" />
            ) : activeView === 'admin-laporan-audit' ? (
              <AdminLaporanAudit />
            ) : activeView === 'admin-pengaturan' ? (
              <AdminPengaturan />
            ) : (
              <AdminDashboard />
            )}
          </main>
        </div>
      )}

      {/* MODALS */}
      <ProductDetailModal
        product={selectedProductForDetail}
        onClose={() => setSelectedProductForDetail(null)}
        onBook={(p) => setSelectedProductForBooking(p)}
      />

      <CheckoutModal
        product={selectedProductForBooking}
        onClose={() => setSelectedProductForBooking(null)}
        onSuccess={handleBookingSuccess}
      />

      <MidtransModal
        transaction={activeMidtransTrx}
        onClose={() => setActiveMidtransTrx(null)}
        onSuccess={handleBookingSuccess}
      />

      <RoleSwitcher />

    </div>
  );
}
