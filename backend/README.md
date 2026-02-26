# Influencer Campaign Tracker - Backend

Backend API for the Influencer Campaign Tracker application built with NestJS, Prisma, and PostgreSQL.

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Set up the database:
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init
```

## Running the Application

### Development
```bash
npm run start:dev
```

### Production
```bash
npm run build
npm run start:prod
```

## Testing

```bash
# Unit tests
npm run test

# Test coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

## Project Structure

```
src/
├── common/           # Shared utilities, DTOs, filters
│   ├── dto/
│   ├── filters/
│   └── types/
├── decorators/       # Custom decorators (roles, current-user)
├── guards/           # Auth guards (JWT, roles)
├── modules/          # Feature modules
│   ├── auth/
│   ├── users/
│   ├── campaign/
│   ├── campaign-influencer/
│   ├── payment/
│   └── upload/
├── prisma/           # Prisma service
├── app.module.ts     # Root module
└── main.ts           # Application entry point
```

## Environment Variables

See `.env.example` for required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `JWT_EXPIRATION`: Token expiration time
- `CLOUDINARY_*`: Cloud storage credentials
- `CORS_ORIGINS`: Allowed CORS origins
- `PORT`: Server port (default: 3000)

## API Documentation

The API follows RESTful conventions with the following main endpoints:

- `/auth` - Authentication (register, login)
- `/campaigns` - Campaign management
- `/campaign-influencers` - Influencer assignments and workflow
- `/payments` - Payment management
- `/upload` - File uploads

## Database Schema

The application uses Prisma ORM with PostgreSQL. See `prisma/schema.prisma` for the complete data model.

## License

MIT
