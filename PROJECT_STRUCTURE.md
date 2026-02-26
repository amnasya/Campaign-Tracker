# Viralyn - Project Structure

## 📁 Root Directory

```
viralyn/
├── .gitignore                 # Git ignore rules
├── .kiro/                     # Kiro IDE configuration
├── .vscode/                   # VS Code settings
├── backend/                   # NestJS backend application
├── docs/                      # All documentation
├── frontend/                  # Next.js frontend application
├── CHANGELOG.md               # Version history
├── CONTRIBUTING.md            # Contribution guidelines
├── LICENSE                    # MIT License
├── PROJECT_STRUCTURE.md       # This file
└── README.md                  # Main documentation
```

## 🎨 Frontend Structure

```
frontend/
├── app/                       # Next.js App Router
│   ├── brand/                # Brand dashboard pages
│   │   ├── campaigns/        # Campaign management
│   │   ├── dashboard/        # Brand dashboard
│   │   ├── influencers/      # Influencer list
│   │   └── payments/         # Payment tracking
│   ├── influencer/           # Influencer dashboard pages
│   ├── login/                # Login page
│   ├── register/             # Registration page
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Landing page
│   └── globals.css           # Global styles
├── components/               # React components
│   ├── brand/               # Brand-specific components
│   ├── influencer/          # Influencer-specific components
│   ├── shared/              # Shared components
│   └── ui/                  # UI components (Shadcn)
├── lib/                     # Utilities and helpers
│   ├── api/                 # API client functions
│   ├── auth/                # Authentication utilities
│   └── utils.ts             # Helper functions
├── types/                   # TypeScript type definitions
├── public/                  # Static assets
├── .env.local               # Environment variables
├── next.config.ts           # Next.js configuration
├── package.json             # Dependencies
├── tailwind.config.ts       # Tailwind configuration
└── tsconfig.json            # TypeScript configuration
```

## 🔧 Backend Structure

```
backend/
├── src/
│   ├── modules/             # Feature modules
│   │   ├── auth/           # Authentication
│   │   ├── campaign/       # Campaign management
│   │   ├── campaign-influencer/  # Campaign assignments
│   │   ├── payment/        # Payment tracking
│   │   └── upload/         # File uploads
│   ├── common/             # Shared utilities
│   ├── prisma/             # Prisma service
│   └── main.ts             # Application entry point
├── prisma/                 # Database
│   ├── schema.prisma       # Database schema
│   └── migrations/         # Migration files
├── test/                   # E2E tests
├── .env                    # Environment variables
├── nest-cli.json           # NestJS CLI config
├── package.json            # Dependencies
└── tsconfig.json           # TypeScript configuration
```

## 📚 Documentation Structure

```
docs/
├── README.md                           # Documentation index
├── QUICK_REFERENCE.md                  # Quick commands
├── SUPABASE_SUCCESS.md                 # Main setup guide
├── SETUP_DATABASE.md                   # Database setup
├── SETUP_SUPABASE.md                   # Supabase guide
├── INSTALL_POSTGRESQL_WINDOWS.md       # PostgreSQL installation
├── DEMO_MODE_GUIDE.md                  # Demo mode (English)
├── MULAI_DEMO.md                       # Demo mode (Indonesian)
├── DEMO_VS_PRODUCTION.md               # Feature comparison
├── DEMO_IMPLEMENTATION_SUMMARY.md      # Technical details
└── FIX_SUPABASE_CONNECTION.md          # Troubleshooting
```

## 🗄️ Database Schema

```
Database (PostgreSQL)
├── User                    # Users (brands & influencers)
├── Campaign                # Marketing campaigns
├── CampaignInfluencer      # Campaign assignments
└── Payment                 # Payment records
```

## 🔑 Key Files

### Configuration
- `frontend/.env.local` - Frontend environment variables
- `backend/.env` - Backend environment variables
- `backend/prisma/schema.prisma` - Database schema

### Entry Points
- `frontend/app/page.tsx` - Landing page
- `frontend/app/layout.tsx` - Root layout
- `backend/src/main.ts` - Backend entry point

### Documentation
- `README.md` - Main project documentation
- `docs/README.md` - Documentation index
- `CONTRIBUTING.md` - Contribution guidelines
- `CHANGELOG.md` - Version history

## 🚀 Development Workflow

1. **Start Backend**: `cd backend && npm run start:dev`
2. **Start Frontend**: `cd frontend && npm run dev`
3. **Run Tests**: `npm test` (in respective directories)
4. **Database Migrations**: `cd backend && npx prisma migrate dev`

## 📦 Dependencies

### Frontend
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Shadcn/ui
- Recharts

### Backend
- NestJS
- Prisma
- PostgreSQL
- JWT
- class-validator

## 🔒 Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Backend (.env)
```env
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret
JWT_EXPIRATION=7d
PORT=4000
```

## 📝 Notes

- All documentation is in `/docs`
- Tests are co-located with source files
- UI components follow Shadcn/ui patterns
- Backend follows NestJS module structure
- Database uses Prisma ORM

---

**Last Updated**: February 26, 2026
