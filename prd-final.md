PRODUCT REQUIREMENTS DOCUMENT (PRD) - VERSI DISEDERHANAKAN

Website Rental Motor Full-Otomatis - Next.js TypeScript

Security Core Edition | Production-Ready | Step-by-Step Build

---

Dokumen Versi: 6.0 Final
Tanggal: 8 Agustus 2026
Status: Ready for Development
Metodologi: Incremental Step-Based Development (setiap Fase = satu prompt "lanjut" ke AI agent)
Tech Stack: Next.js 14+ TypeScript Fullstack, Supabase PostgreSQL (Free Tier), Netlify (hosting), Midtrans Payment Gateway, Tailwind CSS, Shadcn UI, Upstash Redis, Cloudflare (DNS proxy)

Catatan Revisi: Versi ini menghapus/menyederhanakan lapisan operasional dan redundan (MFA, monitoring pihak ketiga wajib, automated E2E test suite, dsb) untuk efisiensi biaya development, sambil mempertahankan seluruh fondasi keamanan inti (RLS, RBAC server-side, enkripsi PII, payment security, anti race-condition, security headers, DDoS protection). Ditambahkan skema retensi data (auto-delete foto KTP, arsip audit log) agar tetap muat di Supabase Free Tier tanpa mengorbankan kepatuhan/keamanan. Hosting dipindah ke Netlify (mendukung komersial di tier gratis, tidak seperti Vercel Hobby). Ringkasan perubahan ada di Lampiran.

---

1. EXECUTIVE SUMMARY

Website Rental Motor Full-Otomatis adalah platform web dengan keamanan berlapis yang proporsional terhadap risiko bisnis utamanya: fraud pembayaran, bypass role, dan kebocoran data pelanggan (NIK, no HP). Dibangun dengan Next.js 14 TypeScript fullstack, Supabase PostgreSQL, dan Midtrans. Pembangunan mengikuti pendekatan MVP-first dan step-by-step per fase. Target akhir: production-ready, responsive, Lighthouse >= 90, dan aman dari kelas serangan umum (OWASP Top 10) dengan fondasi RLS + RBAC + enkripsi yang solid.

---

2. PRODUCT VISION

Menjadi solusi digital end-to-end untuk bisnis rental motor yang mengotomatisasi pemesanan, pembayaran, verifikasi identitas, manajemen unit, dan pelacakan transaksi real-time, dengan keamanan yang kuat di lapisan fundamental (data, akses, pembayaran) tanpa membebani biaya dan waktu development dengan lapisan operasional tambahan yang tidak esensial di tahap awal.

---

3. TARGET USERS & ROLES

**User (Pelanggan Penyewa)**
Melihat katalog produk, memesan, membayar via Midtrans, mendapat QR Code untuk pengambilan unit, dan melihat riwayat transaksi. Akses dibatasi hanya ke data miliknya sendiri via Row Level Security.

**Karyawan (Operator Lapangan)**
Mengelola dashboard operasional, tombol Unit Berangkat/Kembali, transaksi manual walk-in (cash/online), scan QR Code, dan verifikasi identitas (upload 1-3 foto KTP). Tidak bisa mengubah data produk, pengaturan sistem, atau melihat audit log. Semua aksi dicatat di audit log.

**Admin (Pemilik Bisnis)**
Akses penuh: CRUD produk & unit, lihat/ekspor audit log, atur payment gateway, maintenance mode, konten halaman utama, laporan keuangan, manajemen user & role, dan refund.

---

4. TECHNOLOGY STACK

Next.js 14+ App Router + TypeScript (frontend+backend satu project). Tailwind CSS + Shadcn UI. Zustand (state client). React Query/TanStack Query (data fetching & cache). React Hook Form + Zod (form & validasi). Supabase PostgreSQL (RLS, encryption at rest, Storage). Supabase Auth JWT RS256 via Next.js Middleware. Midtrans Snap API. Next.js Metadata API + next-sitemap + JSON-LD (SEO). Supabase Edge Functions (cron). Upstash Redis (serverless) untuk rate limiting.

---

5. DATABASE ARCHITECTURE

RLS aktif di semua tabel. Setiap role punya kebijakan akses berbeda. Column-level encryption AES-256-GCM untuk NIK dan nomor HP — ini tetap wajib karena murah diimplementasi tapi krusial untuk kepatuhan data pribadi.

Tabel `users`: id UUID PK, email unique, password_hash bcrypt cost 12, nama_lengkap, nik unique 16 digit encrypted, no_hp encrypted, role enum admin-karyawan-user default user, avatar_url, is_active boolean default true, created_at, updated_at.

Tabel `user_sessions`: id UUID, user_id FK, session_id unique, refresh_token_hash, device_info, ip_address, created_at, expires_at, is_revoked boolean.

Tabel `login_attempts`: id UUID, ip_address, email, attempt_count, last_attempt_at, is_blocked_until.

Tabel `token_blacklist`: id UUID, jti unique, expires_at, revoked_at.

Tabel `produk`: id UUID PK, nama, slug unique auto-generated, deskripsi, harga_per_hari decimal, gambar_url array, jumlah_unit_tersedia integer default 0, is_active boolean default true, created_at, updated_at.

Tabel `unit`: id UUID PK, produk_id FK cascade, nomor_plat unique (validasi format Indonesia), status enum tersedia-disewa-maintenance default tersedia, version integer default 0 (optimistic locking, lihat 6.10), created_at, updated_at.

Tabel `transaksi`: id UUID PK, user_id FK nullable, karyawan_id FK, unit_id FK, invoice_id unique format INV-YYYYMMDD-XXXX, nama_penyewa, no_hp_penyewa encrypted, nik_penyewa encrypted, tanggal_mulai_sewa, jam_mulai_sewa, durasi_hari, total_harga decimal, status enum pending-menunggu_pembayaran-dibayar-qr_scanned-berlangsung-selesai-dibatalkan-refund default pending, metode_pembayaran enum midtrans-cash-admin, snap_token, midtrans_order_id, payment_deadline_at, qr_code_url signed URL, qr_expires_at timestamptz (QR hanya valid sampai waktu ini, lihat 6.11), lokasi_pengambilan, idempotency_key unique, metadata JSONB, created_at, updated_at.

