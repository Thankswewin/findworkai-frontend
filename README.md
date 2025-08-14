# SmartLeads AI - AI-Powered Lead Generation Platform 🚀

[![Next.js](https://img.shields.io/badge/Next.js-14.0.4-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.3.6-06B6D4)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A modern, production-ready lead generation platform built with Next.js 14, TypeScript, and AI integration. Discover real businesses, analyze opportunities, and generate leads with AI-powered insights.

## ✨ Features

- 🔍 **Smart Lead Discovery** - AI-powered business search and discovery
- 📊 **Lead Scoring** - Intelligent lead qualification and prioritization
- 🤖 **AI Agents** - Autonomous website and solution builders
- 📧 **Email Outreach** - Automated personalized email campaigns
- 📈 **Analytics Dashboard** - Real-time performance metrics and insights
- 🔒 **Enterprise Security** - NextAuth, rate limiting, CSRF protection
- ⚡ **High Performance** - Server components, code splitting, optimized bundle
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **State Management:** Zustand + React Query
- **Authentication:** NextAuth.js
- **Charts:** Recharts
- **Forms:** React Hook Form + Zod

### Performance & Security
- Server-side rendering (SSR)
- Code splitting & lazy loading
- API rate limiting
- CSRF protection
- Secure httpOnly cookies
- Environment validation

### Testing
- Unit Tests: Jest + React Testing Library
- E2E Tests: Playwright
- Code Coverage: 60%+ threshold

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/smartleads-ai.git
cd smartleads-ai
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Edit `.env.local` with your API keys:
```env
NEXT_PUBLIC_GOOGLE_MAPS_KEY=your_google_maps_key
OPENAI_API_KEY=your_openai_key
NEXTAUTH_SECRET=your_generated_secret
DATABASE_URL=your_database_url
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📝 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run unit tests
npm run test:e2e     # Run E2E tests
npm run type-check   # TypeScript type checking
npm run format       # Format code with Prettier
npm run build:analyze # Analyze bundle size
```

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   │   ├── ui/          # Base UI components
│   │   ├── layouts/     # Layout components
│   │   └── ...          # Feature components
│   ├── lib/             # Utility functions
│   ├── hooks/           # Custom React hooks
│   ├── types/           # TypeScript type definitions
│   └── services/        # API services
├── public/              # Static assets
├── e2e/                 # E2E test files
├── .env.example         # Environment variables template
├── next.config.js       # Next.js configuration
├── tailwind.config.ts   # Tailwind CSS configuration
├── jest.config.js       # Jest configuration
└── playwright.config.ts # Playwright configuration
```

## 🧪 Testing

### Unit Tests
```bash
npm run test              # Run tests in watch mode
npm run test:ci           # Run tests once (CI mode)
npm run test -- --coverage # Generate coverage report
```

### E2E Tests
```bash
npm run test:e2e          # Run Playwright tests
npx playwright test --ui  # Run with UI mode
```

## 📊 Performance

The application is optimized for performance with:

- **Lighthouse Score:** 95+ Performance
- **First Contentful Paint:** < 1.8s
- **Largest Contentful Paint:** < 2.5s
- **Time to Interactive:** < 3.5s
- **Bundle Size:** Optimized with code splitting

## 🔒 Security

- ✅ Secure authentication with NextAuth.js
- ✅ Rate limiting on all API routes
- ✅ CSRF protection
- ✅ XSS prevention
- ✅ SQL injection protection
- ✅ Environment variable validation
- ✅ Secure headers (CSP, HSTS, etc.)

## 📦 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Docker
```bash
docker build -t smartleads-ai .
docker run -p 3000:3000 smartleads-ai
```

### Traditional Hosting
```bash
npm run build
npm run start
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment
- All open-source contributors

## 📞 Support

For support, email support@smartleads.ai or open an issue on GitHub.

---

Built with ❤️ by the SmartLeads AI Team
