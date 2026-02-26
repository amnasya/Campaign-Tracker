# 🔧 Fix Supabase Connection

## Masalah Saat Ini
Error: "Can't reach database server" - Tidak bisa connect ke Supabase

## Penyebab
Connection string mungkin tidak tepat atau project Supabase bermasalah

## ✅ Solusi Step-by-Step

### Langkah 1: Dapatkan Connection String yang Benar

1. **Buka Supabase Dashboard:**
   - Kunjungi: https://app.supabase.com
   - Login dengan akun Anda
   - Pilih project yang sudah dibuat

2. **Cek Status Project:**
   - Pastikan project status "Active" (hijau)
   - Jika "Paused", klik "Restore" untuk mengaktifkan kembali

3. **Dapatkan Connection String:**
   ```
   Klik: Settings (⚙️) > Database
   
   Scroll ke bawah ke bagian "Connection string"
   
   Ada 3 pilihan:
   - URI (pilih ini untuk DATABASE_URL)
   - Session pooler (untuk DIRECT_URL)
   - Transaction pooler
   ```

4. **Copy Connection String:**
   
   **Untuk DATABASE_URL (pilih "URI"):**
   ```
   Format: postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   
   Contoh:
   postgresql://postgres:Amnasya220906!@db.abcdefghijklmnop.supabase.co:5432/postgres
   ```
   
   **Untuk DIRECT_URL (sama dengan DATABASE_URL):**
   ```
   Gunakan connection string yang sama
   ```

5. **PENTING - Ganti Password:**
   - Di connection string, ada `[YOUR-PASSWORD]`
   - Ganti dengan password database Anda: `Amnasya220906!`
   - Pastikan tidak ada spasi atau karakter tambahan

### Langkah 2: Update Backend .env

Buka file `backend/.env` dan update:

```env
# Database - Supabase
DATABASE_URL="postgresql://postgres:Amnasya220906!@db.[PROJECT-REF].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:Amnasya220906!@db.[PROJECT-REF].supabase.co:5432/postgres"
```

**Ganti `[PROJECT-REF]` dengan project reference Anda!**

Contoh yang benar:
```env
DATABASE_URL="postgresql://postgres:Amnasya220906!@db.lqeekrsxkarqfhctufh.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:Amnasya220906!@db.lqeekrsxkarqfhctufh.supabase.co:5432/postgres"
```

### Langkah 3: Test Connection

```bash
cd backend
npx prisma db push
```

**Jika berhasil, Anda akan melihat:**
```
✔ Database synchronized with Prisma schema
✔ Generated Prisma Client
```

**Jika masih error:**
- Cek lagi connection string di Supabase dashboard
- Pastikan project status "Active"
- Pastikan password benar (case-sensitive!)
- Coba copy-paste langsung dari Supabase (jangan ketik manual)

### Langkah 4: Generate Prisma Client

```bash
npx prisma generate
```

### Langkah 5: Jalankan Aplikasi

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
```

Tunggu sampai muncul:
```
[Nest] Application is running on: http://localhost:4000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Tunggu sampai muncul:
```
✓ Ready in 2.5s
- Local: http://localhost:3000
```

**Buka Browser:**
```
http://localhost:3000
```

## 🆘 Jika Masih Bermasalah

### Opsi A: Reset Supabase Project

1. Di Supabase dashboard, klik Settings > General
2. Scroll ke bawah, klik "Pause project"
3. Tunggu beberapa detik
4. Klik "Restore project"
5. Tunggu project aktif kembali
6. Dapatkan connection string baru
7. Update backend/.env
8. Run `npx prisma db push`

### Opsi B: Buat Project Supabase Baru

1. Di Supabase dashboard, klik "New project"
2. Beri nama: "influencer-tracker"
3. Buat password database (catat baik-baik!)
4. Pilih region terdekat (Singapore/Tokyo)
5. Klik "Create new project"
6. Tunggu ~2 menit sampai selesai
7. Dapatkan connection string
8. Update backend/.env
9. Run `npx prisma db push`

### Opsi C: Gunakan PostgreSQL Lokal

Jika Supabase terus bermasalah, install PostgreSQL lokal:

1. **Download PostgreSQL:**
   - https://www.postgresql.org/download/windows/
   - Install dengan password: `postgres`

2. **Buat Database:**
   ```bash
   psql -U postgres
   # Masukkan password
   CREATE DATABASE influencer_tracker;
   \q
   ```

3. **Update backend/.env:**
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/influencer_tracker"
   DIRECT_URL="postgresql://postgres:postgres@localhost:5432/influencer_tracker"
   ```

4. **Run Migrations:**
   ```bash
   cd backend
   npx prisma migrate dev
   npx prisma generate
   npm run start:dev
   ```

## 📝 Checklist Troubleshooting

- [ ] Project Supabase status "Active"
- [ ] Connection string di-copy dari Supabase dashboard (bukan diketik manual)
- [ ] Password sudah diganti di connection string
- [ ] Tidak ada spasi atau karakter tambahan di connection string
- [ ] File backend/.env sudah di-save
- [ ] Sudah run `npx prisma db push`
- [ ] Sudah run `npx prisma generate`

## 💡 Tips

1. **Copy-Paste Connection String:**
   - Jangan ketik manual
   - Copy langsung dari Supabase dashboard
   - Paste ke backend/.env

2. **Cek Password:**
   - Password case-sensitive
   - Pastikan tidak ada spasi
   - Jika ada karakter khusus (!@#$%), pastikan di-encode dengan benar

3. **Cek Project Status:**
   - Project harus "Active" (hijau)
   - Jika "Paused", restore dulu

4. **Test Connection:**
   - Sebelum run aplikasi, test dulu dengan `npx prisma db push`
   - Jika berhasil, baru run aplikasi

## 🎯 Hasil yang Diharapkan

Setelah berhasil, Anda akan bisa:
1. ✅ Run `npx prisma db push` tanpa error
2. ✅ Backend start tanpa error database
3. ✅ Frontend bisa connect ke backend
4. ✅ Bisa register dan login
5. ✅ Semua fitur berfungsi normal

---

**Butuh bantuan lebih lanjut?**
Screenshot error yang muncul dan saya akan bantu troubleshoot!