Tabel `pembayaran`: id UUID PK, transaksi_id FK cascade, midtrans_order_id unique, transaction_status, payment_type, bank, va_number, gross_amount decimal, pdf_url, raw_callback JSONB, created_at.

Tabel `identitas_penyewa`: id UUID PK, transaksi_id FK cascade, foto_url array 1-3 foto, uploaded_by FK, status_verifikasi enum pending-sesuai-tidak_sesuai default pending, **dijadwalkan_hapus_at timestamptz (diisi otomatis: waktu transaksi berubah status selesai/dibatalkan + 72 jam, lihat 6.15)**, created_at.

Tabel `audit_logs`: id UUID PK, user_id FK, aksi enum CREATE-UPDATE-DELETE-LOGIN-PAYMENT-SCAN-MAINTENANCE-REFUND-SECURITY, entitas, entitas_id, deskripsi, metadata JSONB (before/after), ip_address, user_agent, request_id, created_at. Hanya SELECT dan INSERT — tidak bisa diubah/dihapus siapapun (dihapus hanya lewat mekanisme arsip otomatis di 6.16, bukan manual).

Tabel `pengaturan_aplikasi`: id UUID PK, kunci unique, nilai text, deskripsi, updated_by FK, created_at, updated_at.

Tabel `pengaturan_payment`: id UUID PK, provider default midtrans, client_key encrypted, server_key encrypted, is_active boolean default true, updated_by FK, created_at, updated_at.

---

6. SECURITY ARCHITECTURE

Prinsip: fokus penuh pada lapisan yang murah diimplementasi tapi berdampak besar (RLS, RBAC server-side, enkripsi PII, validasi pembayaran server-side, anti race-condition). Lapisan operasional yang mahal effort tapi marginal manfaatnya untuk skala bisnis ini disederhanakan atau dijadikan opsional untuk fase lanjutan pasca-launch.

6.1 AUTHENTICATION SECURITY

Supabase Auth dengan JWT RS256. Access token maksimal 15 menit, disimpan di memory browser (tidak pernah di localStorage/sessionStorage/cookie JS-accessible). Refresh token di HttpOnly cookie, flag Secure, SameSite Strict, prefix `__Host-`.

Password minimal 12 karakter (uppercase, lowercase, angka, special character). Hash bcrypt cost 12. Brute force lock: 5 kali gagal dalam 15 menit dari IP yang sama → block sementara. Password lama dicek terhadap 5 password terakhir saat reset.

**MFA dihapus dari scope ini.** Sebagai gantinya, keamanan akun admin/karyawan tetap dijaga lewat: password kompleks wajib, brute-force lock ketat, notifikasi email otomatis setiap login dari device/IP baru (langkah murah yang memberi visibilitas ke pemilik akun tanpa menambah friction operasional), dan kemampuan admin untuk melihat & mencabut (revoke) session aktif kapan saja dari halaman profil. **Catatan risiko:** tanpa MFA, akun admin/karyawan sepenuhnya bergantung pada kekuatan password — sangat disarankan admin memakai password manager dan tidak reuse password dari layanan lain. Ini satu-satunya trade-off keamanan yang signifikan di versi ini; bisa ditambahkan kembali sebagai upgrade minor kapan saja tanpa mengubah skema database (kolom `mfa_enabled` tetap disiapkan di tabel `users` untuk kemudahan aktivasi di masa depan).

Session: satu session aktif per device, idle timeout 60 menit, refresh token rotation sederhana (token lama langsung invalid setiap kali dipakai refresh, tanpa mekanisme deteksi reuse family ID yang kompleks — cukup untuk skala ancaman bisnis ini).

6.2 AUTHORIZATION SECURITY - ANTI ROLE BYPASS

RBAC strictly server-side — **ini tidak dikurangi sama sekali**. Role diverifikasi ulang dari database di setiap request, bukan hanya dari JWT payload. Role hierarchy: admin > karyawan > user. 403 Forbidden tanpa detail role yang dibutuhkan jika akses ditolak.

6.3 CSRF PROTECTION (disederhanakan jadi satu pola)

Cookie refresh & session menggunakan **SameSite=Strict + HttpOnly + Secure**, dikombinasikan dengan **Origin/Referer header check** di server untuk semua mutasi (POST/PUT/PATCH/DELETE). Ini satu pola konsisten yang menutup mayoritas skenario CSRF tanpa perlu token terpisah yang dikirim manual di header — karena SameSite Strict sudah mencegah browser mengirim cookie pada request cross-site sama sekali.

6.4 JWT SECURITY

RS256 asymmetric. Payload minimal: sub, role, session_id, iat, exp, jti. Validasi signature, exp (toleransi 0 detik), nbf, iss, aud, jti anti-replay, cek blacklist server-side.

6.5 INPUT VALIDATION & INJECTION PREVENTION

Zod schema whitelisting di semua input server-side — **wajib, tidak dikurangi**. Supabase client/parameterized queries (tidak ada raw SQL dari string concatenation). RLS sebagai lapisan tambahan. XSS: React JSX auto-escape, `dangerouslySetInnerHTML` hanya untuk rich text yang di-sanitize DOMPurify. CSP membatasi source script. RCE: tidak ada eksekusi shell command dari input user; upload file disimpan UUID, tidak pernah dieksekusi.

6.6 FILE UPLOAD SECURITY

Validasi magic bytes server-side (library `file-type`) — **wajib, tidak dikurangi**. JPEG/PNG/WebP saja. Maks 2MB foto profil, 5MB foto identitas. Disimpan di Supabase Storage bucket private, nama UUID random, akses via signed URL (masa berlaku 5 menit). Sharp untuk thumbnail dan strip EXIF metadata.

6.7 API SECURITY & RATE LIMITING

Rate limiting sliding window via Upstash Redis — **wajib, effort rendah manfaat tinggi**. User: 30/menit. Auth: 5/menit per IP. Transaction creation: 3/menit per user. Admin: 60/menit. Global: 1000/menit. Response 429 + header Retry-After, tanpa detail limit tersisa.

6.8 PAYMENT SECURITY - ANTI BYPASS

**Ini bagian paling kritis, tidak ada yang dikurangi.** Semua perhitungan harga server-side dari database, bukan dari input client. Webhook signature SHA512(order_id + status_code + gross_amount + server_key) wajib valid. Server key tidak pernah ke client. Payment amount divalidasi ulang di setiap tahap (create & callback). State machine ketat untuk transisi status (tidak bisa skip step). Idempotency key mencegah double payment. Cron job per menit membatalkan transaksi yang lewat payment_deadline_at dan mengembalikan stok. Refund hanya oleh admin dengan konfirmasi password, tercatat di audit_logs.

