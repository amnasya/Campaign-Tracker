# 🎮 Cara Memulai Demo

## Aplikasi Sudah Berjalan! 🎉

Aplikasi Influencer Campaign Tracker sudah berjalan dalam **MODE DEMO** di:

**http://localhost:3000**

## Apa itu Mode Demo?

Mode demo memungkinkan Anda mencoba semua fitur aplikasi tanpa perlu setup database atau backend. Semua data menggunakan data contoh (mock data).

## Fitur yang Bisa Dicoba

### ✅ Yang Berfungsi Penuh:
- Dashboard dengan statistik kampanye
- Melihat daftar kampanye (3 kampanye contoh)
- Melihat detail kampanye
- Melihat analytics dan metrics
- Melihat influencer yang di-assign
- Melihat status pembayaran
- Navigasi responsive (mobile & desktop)
- Semua animasi dan loading states

### ⚠️ Yang Hanya UI (Tidak Tersimpan):
- Membuat kampanye baru
- Edit kampanye
- Assign influencer
- Submit deliverable
- Verifikasi submission

## Data Contoh yang Tersedia

### Kampanye:
1. **Summer Fashion Campaign 2024** - Status: Active
2. **Product Launch - Eco Friendly Line** - Status: Active  
3. **Holiday Special Campaign** - Status: Draft

### User:
- Otomatis login sebagai: **Demo User** (Brand)
- Email: demo@example.com

### Influencer:
- Sarah Johnson
- Mike Chen
- Emma Davis
- Dan lainnya...

## Cara Menggunakan

1. **Buka Browser**: http://localhost:3000
2. **Lihat Banner Kuning**: Menandakan mode demo aktif
3. **Explore Dashboard**: Lihat overview kampanye
4. **Klik Kampanye**: Lihat detail dan analytics
5. **Coba Navigasi**: Semua menu berfungsi

## Catatan Penting

⚠️ **Data tidak tersimpan!** Setiap refresh browser akan reset semua perubahan.

🎭 **Ini hanya demo!** Untuk penggunaan real, perlu setup database.

## Jika Ingin Setup Database

Lihat dokumentasi berikut:
- `DEMO_MODE_GUIDE.md` - Panduan lengkap demo mode
- `INSTALL_POSTGRESQL_WINDOWS.md` - Cara install PostgreSQL
- `SETUP_DATABASE.md` - Setup database
- `DEMO_VS_PRODUCTION.md` - Perbandingan demo vs production

## Troubleshooting

### Frontend tidak jalan?
```bash
cd frontend
npm install
npm run dev
```

### Ingin matikan demo mode?
Edit file: `frontend/lib/api/demo-mode.ts`
```typescript
export const DEMO_MODE = false; // Ubah jadi false
```
⚠️ Tapi backend harus sudah jalan dulu!

## Status Saat Ini

✅ **Frontend**: Berjalan di http://localhost:3000
✅ **Demo Mode**: Aktif dan berfungsi
❌ **Backend**: Belum jalan (ada error kompilasi)
❌ **Database**: Belum dikonfigurasi

## Langkah Selanjutnya

1. ✅ **Sekarang**: Coba demo mode, explore semua fitur
2. ⏳ **Nanti**: Install PostgreSQL kalau mau pakai database real
3. ⏳ **Nanti**: Setup backend dan database
4. ⏳ **Nanti**: Matikan demo mode

---

**Selamat mencoba! 🚀**

Aplikasi sudah siap digunakan dalam mode demo. Silakan explore semua fitur tanpa khawatir merusak data karena semua data adalah contoh.
