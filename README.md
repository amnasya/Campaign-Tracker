# 🚀 Viralyn - Influencer Campaign Management Platform

A modern, enterprise-grade SaaS platform for managing influencer marketing campaigns. Built for brands and marketing teams to streamline campaign operations, track performance, and manage creator relationships.

![Tech Stack](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

## ✨ Features

### For Brands
- 📊 **Real-time Dashboard** - Performance and financial visibility
- 🎯 **Campaign Management** - Create, track, and manage campaigns
- 👥 **Creator Database** - Manage influencer relationships
- 💰 **Payment Tracking** - Automated payment workflows
- 📈 **Analytics & Insights** - ROI tracking and performance metrics
- 🔔 **Smart Notifications** - Stay updated on campaign progress

### For Influencers
- 💼 **Campaign Overview** - View and accept campaign invitations
- 📤 **Deliverable Submission** - Easy content submission workflow
- 💵 **Earnings Dashboard** - Track payments and withdrawable balance
- 📅 **Deadline Management** - Never miss a submission deadline
- 📊 **Performance Metrics** - View your engagement and reach stats

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Charts**: Recharts
- **HTTP Client**: Axios

### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **Runtime**: Node.js
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Authentication**: JWT + Passport.js
- **Validation**: class-validator

### Infrastructure
- **Database Hosting**: Supabase
- **File Storage**: Cloudinary
- **Version Control**: Git

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL (or Supabase account)
- Git

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/amnasya/Campaign-Tracker.git
cd Campaign-Tracker
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your database credentials and secrets

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# (Optional) Seed database with sample data
npm run prisma:seed

# Start development server
npm run start:dev
```

Backend will run on `http://localhost:4000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
# Edit .env.local with your API URL

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3000`

## 🔧 Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database"

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRATION="7d"

# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# CORS
CORS_ORIGINS="http://localhost:3000"

# Server
PORT=4000
NODE_ENV="development"
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## 📁 Project Structure

```
Campaign-Tracker/
├── frontend/                 # Next.js frontend application
│   ├── app/                 # App router pages
│   │   ├── brand/          # Brand user pages
│   │   ├── influencer/     # Influencer user pages
│   │   ├── login/          # Authentication pages
│   │   └── register/
│   ├── components/          # React components
│   │   ├── brand/          # Brand-specific components
│   │   ├── influencer/     # Influencer-specific components
│   │   ├── shared/         # Shared components
│   │   └── ui/             # UI components (Shadcn)
│   ├── lib/                # Utilities and API clients
│   └── types/              # TypeScript type definitions
│
├── backend/                 # NestJS backend application
│   ├── src/
│   │   ├── modules/        # Feature modules
│   │   │   ├── auth/       # Authentication
│   │   │   ├── campaign/   # Campaign management
│   │   │   ├── payment/    # Payment processing
│   │   │   └── upload/     # File uploads
│   │   ├── common/         # Shared utilities
│   │   └── prisma/         # Prisma service
│   └── prisma/             # Database schema and migrations
│
└── docs/                    # Documentation
```

## 🎯 Key Features Implementation

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (Brand/Influencer)
- Protected routes and API endpoints

### Campaign Workflow
1. Brand creates campaign
2. Brand assigns influencers
3. Influencer accepts/rejects invitation
4. Influencer submits deliverables
5. Brand verifies submission
6. Payment is processed

### Dashboard Analytics
- Real-time KPI metrics
- Performance charts and trends
- Budget allocation visualization
- Smart insights and recommendations

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm run test              # Run unit tests
npm run test:e2e         # Run e2e tests
npm run test:cov         # Generate coverage report
```

### Frontend Tests
```bash
cd frontend
npm run test             # Run tests
npm run test:watch       # Run tests in watch mode
```

## 📦 Deployment

### Backend Deployment
1. Build the application: `npm run build`
2. Set production environment variables
3. Run migrations: `npm run prisma:migrate`
4. Start production server: `npm run start:prod`

### Frontend Deployment
1. Build the application: `npm run build`
2. Set production environment variables
3. Deploy to Vercel/Netlify or run: `npm run start`

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Amnasya** - [GitHub](https://github.com/amnasya)

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by leading SaaS platforms like Stripe, Linear, and Notion
- UI components from Shadcn/ui
- Icons from Lucide React

## 📞 Support

For support, email support@viralyn.com or open an issue in this repository.

## 🗺️ Roadmap

- [ ] Email notifications
- [ ] Advanced analytics and reporting
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Integration with social media platforms
- [ ] AI-powered creator recommendations
- [ ] Automated contract generation

---

Made with ❤️ by Amnasya