6.9 ENCRYPTION & DATA PROTECTION

TLS 1.3 minimum (default dari Netlify/Supabase, tidak perlu setup tambahan). HSTS max-age 1 tahun. Encryption at rest Supabase. Column-level encryption AES-256-GCM untuk NIK, no HP, server key payment gateway — **wajib**. Encryption key di environment variable. Password hashing bcrypt cost 12 + salt random. Rotasi key dilakukan manual saat dibutuhkan (misal jika ada indikasi kebocoran), tanpa perlu prosedur otomatis formal di fase awal.

6.10 KONKURENSI STOK UNIT

Saat dua transaksi mencoba memesan unit yang sama secara bersamaan, sistem mencegah double-booking lewat fungsi database Postgres (`FOR UPDATE` row lock) yang mengunci baris `unit` saat proses create transaksi, mengecek status masih `tersedia`, baru mengubah status dalam satu transaction block atomik. Kolom `version` di tabel unit sebagai optimistic locking check tambahan. **Wajib — ini murni logic, tidak menambah biaya infrastruktur, dan mencegah kerugian bisnis nyata.**

6.11 QR CODE EXPIRY

QR Code untuk pengambilan unit punya `qr_expires_at` (default: sampai akhir tanggal_mulai_sewa + toleransi jam, diatur admin). QR lewat waktu ditolak saat di-scan karyawan. **Wajib — mencegah penyalahgunaan QR lama, effort implementasi kecil.**

6.12 SECURITY HEADERS

CSP: default-src 'self', script-src 'self' with nonce, style-src 'self' 'unsafe-inline', img-src 'self' data: https:, frame-src 'self' https://app.midtrans.com, connect-src 'self' https://api.supabase.com, object-src 'none', frame-ancestors 'none', upgrade-insecure-requests. HSTS, X-Content-Type-Options nosniff, X-Frame-Options DENY, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy (camera hanya di halaman scan QR), COOP/CORP same-origin. **Wajib — konfigurasi statis, tidak ada biaya development berulang.**

6.13 DDoS PROTECTION

**Cloudflare (mode proxy) di depan domain — wajib, gratis, effort setup rendah (cukup ganti nameserver domain ke Cloudflare).** Ini menahan mayoritas serangan volumetric/network-layer DDoS sebelum sampai ke server aplikasi. Ditambah lapisan aplikasi yang sudah ada: rate limiting per endpoint (6.7), request body size maksimal (default Next.js/Netlify sudah membatasi), dan connection timeout pendek bawaan platform hosting (mencegah Slowloris-style attack). Cloudflare juga sekaligus memberi manfaat tambahan tanpa biaya ekstra: caching aset statis dan proteksi bot dasar.

6.14 AUDIT LOGGING

Semua aktivitas kritis dicatat: login sukses/gagal, perubahan data produk/transaksi/pengaturan/payment, akses data sensitif, perubahan role, refund, penghapusan data. Log immutable (SELECT+INSERT only) — **wajib, tabel database biasa, tidak butuh tooling tambahan**. Review audit log dilakukan manual berkala oleh admin dari halaman Audit Log, tanpa sistem alerting real-time otomatis (bisa ditambahkan sebagai upgrade nanti bila skala bisnis bertambah besar).

6.15 AUTO-DELETE FOTO IDENTITAS (RETENSI DATA)

**Tujuan ganda: mengurangi risiko privasi PII yang tersimpan lama, sekaligus menghemat kuota storage Supabase Free Tier.**

Saat status transaksi berubah menjadi `selesai` atau `dibatalkan`, sistem otomatis mengisi `dijadwalkan_hapus_at` pada baris `identitas_penyewa` terkait = waktu perubahan status + 72 jam (grace period). Grace period ini sengaja diberikan (bukan hapus instan) untuk mengakomodasi kasus sengketa (komplain kerusakan unit, kebutuhan laporan ke pihak berwajib) yang butuh bukti foto identitas dalam waktu dekat setelah transaksi selesai.

Cron job (Supabase Edge Function, berjalan setiap 1 jam) mencari baris `identitas_penyewa` yang `dijadwalkan_hapus_at` sudah lewat, menghapus file fisik dari Supabase Storage, lalu menghapus barisnya dari tabel. Penghapusan bersifat permanen dan tercatat di `audit_logs` (aksi DELETE, entitas identitas_penyewa) — jejak bahwa penghapusan terjadi tetap ada meski isinya sudah tidak bisa dipulihkan.

Foto produk dan poster (konten statis milik bisnis, bukan PII pelanggan) **tidak** kena mekanisme ini — tetap tersimpan permanen seperti biasa.

6.16 ARSIP & RETENSI AUDIT LOG

**Tujuan: menjaga histori audit tetap ada untuk kepatuhan, sekaligus mencegah tabel `audit_logs` menghabiskan kuota 500MB database Supabase Free Tier dalam jangka panjang.**

Siklus retensi 6 bulan per baris log, dihitung dari `created_at`:
- **H-45 sebelum baris log tertua mencapai usia 6 bulan**: dashboard admin menampilkan notifikasi (banner/badge) mengingatkan untuk export data audit log yang mendekati batas retensi. Notifikasi ini muncul terus tiap admin login sampai export dilakukan atau baris log tersebut terlanjur dihapus otomatis.
- Admin melakukan export lewat fitur yang sudah ada (`GET /api/v1/export/...` diperluas untuk audit log) ke CSV/Excel, disimpan admin di luar sistem (Google Drive/lokal) sebagai arsip permanen milik bisnis.
- **Setelah genap 6 bulan sejak `created_at`**, cron job (Supabase Edge Function, berjalan harian) menghapus permanen baris log tersebut dari database, terlepas apakah sudah di-export atau belum — admin bertanggung jawab mengekspor sebelum batas waktu berdasarkan notifikasi H-45 yang sudah diberikan.
- Penghapusan ini adalah satu-satunya pengecualian terhadap sifat "immutable" audit_logs di 6.14 — dieksekusi oleh sistem terjadwal, bukan oleh user manapun secara manual, dan tidak bisa dipicu lebih cepat dari jadwalnya.

