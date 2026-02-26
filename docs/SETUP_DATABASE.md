# Setup Database untuk Influencer Campaign Tracker

## Error yang Anda Alami

Error "ERR_CONNECTION_REFUSED" terjadi karena:
1. Backend tidak bisa connect ke database PostgreSQL
2. Backend dan frontend menggunakan port yang sama (sudah diperbaiki)

## Solusi: Install PostgreSQL

### Opsi 1: Install PostgreSQL di Windows (Recommended)

1. **Download PostgreSQL:**
   - Kunjungi: https://www.postgresql.org/download/windows/
   - Download installer untuk Windows
   - Jalankan installer

2. **Saat Install:**
   - Password untuk user `postgres`: gunakan `postgres` (atau catat password Anda)
   - Port: `5432` (default)
   - Centang semua komponen

3. **Setelah Install, Buat Database:**
   ```cmd
   # Buka Command Prompt atau PowerShell
   # Login ke PostgreSQL
   psql -U postgres
   
   # Masukkan password yang Anda buat saat install
   
   # Buat database
   CREATE DATABASE influencer_tracker;
   
   # Keluar
   \q
   ```

4. **Update Backend .env (jika password berbeda):**
   ```
   DATABASE_URL="postgresql://postgres:YOURPASSWORD@localhost:5432/influencer_tracker?schema=public"
   ```

5. **Run Migrations:**
   ```cmd
   cd backend
   npx prisma migrate dev
   npx prisma generate
   ```

### Opsi 2: Gunakan Docker (Jika sudah install Docker)

1. **Install Docker Desktop:**
   - Download dari: https://www.docker.com/products/docker-desktop/
   - Install dan restart komputer

2. **Jalankan PostgreSQL Container:**
   ```cmd
   docker run --name postgres-dev -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:15
   ```

3. **Buat Database:**
   ```cmd
   docker exec -it postgres-dev psql -U postgres -c "CREATE DATABASE influencer_tracker;"
   ```

4. **Run Migrations:**
   ```cmd
   cd backend
   npx prisma migrate dev
   npx prisma generate
   ```

### Opsi 3: Gunakan Supabase (Cloud Database - Gratis)

1. **Buat Akun Supabase:**
   - Kunjungi: https://supabase.com
   - Sign up gratis

2. **Buat Project Baru:**
   - Klik "New Project"
   - Beri nama project
   - Buat password database
   - Pilih region terdekat

3. **Copy Connection String:**
   - Di dashboard Supabase, klik "Settings" > "Database"
   - Copy "Connection string" (pilih yang "URI")
   - Ganti `[YOUR-PASSWORD]` dengan password database Anda

4. **Update Backend .env:**
   ```
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres"
   ```

5. **Run Migrations:**
   ```cmd
   cd backend
   npx prisma migrate dev
   npx prisma generate
   ```

## Setelah Database Setup

1. **Start Backend:**
   ```cmd
   cd backend
   npm run start:dev
   ```
   Backend akan running di http://localhost:4000

2. **Start Frontend (terminal baru):**
   ```cmd
   cd frontend
   npm run dev
   ```
   Frontend akan running di http://localhost:3000

3. **Buka Browser:**
   - Kunjungi http://localhost:3000
   - Register akun baru (Brand atau Influencer)
   - Mulai gunakan aplikasi!

## Troubleshooting

### Backend masih error "Can't reach database"
- Pastikan PostgreSQL service running
- Cek password di DATABASE_URL sesuai dengan password PostgreSQL Anda
- Cek port 5432 tidak digunakan aplikasi lain

### Frontend tidak bisa connect ke backend
- Pastikan backend sudah running di port 4000
- Cek file `frontend/.env.local` atau `frontend/.env`:
  ```
  NEXT_PUBLIC_API_URL=http://localhost:4000
  ```

### Port sudah digunakan
- Backend: Ubah PORT di `backend/.env`
- Frontend: Jalankan dengan `npm run dev -- -p 3001`

## Verifikasi Setup Berhasil

Jika setup berhasil, Anda akan melihat:

**Backend Terminal:**
```
[Nest] 12345  - 02/25/2026, 7:30:00 AM     LOG [NestApplication] Nest application successfully started
[Nest] 12345  - 02/25/2026, 7:30:00 AM     LOG [Main] Application is running on: http://localhost:4000
```

**Frontend Terminal:**
```
  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
  - Network:      http://192.168.x.x:3000

 ✓ Ready in 2.5s
```

**Browser:**
- Halaman login/register muncul tanpa error
- Bisa register dan login
- Dashboard muncul setelah login

## Bantuan Lebih Lanjut

Jika masih ada masalah, screenshot error yang muncul dan saya akan bantu troubleshoot!
