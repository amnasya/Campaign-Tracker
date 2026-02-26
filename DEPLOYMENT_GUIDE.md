# 🚀 Deployment Guide - Viralyn

## ✅ Successfully Pushed to GitHub!

Repository: **https://github.com/amnasya/Campaign-Tracker**

## 📦 What's Included

### Project Structure
```
Campaign-Tracker/
├── frontend/          # Next.js application (React 19 + TypeScript)
├── backend/           # NestJS API (Node.js + TypeScript)
├── docs/             # Documentation files
├── README.md         # Comprehensive project documentation
├── .gitignore        # Git ignore rules
└── LICENSE           # MIT License
```

### Files Excluded (via .gitignore)
- ✅ `node_modules/` - Dependencies (not needed in repo)
- ✅ `.env` files - Sensitive credentials
- ✅ `dist/` and `build/` - Build artifacts
- ✅ `.next/` - Next.js build cache
- ✅ `.kiro/` - IDE configuration
- ✅ `.vscode/` - Editor settings
- ✅ `*.log` - Log files
- ✅ `.tsbuildinfo` - TypeScript build info

## 🎯 Next Steps

### 1. Clone Repository (For New Setup)
```bash
git clone https://github.com/amnasya/Campaign-Tracker.git
cd Campaign-Tracker
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run prisma:generate
npm run prisma:migrate
npm run start:dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local
npm run dev
```

## 🌐 Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend)
**Frontend (Vercel):**
1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

**Backend (Railway):**
1. Connect GitHub repository to Railway
2. Add PostgreSQL database
3. Set environment variables
4. Deploy

### Option 2: Heroku (Full Stack)
```bash
# Backend
heroku create viralyn-api
heroku addons:create heroku-postgresql:hobby-dev
git subtree push --prefix backend heroku main

# Frontend
heroku create viralyn-app
git subtree push --prefix frontend heroku main
```

### Option 3: DigitalOcean App Platform
1. Connect GitHub repository
2. Configure build settings
3. Add database
4. Deploy

### Option 4: AWS (EC2 + RDS)
- EC2 for application hosting
- RDS for PostgreSQL database
- S3 for file storage
- CloudFront for CDN

## 🔐 Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret-key"
JWT_EXPIRATION="7d"
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
CORS_ORIGINS="https://your-frontend-url.com"
PORT=4000
NODE_ENV="production"
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

## 📊 Database Migration

### Production Database Setup
```bash
# Run migrations
npm run prisma:migrate

# Generate Prisma client
npm run prisma:generate

# (Optional) Seed data
npm run prisma:seed
```

## 🔄 Continuous Deployment

### GitHub Actions (Recommended)
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to production
        run: |
          # Your deployment commands
```

## 📝 Post-Deployment Checklist

- [ ] Backend API is accessible
- [ ] Frontend loads correctly
- [ ] Database migrations completed
- [ ] Environment variables set
- [ ] CORS configured properly
- [ ] SSL/HTTPS enabled
- [ ] Domain configured
- [ ] Monitoring setup (optional)
- [ ] Backup strategy in place

## 🐛 Troubleshooting

### Common Issues

**1. CORS Error**
- Check `CORS_ORIGINS` in backend .env
- Ensure frontend URL is whitelisted

**2. Database Connection Failed**
- Verify `DATABASE_URL` format
- Check database is accessible
- Ensure IP whitelist includes server IP

**3. Build Fails**
- Check Node.js version (v18+)
- Clear cache: `rm -rf node_modules package-lock.json`
- Reinstall: `npm install`

**4. API Not Responding**
- Check backend is running
- Verify `NEXT_PUBLIC_API_URL` in frontend
- Check network/firewall settings

## 📞 Support

For issues or questions:
- GitHub Issues: https://github.com/amnasya/Campaign-Tracker/issues
- Email: support@viralyn.com

## 🎉 Success!

Your code is now on GitHub and ready for deployment! 

Repository: **https://github.com/amnasya/Campaign-Tracker**

---

Last Updated: February 26, 2026