---

7. USER FLOW & FEATURES

7.1 USER ROLE (PELANGGAN)

Navbar: Home, Produk, Keranjang, Riwayat Pesanan, Profil, Logout. Mobile: hamburger/bottom sheet.

Halaman Home: hero carousel (diatur admin), section perkenalan (rich text, diatur admin), section keunggulan, grid produk terbaru. SEO metadata, Open Graph, JSON-LD LocalBusiness.

Halaman Produk: grid dengan filter (kategori, harga, ketersediaan), sort, search.

Halaman Detail Produk: galeri foto, deskripsi, harga, unit tersedia real-time, tombol Sewa Sekarang.

Form Sewa (Modal): data penyewa auto-fill dari profil, tanggal/jam mulai, durasi dari pengaturan admin, total harga otomatis.

Halaman Checkout: invoice ID, detail lengkap, countdown timer pembayaran, metode pembayaran Midtrans, checkbox persetujuan kecocokan KTP wajib dicentang sebelum tombol Bayar aktif. Saat submit, sistem melakukan pengecekan lock stok (6.10) sebelum membuka Midtrans Snap.

Halaman Pembayaran Sukses: QR Code (dengan masa berlaku, 6.11), detail transaksi, download QR (PNG), tombol Maps lokasi pengambilan, status real-time dengan loading state jika callback belum diterima.

Halaman Keranjang: Zustand persisten, update quantity, hapus item, lanjut ke form sewa.

Halaman Riwayat Pesanan: tabel transaksi dengan status badge warna, detail + timeline progress, download ulang QR.

Halaman Profil: edit data, ganti password, **lihat riwayat login (device/IP/waktu) dan revoke active sessions** (pengganti MFA sebagai visibilitas keamanan akun).

7.2 KARYAWAN ROLE (OPERATOR)

Navigasi: Dashboard, Data Rental, Tambah Transaksi, Scan QR Penyewa, Logout.

Dashboard: statistik unit/transaksi real-time, tabel penghasilan harian, tabel unit hampir habis sewa (durasi tersisa <= 1 hari, early warning).

Data Rental: tabel transaksi aktif dengan tombol kondisional (Unit Berangkat hanya jika qr_scanned, Unit Kembali hanya jika berlangsung), Batalkan Rental (dengan refund otomatis jika Midtrans), Download/Kirim Invoice.

Scan QR Penyewa: tabel transaksi status dibayar → upload 1-3 foto KTP → konfirmasi kesesuaian → scan QR (ditolak jika sudah expired, 6.11) → status berubah ke qr_scanned.

Tambah Transaksi Manual: untuk walk-in, pilih produk, form data penyewa, metode Cash (langsung dibayar) atau Online (Midtrans Snap). Tetap wajib scan QR sebelum Unit Berangkat.

7.3 ADMIN ROLE (PEMILIK)

Navigasi: Dashboard, Data Rental, Produk, Tambah Transaksi, Users, Audit Log, Pengaturan, Logout.

Dashboard: statistik komprehensif, grafik penghasilan bulanan (Recharts), tabel transaksi terbaru, filter rentang tanggal.

Data Rental Admin: semua fitur karyawan + Edit (tercatat audit) + Hapus (soft delete) + bulk actions.

Produk CRUD: tabel produk, form tambah/edit, manajemen unit per produk (plat nomor, status).

Users Management: tabel user dengan filter role, edit role/status (dengan konfirmasi), suspend, semua perubahan tercatat audit. **Halaman ini menampilkan riwayat login tiap user (device/IP/waktu terakhir) sebagai pengganti visibilitas yang biasanya diberikan MFA.**

Audit Log: tabel dengan filter (user, aksi, entitas, rentang tanggal), detail JSON diff viewer, export CSV/Excel. Immutable. Review dilakukan manual berkala.

Pengaturan Payment Gateway: client/server key masked dengan toggle visibility, tombol Test Koneksi, tersimpan encrypted, tercatat audit.

Pengaturan Maintenance: toggle ON/OFF, datetime berakhir, pesan maintenance, auto-disable via cron.

Pengaturan Konten: hero/poster carousel, rich text perkenalan, pengaturan umum (durasi sewa, batas bayar, jumlah foto identitas, lokasi, kontak).

Pengaturan Lainnya: logo, favicon, tema warna, footer, sosial media, SEO default.

Refund: form alasan + jumlah otomatis, konfirmasi password admin, proses via Midtrans API, tercatat audit.

---

8. MAINTENANCE MODE

Middleware mendeteksi `maintenance_mode` dari database (cache untuk performa). Jika ON dan bukan admin/karyawan → redirect `/maintenance` dengan countdown real-time. API tetap berfungsi untuk admin/karyawan, 503 untuk user. Cron job auto-disable saat waktu berakhir.

---

9. MIDTRANS INTEGRATION

Create Transaction: client kirim invoice_id, server hitung ulang total dari database, panggil Midtrans Snap API, simpan snap_token + midtrans_order_id + payment_deadline_at. Sebelum ini, lock stok unit (6.10).

Snap Pop-up: `window.snap.pay(snap_token)` dengan callback onSuccess/onPending/onError/onClose.

Webhook Handler: `/api/v1/midtrans/notification`, validasi signature SHA512, verifikasi IP Midtrans, update status (settlement/capture → dibayar, expire/cancel/deny → dibatalkan + kembalikan stok, pending → menunggu_pembayaran), validasi gross_amount cocok, catat audit.

Cron Job (Supabase Edge Function): setiap 1 menit cek transaksi menunggu_pembayaran yang lewat deadline → dibatalkan, stok dikembalikan. Cek maintenance_mode berakhir → auto OFF.

---

10. SEO & PERFORMANCE

SEO: Next.js Metadata API, generateStaticParams untuk produk, Open Graph, Twitter Cards, JSON-LD (LocalBusiness, Product), next-sitemap, slug SEO-friendly, breadcrumb, canonical URL, Next.js Image dengan alt text.

Performance: Next.js Image lazy loading + blur placeholder, ISR (revalidate 3600s), dynamic import untuk heavy component (QR scanner, chart, rich text editor), bundle analysis, React Query caching, next/font. Target: LCP < 2.5s, FID < 100ms, CLS < 0.1, Lighthouse >= 90.

