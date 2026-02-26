# Influencer Campaign Tracker - Frontend

A modern, professional SaaS application built with Next.js 14+ for managing influencer marketing campaigns.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Icons**: Lucide React
- **Charts**: Recharts
- **HTTP Client**: Axios

## Design System

The application follows a modern SaaS aesthetic inspired by Linear, Stripe Dashboard, and Notion:

- Clean, minimal color palette
- Professional blue/purple accent colors
- Subtle shadows and borders
- Smooth transitions and micro-interactions
- Responsive design for all screen sizes

## Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages (login, register)
│   ├── (brand)/           # Brand user dashboard and pages
│   ├── (influencer)/      # Influencer user dashboard and pages
│   ├── globals.css        # Global styles and design tokens
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Shadcn/ui base components
│   ├── brand/            # Brand-specific components
│   ├── influencer/       # Influencer-specific components
│   └── shared/           # Shared components
├── lib/                  # Utility functions and services
│   ├── api/             # API service layer
│   ├── auth/            # Authentication utilities
│   └── utils.ts         # General utilities
├── types/               # TypeScript type definitions
└── public/              # Static assets

```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Development

The application uses:

- **App Router**: File-based routing with layouts and nested routes
- **Server Components**: Default for better performance
- **Client Components**: Used for interactive UI elements
- **TypeScript**: Full type safety across the application
- **Tailwind CSS**: Utility-first styling with custom design tokens

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Design Tokens

The design system uses CSS custom properties for theming:

- `--primary`: Main brand color (blue/purple)
- `--secondary`: Secondary actions
- `--muted`: Less prominent elements
- `--destructive`: Error/danger states
- `--border`: Border colors
- `--radius`: Border radius values

## Contributing

Follow the implementation plan in `.kiro/specs/influencer-campaign-tracker/tasks.md` for feature development.
