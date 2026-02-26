# 🐘 Install PostgreSQL di Windows - Panduan Lengkap

## 📥 Langkah 1: Download PostgreSQL

1. **Buka browser dan kunjungi:**
   ```
   https://www.postgresql.org/download/windows/
   ```

2. **Klik "Download the installer"**
   - Akan redirect ke halaman EnterpriseDB

3. **Pilih versi PostgreSQL 15 atau 16 (Latest)**
   - Klik tombol "Download" untuk Windows x86-64

4. **Tunggu download selesai** (~200-300 MB)

---

## 💿 Langkah 2: Install PostgreSQL

1. **Jalankan installer yang sudah di-download**
   - Double-click file `postgresql-15-windows-x64.exe` (atau versi yang Anda download)
   - Klik "Yes" jika ada UAC prompt

2. **Setup Wizard - Welcome Screen**
   - Klik "Next"

3. **Installation Directory**
   - Biarkan default: `C:\Program Files\PostgreSQL\15`
   - Klik "Next"

4. **Select Components**
   - ✅ PostgreSQL Server (wajib)
   - ✅ pgAdmin 4 (GUI tool - recommended)
   - ✅ Stack Builder (optional)
   - ✅ Command Line Tools (wajib)
   - Klik "Next"

5. **Data Directory**
   - Biarkan default: `C:\Program Files\PostgreSQL\15\data`
   - Klik "Next"

6. **Password** ⚠️ PENTING!
   ```
   Password: postgres
   Re-enter password: postgres
   ```
   - **CATAT PASSWORD INI!** Anda akan butuh nanti
   - Atau gunakan password lain yang mudah diingat
   - Klik "Next"

7. **Port**
   - Biarkan default: `5432`
   - Klik "Next"

8. **Advanced Options - Locale**
   - Pilih "Default locale"
   - Klik "Next"

9. **Pre Installation Summary**
   - Review semua settings
   - Klik "Next"

10. **Ready to Install**
    - Klik "Next"
    - Tunggu proses instalasi (~5-10 menit)

11. **Completing the PostgreSQL Setup Wizard**
    - ✅ Centang "Launch Stack Builder at exit" (optional)
    - Klik "Finish"

---

## ✅ Langkah 3: Verifikasi Instalasi

1. **Buka Command Prompt atau PowerShell**
   - Tekan `Win + R`
   - Ketik `cmd` atau `powershell`
   - Enter

2. **Test PostgreSQL sudah terinstall:**
   ```bash
   psql --version
   ```
   
   **Output yang diharapkan:**
   ```
   psql (PostgreSQL) 15.x
   ```

3. **Jika command not found:**
   - PostgreSQL belum masuk ke PATH
   - Restart Command Prompt/PowerShell
   - Atau restart komputer

---

## 🗄️ Langkah 4: Buat Database untuk Aplikasi

1. **Login ke PostgreSQL:**
   ```bash
   psql -U postgres
   ```
   
   - Masukkan password yang Anda buat saat install (contoh: `postgres`)
   - Tekan Enter

2. **Anda akan masuk ke PostgreSQL prompt:**
   ```
   postgres=#
   ```

3. **Buat database baru:**
   ```sql
   CREATE DATABASE influencer_tracker;
   ```
   
   **Output:**
   ```
   CREATE DATABASE
   ```

4. **Verifikasi database sudah dibuat:**
   ```sql
   \l
   ```
   
   - Anda akan melihat list database
   - Cari `influencer_tracker` di list

5. **Keluar dari PostgreSQL:**
   ```sql
   \q
   ```

---

## ⚙️ Langkah 5: Konfigurasi Backend

1. **Buka file `backend/.env`**

2. **Update connection string:**
   ```env
   # Database - PostgreSQL Lokal
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/influencer_tracker"
   DIRECT_URL="postgresql://postgres:postgres@localhost:5432/influencer_tracker"
   ```
   
   **Penjelasan:**
   - `postgres:postgres` = username:password
   - `localhost:5432` = host:port
   - `influencer_tracker` = nama database
   
   **Jika password Anda berbeda, ganti `postgres` kedua dengan password Anda!**

3. **Save file `.env`**

---

## 🚀 Langkah 6: Setup Database Schema

1. **Buka terminal/command prompt**

2. **Masuk ke folder backend:**
   ```bash
   cd backend
   ```

3. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```
   
   **Output yang diharapkan:**
   ```
   ✔ Generated Prisma Client
   ```

4. **Push schema ke database:**
   ```bash
   npx prisma migrate dev --name init
   ```
   
   **Atau jika ada masalah, gunakan:**
   ```bash
   npx prisma db push
   ```
   
   **Output yang diharapkan:**
   ```
   ✔ Database synchronized with Prisma schema
   ```

5. **Verifikasi tables sudah dibuat:**
   ```bash
   psql -U postgres -d influencer_tracker -c "\dt"
   ```
   
   **Anda akan melihat tables:**
   - User
   - Campaign
   - CampaignInfluencer
   - Payment
   - _prisma_migrations

---

## 🎯 Langkah 7: Jalankan Aplikasi

### Terminal 1 - Backend

```bash
cd backend
npm run start:dev
```

**Tunggu sampai muncul:**
```
[Nest] Application is running on: http://localhost:4000
```

### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

**Tunggu sampai muncul:**
```
✓ Ready in 2.5s
- Local: http://localhost:3000
```

### Buka Browser

```
http://localhost:3000
```

**Anda akan melihat halaman login/register!** 🎉

---

## 🔧 Troubleshooting

### Problem 1: "psql: command not found"

**Solusi:**
1. Restart Command Prompt/PowerShell
2. Atau restart komputer
3. Atau tambahkan PostgreSQL ke PATH manual:
   ```
   C:\Program Files\PostgreSQL\15\bin
   ```

### Problem 2: "password authentication failed"

**Solusi:**
1. Pastikan password di `.env` sama dengan password saat install
2. Coba reset password PostgreSQL:
   ```bash
   # Login sebagai postgres
   psql -U postgres
   
   # Ganti password
   ALTER USER postgres PASSWORD 'postgres';
   
   # Keluar
   \q
   ```

### Problem 3: "database does not exist"

**Solusi:**
```bash
# Login ke PostgreSQL
psql -U postgres

# Buat database
CREATE DATABASE influencer_tracker;

# Keluar
\q
```

### Problem 4: "port 5432 already in use"

**Solusi:**
1. PostgreSQL sudah running (ini bagus!)
2. Atau ada aplikasi lain menggunakan port 5432
3. Cek dengan:
   ```bash
   netstat -an | findstr :5432
   ```

### Problem 5: Backend error "Can't reach database"

**Solusi:**
1. Pastikan PostgreSQL service running:
   ```bash
   # Cek status
   Get-Service postgresql*
   
   # Start service jika stopped
   Start-Service postgresql-x64-15
   ```

2. Test koneksi manual:
   ```bash
   psql -U postgres -d influencer_tracker
   ```

---

## 📊 Langkah 8: Verifikasi Semua Berfungsi

### Test 1: Database Connection
```bash
cd backend
npx prisma studio
```
- Akan buka browser dengan Prisma Studio
- Anda bisa lihat dan edit data di database

### Test 2: Backend API
```bash
# Test health check
curl http://localhost:4000

# Atau buka di browser
http://localhost:4000
```

### Test 3: Frontend
```bash
# Buka di browser
http://localhost:3000

# Coba register user baru
# Coba login
```

---

## 🎓 Tips & Best Practices

### 1. Backup Database
```bash
# Backup
pg_dump -U postgres influencer_tracker > backup.sql

# Restore
psql -U postgres influencer_tracker < backup.sql
```

### 2. Reset Database (Jika perlu)
```bash
# Drop database
psql -U postgres -c "DROP DATABASE influencer_tracker;"

# Buat ulang
psql -U postgres -c "CREATE DATABASE influencer_tracker;"

# Push schema lagi
cd backend
npx prisma db push
```

### 3. Lihat Data di Database
```bash
# Cara 1: Prisma Studio (GUI)
npx prisma studio

# Cara 2: psql (CLI)
psql -U postgres -d influencer_tracker
SELECT * FROM "User";
\q
```

### 4. Stop PostgreSQL Service
```bash
# Jika ingin stop PostgreSQL
Stop-Service postgresql-x64-15

# Start lagi
Start-Service postgresql-x64-15
```

---

## ✅ Checklist Instalasi Berhasil

- [ ] PostgreSQL terinstall
- [ ] `psql --version` menampilkan versi
- [ ] Database `influencer_tracker` sudah dibuat
- [ ] File `backend/.env` sudah diupdate
- [ ] `npx prisma generate` berhasil
- [ ] `npx prisma db push` berhasil
- [ ] Backend running di http://localhost:4000
- [ ] Frontend running di http://localhost:3000
- [ ] Bisa register user baru
- [ ] Bisa login
- [ ] Dashboard muncul setelah login

---

## 🎉 Selamat!

Jika semua checklist di atas ✅, aplikasi Anda sudah running sempurna!

**Next Steps:**
1. Explore fitur-fitur aplikasi
2. Buat campaign sebagai Brand
3. Assign influencer
4. Test workflow lengkap

**Butuh bantuan?**
- Screenshot error yang muncul
- Saya akan bantu troubleshoot!

---

## 📚 Resources

- PostgreSQL Documentation: https://www.postgresql.org/docs/
- Prisma Documentation: https://www.prisma.io/docs/
- pgAdmin 4 (GUI Tool): Sudah terinstall bersama PostgreSQL

**Happy Coding! 🚀**