---

11. RESPONSIVE DESIGN

Mobile-first Tailwind breakpoints. Tabel: horizontal scroll atau card view di mobile. Modal full-screen mobile. Navigasi: hamburger/bottom sheet. Form full-width mobile. QR scanner responsif. Diuji di 375px, 768px, 1280px.

---

12. ERROR HANDLING & VALIDATION

Frontend: React Hook Form + Zod, validasi real-time, toast (sonner), skeleton loader, error boundary per route group, halaman 404/500 custom.

Backend: Zod validation semua API routes. HTTP status codes standar (400/401/403/404/429/500). Error response generik tanpa detail implementasi, stack trace tidak ke client. Error kritis dicatat audit.

**Monitoring disederhanakan:** tidak menggunakan layanan pihak ketiga (Sentry dsb) di versi ini. Error dicatat via Next.js server logs (dapat dilihat langsung di dashboard Netlify) dan tabel `audit_logs` untuk error kritis terkait transaksi/pembayaran/auth. Ini cukup untuk skala awal dan bisa upgrade ke layanan monitoring khusus kapan saja tanpa mengubah arsitektur inti.

---

13. TESTING STRATEGY (disederhanakan jadi manual checklist)

Karena automated test suite (unit/integration/E2E) membutuhkan waktu development signifikan, testing dilakukan secara **manual terstruktur** sebelum go-live, dengan checklist berikut:

- **Flow kritis end-to-end**: booking → pembayaran (sandbox Midtrans) → QR scan → unit berangkat → unit kembali, dites manual minimal 3x skenario (sukses, gagal bayar, dibatalkan).
- **Race condition stok**: buka 2 tab/device berbeda, coba booking unit yang sama secara bersamaan — pastikan hanya satu yang berhasil dan yang lain mendapat pesan error yang jelas.
- **Role bypass**: coba akses endpoint admin/karyawan menggunakan akun role lebih rendah (lewat Postman/curl langsung, bukan cuma dari UI) — pastikan 403 di semua kasus.
- **Payment tampering**: coba kirim payload create-transaction dengan harga yang dimanipulasi dari client — pastikan server tetap menghitung ulang dari database.
- **Webhook signature**: kirim payload webhook dengan signature salah — pastikan ditolak.
- **File upload**: coba upload file non-gambar dengan ekstensi disamarkan (misal `.jpg` yang isinya script) — pastikan ditolak oleh validasi magic bytes.
- **Auto-delete foto identitas**: pastikan `dijadwalkan_hapus_at` terisi benar saat status jadi selesai/dibatalkan, dan foto benar-benar terhapus dari Storage + database setelah 72 jam (tidak lebih cepat, tidak lebih lambat).
- **Arsip audit log**: pastikan notifikasi H-45 muncul di dashboard admin saat baris log mendekati usia 6 bulan, dan baris log benar-benar terhapus permanen tepat setelah 6 bulan.
- **Checklist OWASP Top 10 manual** (bukan automated scan): SQL injection (otomatis aman lewat parameterized query, verifikasi saja), XSS (coba input `<script>` di semua form text), CSRF (coba submit form dari origin lain), broken access control (poin role bypass di atas).

Semua temuan dicatat dan diperbaiki sebelum deployment ke production.

---

14. API ROUTES

Auth: POST register, POST login, POST logout, POST refresh, GET me, PUT change-password, POST forgot-password, POST reset-password, POST verify-email, GET sessions, DELETE sessions/[id].

Public: GET produk, GET produk/[slug], GET pengaturan, GET health.

User: GET/POST transaksi, GET transaksi/[id], PUT transaksi/[id]/status, POST transaksi/[id]/batalkan, GET transaksi/[id]/invoice, POST transaksi/[id]/kirim-invoice, GET transaksi/invoice/[invoiceId], POST midtrans/create-transaction.

Karyawan: GET dashboard/karyawan, GET dashboard/penghasilan-harian, GET rental/active, PUT rental/[id]/berangkat, PUT rental/[id]/kembali, POST rental/[id]/batalkan, POST scan-qr/verify, POST identitas/upload, PUT identitas/[id]/verifikasi, POST transaksi/manual.

Admin: GET dashboard/admin, GET dashboard/chart, GET rental/all, PUT/DELETE rental/[id], POST/PUT/DELETE produk/[id], GET/POST produk/[id]/unit, PUT/DELETE unit/[id], GET users, GET/PUT users/[id], POST users/[id]/suspend, GET audit, GET audit/[id], GET/PUT pengaturan/umum, GET/PUT pengaturan/payment, POST pengaturan/payment/test, PUT pengaturan/maintenance, PUT pengaturan/konten, POST refund, GET export/transaksi, GET export/produk, GET export/users.

Public Callback: POST midtrans/notification (no auth, signature verified).

---

15. DEVELOPMENT PHASES — STEP-BY-STEP (untuk AI Agent)

Setiap Fase adalah unit kerja mandiri dengan "Definition of Done" jelas. Setelah satu fase selesai dan diverifikasi, instruksikan agent: **"lanjut ke Fase berikutnya"**.

**Fase 0 — Setup & Foundation**
Inisialisasi Next.js 14 TypeScript, Tailwind, Shadcn UI. Konfigurasi Supabase client, environment variables, security headers dasar. Struktur folder lengkap.
Done when: project bisa di-run lokal, header keamanan dasar aktif.

**Fase 1 — Database & RLS**
Migration SQL semua tabel (termasuk `version` dan `qr_expires_at`), RLS policies, indexes, triggers, fungsi Postgres untuk lock stok unit (6.10).
Done when: semua tabel + RLS + fungsi lock stok bisa dites langsung di Supabase SQL editor.

**Fase 2 — Autentikasi Backend**
Supabase Auth JWT RS256, middleware auth, CSRF (SameSite Strict + Origin check, 6.3), rate limiting dasar (Upstash), API routes auth lengkap (tanpa endpoint MFA).
Done when: register/login/refresh/logout berfungsi, endpoint terproteksi menolak request tanpa token/role sesuai, notifikasi email login dari device baru terkirim.

**Fase 3 — Autentikasi Frontend**
Halaman login, register, forgot password, reset password. Halaman profil menampilkan riwayat login & revoke session.
Done when: user bisa daftar, login, reset password, lihat & revoke session dari UI.

