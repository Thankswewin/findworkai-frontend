# FindWorkAI Frontend Setup Instructions

## Quick Setup for New Machines

If you're setting up FindWorkAI on a new machine and getting connection errors, follow these steps:

### 1. Create Environment File

Copy `.env.local.template` to `.env.local`:

```bash
cp .env.local.template .env.local
```

Or on Windows (PowerShell):
```powershell
Copy-Item .env.local.template .env.local
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Run the Application

```bash
npm run dev
# or
yarn dev
```

The app will now connect to the deployed backend at `https://findworkai-backend.onrender.com`

## Troubleshooting

### "Connection Refused" Error
- **Cause**: The app is trying to connect to `localhost:8000` instead of the deployed backend
- **Solution**: Make sure you have `.env.local` file with `NEXT_PUBLIC_API_URL=https://findworkai-backend.onrender.com`

### "Zero Results" in Search
- The backend now uses OpenStreetMap as a fallback when Google Maps API fails
- This is normal and ensures the app always works, even without a valid Google Maps API key

## Environment Variables Explained

- `NEXT_PUBLIC_API_URL`: Backend API URL (use the deployed Render URL)
- `NEXT_PUBLIC_GOOGLE_MAPS_KEY`: Google Maps API key (optional - app falls back to OpenStreetMap)
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL for authentication
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
- `NEXT_PUBLIC_OPENROUTER_API_KEY`: API key for AI features

## Deployed URLs

- **Frontend**: https://findworkai-frontend.vercel.app
- **Backend**: https://findworkai-backend.onrender.com
- **Health Check**: https://findworkai-backend.onrender.com/health
