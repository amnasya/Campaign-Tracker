# Demo Mode Guide

## Overview
The application is now running in DEMO MODE, which allows you to explore all features without setting up a database or backend server.

## What's Working
✅ Frontend running on http://localhost:3000
✅ Mock authentication (auto-login as brand user)
✅ Sample campaigns with realistic data
✅ Campaign analytics and metrics
✅ Influencer assignments
✅ Payment tracking
✅ All UI components and navigation
✅ Responsive design (mobile & desktop)

## Demo Features
- **3 Sample Campaigns**: Summer Collection, Tech Review, Fitness Challenge
- **Mock Users**: Brand users and influencers
- **Realistic Data**: Analytics, payments, deliverables
- **Full Navigation**: Dashboard, campaigns, analytics pages

## How to Use

### Access the Application
1. Open your browser to: http://localhost:3000
2. You'll see a yellow banner at the top indicating "DEMO MODE"
3. You're automatically logged in as a brand user

### Explore Features
- **Dashboard**: View campaign overview and statistics
- **Campaigns**: Browse all campaigns, view details
- **Analytics**: See performance metrics and charts
- **Create Campaign**: Test the campaign creation flow (data won't persist)

## Switching to Real Backend

When you're ready to connect to a real database:

1. **Setup Database**:
   - Install PostgreSQL locally, OR
   - Use Supabase cloud database

2. **Configure Backend**:
   ```bash
   cd backend
   # Update .env with your database URL
   npm install
   npx prisma generate
   npx prisma migrate dev
   npm run start:dev
   ```

3. **Disable Demo Mode**:
   - Open `frontend/lib/api/demo-mode.ts`
   - Change `export const DEMO_MODE = true;` to `false`
   - Restart frontend: `npm run dev`

4. **Test Connection**:
   - Register a new account at http://localhost:3000/register
   - Login and create real campaigns

## Demo Limitations
- Data changes are not persisted (refresh resets everything)
- No real authentication (anyone can access)
- Backend API endpoints are not called
- File uploads are simulated
- No real payment processing

## Troubleshooting

### Frontend Not Loading?
```bash
cd frontend
npm install
npm run dev
```

### Want to See Backend Errors?
The backend has compilation errors from the SQLite conversion attempt. To fix:
1. Restore `backend/prisma/schema.prisma` to PostgreSQL version
2. Remove enum patch files
3. Setup PostgreSQL database
4. Run migrations

## Next Steps
1. ✅ Explore the demo application
2. ⏳ Setup PostgreSQL database (see INSTALL_POSTGRESQL_WINDOWS.md)
3. ⏳ Connect backend to database
4. ⏳ Disable demo mode
5. ⏳ Test with real data

---

**Current Status**: Demo mode is fully functional. You can explore all features without any database setup!