**Fase 4 — Public Pages (Frontend)**
Halaman home (hero, perkenalan, produk), produk list & detail. SEO metadata, Open Graph, JSON-LD, ISR. **Ikuti Design System 18.4 (layout navbar horizontal, hero, product showcase grid) sebagai acuan visual.**
Done when: halaman publik tampil dengan data nyata, struktur SEO sudah benar, tata letak sesuai referensi 18.4.

**Fase 5 — Backend Transaksi & Stok**
API transaksi (create dengan lock stok 6.10, get, update status), state machine transisi status, idempotency key.
Done when: race condition test manual (dua request bersamaan booking unit sama) menghasilkan hanya satu yang sukses.

**Fase 6 — Midtrans Integration (Backend)**
Create transaction API, webhook handler dengan validasi signature, cron job pembatalan expired.
Done when: transaksi test end-to-end (sandbox Midtrans) berhasil update status dengan benar, webhook signature salah ditolak.

**Fase 7 — Transaksi Frontend (User)**
Form sewa modal, checkout, Midtrans Snap pop-up, halaman sukses dengan QR code (qr_expires_at ditampilkan), keranjang Zustand, riwayat transaksi. **Ikuti Design System 18.5 (sidebar customer setelah login, layout card checkout 2x2, kotak highlight countdown timer) sebagai acuan visual.**
Done when: user bisa booking → bayar (sandbox) → lihat QR dari UI tanpa error, tata letak checkout sesuai referensi 18.5.

**Fase 8 — Karyawan Module (Backend + Frontend)**
Dashboard karyawan, data rental dengan Unit Berangkat/Kembali, scan QR (cek expiry 6.11) + upload identitas, transaksi manual. **Ikuti Design System 18.6 (sidebar admin/karyawan, badge status 18.2) sebagai acuan visual.**
Done when: karyawan bisa memproses satu siklus rental penuh dari scan QR sampai unit kembali.

**Fase 9 — Admin Module (Backend + Frontend)**
Dashboard analitik, CRUD produk & unit, users management (dengan riwayat login), audit log viewer, pengaturan (payment, maintenance, konten). **Ikuti Design System 18.6.1-18.6.3 (stat card dashboard, tabel Data Rental dengan filter+badge, halaman Detail Rental dengan grid card + timeline aktivitas + panel QR) sebagai acuan visual persis.**
Done when: admin bisa mengelola seluruh konfigurasi sistem dan melihat audit log dari UI, tata letak dashboard/data rental/detail rental sesuai referensi 18.6.

**Fase 10 — Security Verification & Retensi Data**
Review ulang seluruh checklist bagian 6 (RLS, RBAC, CSRF, rate limit, encryption, payment security, security headers, DDoS) benar-benar aktif di kode. Implementasi cron job auto-delete foto identitas (6.15) dan cron job arsip audit log + notifikasi H-45 di dashboard admin (6.16).
Done when: setiap sub-bagian 6.1-6.16 sudah diverifikasi langsung di kode/database; simulasi manual (percepat waktu di environment testing) membuktikan foto identitas terhapus tepat 72 jam setelah status selesai, dan notifikasi H-45 muncul di dashboard admin sesuai jadwal.

**Fase 11 — Testing Manual**
Jalankan seluruh checklist manual di bagian 13 (flow kritis, race condition, role bypass, payment tampering, webhook signature, file upload, auto-delete foto identitas, arsip audit log, OWASP checklist).
Done when: semua item checklist lolos, temuan sudah diperbaiki.

**Fase 12 — Performance & SEO Final**
ISR optimization, image optimization, code splitting, bundle analysis, sitemap generation, Lighthouse tuning, responsive testing final.
Done when: Lighthouse >= 90 di semua kategori, responsive teruji di 375px/768px/1280px.

**Fase 13 — Deployment**
CI/CD sederhana (build check di GitHub Actions atau langsung Netlify auto-deploy dari Git), Supabase production setup, environment variables production, SSL (otomatis Netlify), **setup Cloudflare proxy di depan domain (6.13) — DNS-only, hosting tetap di Netlify**, verifikasi kompatibilitas Next.js App Router + middleware di runtime Netlify, smoke testing, dokumentasi setup & deployment untuk client.
Done when: aplikasi live di production di Netlify, Cloudflare proxy aktif (bisa dicek lewat DNS lookup/HTTP header), semua API routes & middleware (auth, CSRF, rate limit) berjalan normal, dan smoke test seluruh flow kritis lolos.

---

16. SUCCESS METRICS

Lighthouse >= 90 (semua kategori). FCP < 1.5 detik. TTI < 3 detik. Checklist manual security (bagian 13) lolos tanpa temuan kritis. Semua form validasi berfungsi. Responsive di 375px/768px/1280px. Midtrans end-to-end berfungsi. QR scanning berfungsi (termasuk penolakan QR expired). Race condition booking unit teruji tidak menghasilkan double-booking. Maintenance mode berfungsi. Rate limiting aktif. CSRF protection aktif di semua mutation endpoint. Audit log mencatat semua aktivitas kritis. Tidak ada bypass payment/role/autentikasi yang berhasil di testing manual.

---

17. DELIVERABLES

Website production-ready dengan semua fitur. Database schema dengan RLS + fungsi lock stok. API routes lengkap dengan validasi dan keamanan. Integrasi Midtrans dengan webhook handler. SEO optimization semua halaman publik. Performance optimization (Lighthouse >= 90). Maintenance mode berfungsi. Payment gateway bisa diatur admin. Audit log semua aktivitas. Cron job pembatalan transaksi expired. Hasil testing manual terdokumentasi. Responsive design. Error handling dan loading states. Dokumentasi setup dan deployment.

---

18. DESIGN SYSTEM & UI REFERENCE (BARU)

Bagian ini mendefinisikan arah desain konkret berdasarkan mockup referensi yang disetujui, supaya AI agent membangun tampilan yang konsisten tanpa menerka-nerka gaya visual di tiap fase.

**18.1 Brand Identity**
Nama produk: **RentMoto**. Logo: ikon abstrak berbentuk loop/infinity ganda di kiri nama, disandingkan teks "RentMoto" bold. Ditampilkan di kiri atas navbar (halaman publik/customer) maupun sidebar (halaman admin/karyawan).

