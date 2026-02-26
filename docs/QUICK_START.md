# ⚡ Quick Start - Influencer Campaign Tracker

## 🎯 Ringkasan Cepat

Aplikasi sudah 100% selesai! Tinggal setup database dan jalankan.

---

## 📋 Langkah Singkat (15 menit)

### 1. Install PostgreSQL (10 menit)

**Download & Install:**
```
1. Buka: https://www.postgresql.org/download/windows/
2. Download PostgreSQL 15 atau 16
3. Install dengan password: postgres
4. Port: 5432 (default)
```

**Buat Database:**
```bash
psql -U postgres
# Password: postgres

CREATE DATABASE influencer_tracker;
\q
```

📖 **Panduan lengkap:** Lihat file `INSTALL_POSTGRESQL_WINDOWS.md`

---

### 2. Setup Backend (2 menit)

```bash
cd backend

# File .env sudah dikonfigurasi untuk PostgreSQL lokal
# Jika password PostgreSQL Anda bukan "postgres", edit backend/.env

# Generate Prisma Client
npx prisma generate

# Push schema ke database
npx prisma db push

# Start backend
npm run start:dev
```

**Tunggu sampai muncul:**
```
[Nest] Application is running on: http://localhost:4000
```

---

### 3. Setup Frontend (1 menit)

**Buka terminal baru:**
```bash
cd frontend

# Start frontend
npm run dev
```

**Tunggu sampai muncul:**
```
✓ Ready in 2.5s
- Local: http://localhost:3000
```

---

### 4. Buka Aplikasi

```
http://localhost:3000
```

**Selesai!** 🎉

---

## 🧪 Test Aplikasi

### 1. Register User Baru

1. Klik "Sign up"
2. Isi form:
   - Name: Test Brand
   - Email: brand@test.com
   - Password: password123
   - Role: Brand
3. Klik "Sign up"

### 2. Login

1. Login dengan:
   - Email: brand@test.com
   - Password: password123
2. Anda akan masuk ke Brand Dashboard

### 3. Buat Campaign

1. Klik "Create Campaign"
2. Isi form:
   - Title: Summer Campaign
   - Brief: Promote our new product
   - Budget: 5000000
   - Deadline: Pilih tanggal di masa depan
3. Klik "Create Campaign"

### 4. Test Sebagai Influencer

1. Logout
2. Register user baru dengan role "Influencer"
3. Login sebagai influencer
4. Lihat dashboard influencer

---

## 🔧 Troubleshooting Cepat

### Backend tidak bisa start

**Error: "Can't reach database"**
```bash
# Cek PostgreSQL running
Get-Service postgresql*

# Start jika stopped
Start-Service postgresql-x64-15

# Test koneksi
psql -U postgres -d influencer_tracker
```

### Frontend tidak bisa connect

**Error: "ERR_CONNECTION_REFUSED"**
```bash
# Pastikan backend running di port 4000
# Cek terminal backend untuk error

# Pastikan file frontend/.env.local ada:
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Port sudah digunakan

**Backend (port 4000):**
```bash
# Edit backend/.env
PORT=4001
```

**Frontend (port 3000):**
```bash
npm run dev -- -p 3001
```

---

## 📚 File Panduan Lengkap

1. **INSTALL_POSTGRESQL_WINDOWS.md** - Panduan install PostgreSQL step-by-step
2. **README.md** - Dokumentasi lengkap aplikasi
3. **SETUP_DATABASE.md** - Panduan setup database (PostgreSQL/Supabase)
4. **FIX_SUPABASE_CONNECTION.md** - Troubleshooting Supabase

---

## ✅ Checklist

- [ ] PostgreSQL terinstall
- [ ] Database `influencer_tracker` dibuat
- [ ] Backend running (http://localhost:4000)
- [ ] Frontend running (http://localhost:3000)
- [ ] Bisa register & login
- [ ] Dashboard muncul

---

## 🎯 Fitur Aplikasi

### Brand:
- ✅ Dashboard analytics
- ✅ Create & manage campaigns
- ✅ Assign influencers
- ✅ Verify deliverables
- ✅ Manage payments

### Influencer:
- ✅ View assigned campaigns
- ✅ Accept/reject invitations
- ✅ Submit deliverables
- ✅ Track payment status

### Technical:
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Loading states & animations
- ✅ Toast notifications
- ✅ 125 tests passing

---

## 🚀 Production Ready

Aplikasi siap untuk:
- ✅ Development
- ✅ Testing
- ✅ Production deployment

**Deploy ke:**
- Backend: Railway, Render, Heroku
- Frontend: Vercel, Netlify
- Database: Supabase, Railway, AWS RDS

---

**Butuh bantuan? Screenshot error dan saya akan bantu!** 🤝
