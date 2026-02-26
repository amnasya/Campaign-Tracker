# Setup Supabase Database - Panduan Lengkap

## Step 1: Buat Akun Supabase (Gratis)

1. Buka https://supabase.com
2. Klik "Start your project"
3. Sign up dengan GitHub atau email
4. Verifikasi email Anda

## Step 2: Buat Project Baru

1. Setelah login, klik "New Project"
2. Isi form:
   - **Name**: `influencer-tracker` (atau nama lain)
   - **Database Password**: Buat password yang kuat (SIMPAN INI!)
   - **Region**: Pilih yang terdekat (Southeast Asia - Singapore)
   - **Pricing Plan**: Free (sudah cukup)
3. Klik "Create new project"
4. Tunggu 2-3 menit sampai project selesai dibuat

## Step 3: Dapatkan Connection String

1. Di dashboard Supabase, klik project Anda
2. Klik icon "Settings" (⚙️) di sidebar kiri bawah
3. Klik "Database" di menu settings
4. Scroll ke bawah ke bagian "Connection string"
5. Pilih tab "URI" (bukan Session mode)
6. Copy connection string yang formatnya seperti ini:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
7. **PENTING**: Ganti `[YOUR-PASSWORD]` dengan password yang Anda buat di Step 2

## Step 4: Format Connection String dengan Benar

Connection string harus dalam format ini:
```
postgresql://postgres:PASSWORD_ANDA@db.xxxxx.supabase.co:5432/postgres
```

**Contoh yang BENAR**:
```
postgresql://postgres:MySecurePass123!@db.abcdefgh.supabase.co:5432/postgres
```

**JANGAN seperti ini** (salah):
```
postgresql://postgres:[MySecurePass123!]@db.abcdefgh.supabase.co:5432/postgres
```

## Step 5: Update Backend .env

Setelah Anda dapat connection string yang benar, beritahu saya dan saya akan update file `.env` di backend.

## Troubleshooting

### Error: "getaddrinfo ENOTFOUND"
- Pastikan Anda online
- Pastikan hostname `db.xxxxx.supabase.co` benar
- Coba ping: `ping db.xxxxx.supabase.co`

### Error: "password authentication failed"
- Pastikan password tidak ada karakter `[` atau `]`
- Pastikan password di-encode jika ada karakter special
- Coba reset password di Supabase dashboard

### Error: "Connection timeout"
- Cek firewall/antivirus
- Pastikan port 5432 tidak diblok
- Coba dari network lain

## Karakter Special di Password

Jika password Anda punya karakter special seperti `!@#$%`, Anda perlu encode:
- `!` → `%21`
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `&` → `%26`

**Contoh**:
- Password: `MyPass@123!`
- Encoded: `MyPass%40123%21`
- Connection string: `postgresql://postgres:MyPass%40123%21@db.xxxxx.supabase.co:5432/postgres`

## Next Steps

Setelah connection string siap:
1. Saya akan update `backend/.env`
2. Restore schema Prisma ke PostgreSQL
3. Run migrations
4. Test connection
5. Start backend
6. Disable demo mode di frontend

---

**Status**: ⏳ Menunggu connection string dari Supabase

**Yang perlu Anda lakukan**:
1. ✅ Buat akun Supabase
2. ✅ Buat project baru
3. ✅ Simpan password database
4. ✅ Copy connection string
5. ✅ Ganti [YOUR-PASSWORD] dengan password asli
6. ✅ Kirim connection string ke saya