**18.2 Color Palette**
- **Primary**: ungu-indigo (~Indigo/Violet 600, contoh `#6D5AE6` atau setara Tailwind `indigo-600`/`violet-600`) — dipakai untuk semua tombol aksi utama (Sewa, Login, Lanjut ke Pembayaran, Selesaikan Rental, Tambah Rental, nav item aktif), donut chart segmen utama, dan highlight sidebar item aktif.
- **Status badge colors** (dipakai konsisten di semua tabel/halaman status transaksi):
  - Berlangsung → ungu muda (background light purple, teks purple)
  - Menunggu / Menunggu Pembayaran → oranye/amber
  - Dibayar / Selesai → hijau
  - Dibatalkan → merah
  - QR Scanned → biru
  - Refund → abu-abu ungu muda
- **Neutral**: background utama putih/abu sangat muda (`gray-50`), teks utama abu gelap/hitam, border abu muda tipis di semua card.
- **Semantic**: hijau untuk indikator kenaikan (↑ 12.5%), merah untuk penurunan (↓ 2.1%) di stat card dashboard.

**18.3 Typography & Spacing**
Sans-serif modern (font seperti Inter/system-ui). Heading halaman: bold, ukuran besar (~24-28px). Card title: semibold ~16-18px. Body text: regular ~14px. Semua card memakai rounded corner sedang (~8-12px radius) dan padding konsisten, dengan shadow tipis (bukan hard border tebal).

**18.4 Layout Pattern — Halaman Publik (Customer, belum login)**
Navbar horizontal atas: logo kiri, menu tengah (Home, Produk, Keranjang, Riwayat Pesanan), tombol Login solid ungu kanan atas. Struktur halaman Home mengikuti urutan: (1) Hero section full-width dengan foto motor + overlay gelap + headline besar + subheadline + CTA button, (2) Section "Introduction" dua kolom (teks kiri, foto kanan), (3) Grid "Product Showcase" 3 kolom — tiap card: foto produk, nama, harga/hari, jumlah unit tersedia, tombol "Sewa" full-width di bagian bawah card.

**18.5 Layout Pattern — Halaman Customer (sudah login)**
Beralih ke **sidebar kiri** (bukan navbar horizontal lagi) berisi avatar+nama customer di atas, lalu menu vertikal (Home, Produk, Keranjang, Riwayat Pesanan — item aktif di-highlight background ungu muda), Logout di bawah. Konten utama pakai breadcrumb di atas judul halaman. Contoh konkret di halaman Checkout: grid kartu — Ringkasan Kendaraan (foto+nama+harga+plat), Informasi Penyewa (read-only, data auto-fill), Detail Sewa (info invoice/tanggal/lokasi), Ringkasan Pembayaran (rincian subtotal + kotak highlight hijau untuk countdown timer pembayaran), dan Metode Pembayaran (pilihan ikon: Transfer Bank, E-wallet, QRIS dalam kotak pilihan). Checkbox persetujuan kecocokan KTP di atas tombol aksi. Tombol bawah: "Batalkan Pesanan" (outline) + "Lanjut ke Pembayaran" (solid ungu) sejajar kanan.

**18.6 Layout Pattern — Halaman Admin/Karyawan**
Sidebar kiri gelap/terang dengan: profil admin (foto+nama+role) di atas, menu vertikal berikon (Dashboard, Data Rental, Produk, Unit, Transaksi, Pelanggan, Karyawan, Laporan, Audit Log, Pengaturan — beberapa collapsible/expandable), item aktif di-highlight solid ungu dengan teks putih, Logout di paling bawah, dan indikator status **Maintenance Mode** (dot hijau + teks "Sistem berjalan normal") menempel di bagian paling bawah sidebar sebagai info persisten.

Header konten utama: search bar global ("Cari sesuatu...") + ikon notifikasi (dengan badge angka) + avatar admin kanan atas.

**Dashboard** (18.6.1): baris atas berisi 6 stat card ringkas (Total Pendapatan, Transaksi Hari Ini, Unit Disewa, Unit Tersedia, User Terdaftar, Total Produk), masing-masing dengan ikon, angka besar, dan indikator persentase perubahan (hijau naik/merah turun) dibanding periode sebelumnya. Di bawahnya dua panel berdampingan: line chart "Grafik Pendapatan" (dengan dropdown filter periode) dan donut chart "Status Rental" (dengan legend persentase per status, warna sesuai 18.2). Baris bawah: tabel "Transaksi Terbaru" (kolom ringkas: Invoice, Penyewa, Unit, Mulai, Durasi, Total, Status) berdampingan dengan feed "Aktivitas Terbaru" (list kronologis dengan ikon per jenis aktivitas).

**Data Rental (list)** (18.6.2): search bar + filter dropdown (Status, Karyawan, rentang tanggal) sejajar tombol "+ Tambah Rental" solid ungu di kanan. Tabel dengan kolom Invoice (link ungu), Penyewa (nama+no HP), Unit, Mulai, Durasi, Total, Status (badge warna sesuai 18.2), Aksi (ikon kebab/titik tiga → dropdown menu). Pagination di bawah tabel dengan info "Menampilkan X-Y dari Z data".

**Detail Rental** (18.6.3): tombol "Kembali" + breadcrumb di atas. Header: invoice ID + status badge besar, ringkasan cepat (Total, Durasi, Mulai Sewa, Selesai) dalam bentuk ikon+label sejajar horizontal, tombol aksi kanan atas (Cetak Invoice outline, Edit Rental solid dengan dropdown). Grid dua kolom: kiri berisi card Informasi Penyewa (Nama, No HP, NIK, Alamat, Catatan — tiap field dengan ikon), Informasi Rental (Unit, Harga/Hari, Durasi, Total, Lokasi Pengambilan, Mulai/Selesai Sewa, Karyawan, Dibuat Oleh), dan Aktivitas Rental (timeline vertikal bertitik dengan garis penghubung, tiap entri: judul aksi, deskripsi, waktu, badge pelaku). Kanan: card QR Code Rental (QR besar + tombol Download QR), Informasi Pembayaran (Metode, Status badge, Order ID, Payment Time, Total Bayar, tombol "Lihat Detail Pembayaran" outline), Informasi Unit (foto+nama+plat+status+tahun+KM). Baris Aksi di bawah: Batalkan Rental (outline merah), Perpanjang Sewa (outline netral), Selesaikan Rental (solid ungu) — tombol muncul kondisional sesuai status rental (selaras dengan state machine 6.8).

