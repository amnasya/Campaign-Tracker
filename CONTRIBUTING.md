# Contributing to Viralyn

Thank you for your interest in contributing to Viralyn! This document provides guidelines and instructions for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone <your-fork-url>`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes
6. Commit with clear messages
7. Push to your fork
8. Create a Pull Request

## Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL or Supabase account
- Git

### Installation
```bash
# Install dependencies
cd frontend && npm install
cd ../backend && npm install

# Setup environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# Run migrations
cd backend
npx prisma migrate dev

# Start development servers
npm run start:dev  # Backend
cd ../frontend && npm run dev  # Frontend
```

## Code Style

### TypeScript
- Use TypeScript for all new code
- Follow existing code patterns
- Use meaningful variable names
- Add JSDoc comments for functions

### React Components
- Use functional components with hooks
- Keep components small and focused
- Use TypeScript interfaces for props
- Follow the existing component structure

### Backend
- Follow NestJS best practices
- Use DTOs for validation
- Keep controllers thin
- Business logic in services

## Testing

### Frontend
```bash
cd frontend
npm test
```

### Backend
```bash
cd backend
npm test
```

## Commit Messages

Follow conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test changes
- `chore:` Build/config changes

Example: `feat: add campaign analytics dashboard`

## Pull Request Process

1. Update documentation if needed
2. Add tests for new features
3. Ensure all tests pass
4. Update CHANGELOG.md
5. Request review from maintainers

## Code Review

- Be respectful and constructive
- Focus on the code, not the person
- Explain your suggestions
- Be open to feedback

## Questions?

- Check existing issues
- Read the documentation in `/docs`
- Ask in discussions

Thank you for contributing! 🎉