**18.7 Prinsip Konsistensi Lintas Halaman**
Semua tabel data (Data Rental, Users, Produk, Audit Log) memakai pola yang sama: search+filter di atas, badge warna status konsisten, kebab menu untuk aksi baris, pagination di bawah. Semua halaman detail (Detail Rental, Detail Produk admin) memakai pola card-grid dengan info dikelompokkan per kategori, bukan satu form panjang. Semua konfirmasi aksi kritis (submit pembayaran, batalkan rental, refund) tetap menampilkan ringkasan sebelum tombol final ditekan, sejalan dengan kebutuhan UX yang sudah ada di flow existing.

---

LAMPIRAN: RINGKASAN PERUBAHAN DARI VERSI 4.0 (Revisi) KE VERSI 6.0 (Final)



**Dihapus:**
- MFA (TOTP) sepenuhnya — digantikan notifikasi email login device baru + kemampuan lihat/revoke session. Kolom `mfa_enabled` tetap disiapkan di database untuk upgrade mudah di masa depan.
- Sentry / error monitoring pihak ketiga — digantikan server logs bawaan Netlify + audit_logs untuk error kritis.
- Automated E2E test suite (Playwright) dan automated security scan (OWASP ZAP) — digantikan checklist testing manual terstruktur (bagian 13).
- Refresh token family ID + deteksi reuse kompleks — disederhanakan jadi rotasi biasa (token lama invalid tiap dipakai).
- Synchronizer Token Pattern dan Double Submit Cookie untuk CSRF — disederhanakan jadi satu pola: SameSite=Strict cookie + Origin/Referer check.
- Real-time alerting otomatis untuk audit log — digantikan review manual berkala oleh admin.
- Prosedur key rotation formal — digantikan rotasi manual saat dibutuhkan.

**Tidak berubah (fondasi inti, tidak dikurangi sama sekali):**
- RLS di semua tabel.
- RBAC server-side (role diverifikasi ulang dari database).
- Column-level encryption AES-256-GCM untuk NIK, no HP, payment server key.
- Payment security: server-side price recalculation, webhook signature validation, idempotency key, state machine status.
- Row lock anti race-condition untuk stok unit.
- QR Code expiry.
- File upload validation (magic bytes, private storage, signed URL).
- Security headers lengkap (CSP, HSTS, X-Frame-Options, dst).
- Audit logging immutable.
- Rate limiting via Upstash Redis.

**Ditambahkan kembali:**
- DDoS Protection (6.13) via Cloudflare proxy — sempat tidak sengaja terpotong saat penyederhanaan sebelumnya, sekarang dikembalikan karena effort setupnya rendah (gratis, tinggal ganti nameserver) sementara manfaatnya besar untuk menahan serangan volumetric sebelum sampai ke server aplikasi.

**Ditambahkan lagi (setelah diskusi biaya operasional):**
- Auto-delete foto identitas (6.15) — grace period 72 jam setelah status transaksi selesai/dibatalkan, mengurangi retensi PII sekaligus menghemat kuota storage Supabase Free Tier.
- Arsip & retensi audit log (6.16) — siklus 6 bulan dengan notifikasi H-45 di dashboard admin, auto-delete setelah 6 bulan.
- Platform hosting diubah dari Vercel ke **Netlify** — Vercel Hobby (gratis) secara eksplisit melarang penggunaan komersial di ToS-nya (termasuk kasus developer dibayar untuk membangun/hosting situs, terlepas dari trafiknya), sementara Netlify Free mengizinkan penggunaan komersial secara eksplisit dan mendukung penuh Next.js App Router/SSR/ISR.
- Database tetap Supabase Free Tier (tidak upgrade ke Pro $25/bulan) — dengan skema retensi data di atas, estimasi database baru mendekati batas 500MB setelah 10-12+ bulan penggunaan aktif terus-menerus; kalau nanti mendekati batas, solusi lanjutannya adalah mengarsipkan data transaksi lama (>1 tahun) dengan cara yang sama seperti audit log — export lalu hapus dari database aktif — bukan multi-akun/sharding manual lintas database, yang melanggar kebijakan penggunaan wajar Supabase dan menambah kompleksitas arsitektur signifikan (cross-database query tidak bisa satu langkah, foreign key tidak berlaku lintas project, auth terpecah, butuh sistem routing terpisah) tanpa manfaat yang sepadan dengan risikonya.

**Ditambahkan lagi (setelah mockup desain disetujui):**
- Bagian 18 (Design System & UI Reference) — brand identity "RentMoto", palet warna (primary ungu/indigo, badge status berwarna), layout pattern spesifik untuk halaman publik, halaman customer login, dan halaman admin/karyawan (sidebar, stat card dashboard, tabel data dengan filter, halaman detail dengan grid card + timeline aktivitas + panel QR). Fase 4, 7, 8, 9 diperbarui untuk mengacu ke bagian ini sebagai standar visual yang harus diikuti persis, bukan sekadar estimasi gaya bebas dari agent.

**Estimasi biaya bulanan final:** Netlify Free ($0) + Supabase Free ($0) + Cloudflare DNS proxy ($0) + Upstash Redis Free ($0) + domain .com (~Rp150.000-200.000/**tahun**, satu-satunya biaya nyata). Ini sesuai kesepakatan bahwa fee development sudah mencakup seluruh kebutuhan tanpa tanggungan bulanan ke client.

**Trade-off yang perlu disadari (tidak dihapus dari dokumen, disengaja tetap dicatat untuk transparansi ke client):**
- Tanpa MFA, keamanan akun admin/karyawan bergantung penuh pada kekuatan password. Kolom `mfa_enabled` tetap disiapkan di skema database untuk upgrade mudah di masa depan.
- Supabase Free Tier tidak memiliki backup otomatis/point-in-time recovery dan bisa auto-pause jika benar-benar tidak ada aktivitas 7 hari — risiko rendah untuk bisnis dengan transaksi harian, tapi perlu dipantau terutama di masa-masa sepi.
- Netlify Free membekukan situs jika limit bandwidth (100GB/bulan) atau build minutes (300 menit/bulan) terlampaui, sampai reset bulan berikutnya — perlu dipantau terutama jika trafik pengunjung tumbuh signifikan.
