# Supabase Setup Guide for FindWorkAI

## ✅ Current Setup Status

Your Supabase integration is now properly configured with the following:

### 1. Environment Variables (Already Set)
- ✅ `NEXT_PUBLIC_SUPABASE_URL`: https://iisbjsfjuuxenkkjvpli.supabase.co
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Configured in `.env.local`
- ✅ Backend also has matching Supabase credentials

### 2. Installed Dependencies
```json
"@supabase/ssr": "^0.1.0",
"@supabase/supabase-js": "^2.39.3"
```

### 3. Created Files
- `/src/lib/supabase/client.ts` - Browser client configuration
- `/src/lib/supabase/server.ts` - Server-side client configuration  
- `/src/lib/supabase/database.types.ts` - TypeScript type definitions
- `/src/hooks/use-supabase-auth.ts` - Authentication hook
- `/src/app/test-supabase/page.tsx` - Test page for authentication

## 🚀 Testing Your Setup

### Step 1: Test the Connection
1. Start your development server:
   ```bash
   npm run dev
   ```

2. Visit the test page:
   ```
   http://localhost:3000/test-supabase
   ```

3. You should see:
   - ✅ Supabase URL: Configured
   - ✅ Anon Key: Configured

### Step 2: Create a Test Account
1. On the test page, click "Don't have an account? Sign Up"
2. Enter a test email (e.g., `test@example.com`)
3. Enter a password (minimum 6 characters)
4. Click "Sign Up"

### Step 3: Configure Supabase Dashboard

#### Enable Email Authentication
1. Go to your [Supabase Dashboard](https://app.supabase.com/project/iisbjsfjuuxenkkjvpli/auth/providers)
2. Navigate to **Authentication** → **Providers**
3. Ensure **Email** provider is enabled
4. Configure email settings:
   - **Enable email confirmations**: Toggle based on your preference
   - **Enable email change confirmations**: Recommended ON
   - **Secure email change**: Recommended ON

#### Configure Auth Settings
1. Go to **Authentication** → **Settings**
2. Set the following:
   - **Site URL**: `http://localhost:3000` (for development)
   - **Redirect URLs**: 
     ```
     http://localhost:3000/auth/callback
     http://localhost:3000/auth/reset-password
     ```
   - **JWT Expiry**: 3600 (1 hour) or your preference

#### Email Templates (Optional)
1. Go to **Authentication** → **Email Templates**
2. Customize templates for:
   - Confirmation email
   - Password reset
   - Magic link
   - Email change

### Step 4: Database Setup

#### Create User Profiles Table
Run this SQL in your Supabase SQL Editor:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  company TEXT,
  role TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Create trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 🔄 Integration Options

You currently have a **hybrid setup**:
1. **Custom Backend API** at `http://localhost:8000/api/v1` for business logic
2. **Supabase** for authentication and database

### Option 1: Use Supabase for Auth Only (Recommended)
Keep your existing backend API for business logic, but use Supabase for authentication:

```typescript
// In your login page
import { useSupabaseAuth } from '@/hooks/use-supabase-auth'

function LoginPage() {
  const { signIn } = useSupabaseAuth()
  
  const handleLogin = async (email, password) => {
    // Authenticate with Supabase
    const { user, session } = await signIn(email, password)
    
    // Sync with your backend if needed
    if (session) {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/sync`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user })
      })
    }
  }
}
```

### Option 2: Full Supabase Migration
Gradually migrate all functionality to Supabase:
- Use Supabase Auth for authentication
- Use Supabase Database for data storage
- Use Supabase Storage for file uploads
- Use Supabase Realtime for live updates
- Use Edge Functions for serverless API

### Option 3: Keep Current Setup
Continue using your custom backend and treat Supabase as a backup or additional feature provider.

## 🔒 Security Best Practices

1. **Never expose service role key** - Only use in server-side code
2. **Enable Row Level Security (RLS)** on all tables
3. **Use environment variables** for all keys
4. **Implement rate limiting** in your backend
5. **Validate all user inputs** both client and server side

## 📊 Monitoring

### Check Authentication Logs
1. Go to your [Supabase Dashboard](https://app.supabase.com/project/iisbjsfjuuxenkkjvpli)
2. Navigate to **Authentication** → **Logs**
3. Monitor for:
   - Failed login attempts
   - Successful registrations
   - Password reset requests

### Database Monitoring
1. Go to **Database** → **Tables**
2. Check the `profiles` table for new users
3. Monitor the `auth.users` table (read-only)

## 🐛 Troubleshooting

### Common Issues and Solutions

#### 1. "Invalid API key" Error
- Check that your `.env.local` file has the correct keys
- Restart your Next.js dev server after changing env vars
- Verify keys match those in Supabase Dashboard

#### 2. Email Not Sending
- Check email provider settings in Supabase Dashboard
- For development, disable email confirmation requirement
- Use Supabase's built-in email service or configure SMTP

#### 3. CORS Errors
- Add your domain to allowed origins in Supabase
- Check that URLs in `.env.local` are correct
- Ensure no trailing slashes in URLs

#### 4. User Can't Sign In
- Check if email confirmation is required
- Verify password meets minimum requirements (6+ chars)
- Check authentication logs in Supabase Dashboard

## 📝 Next Steps

1. **Test the authentication flow** at `/test-supabase`
2. **Create your first user account**
3. **Check Supabase Dashboard** to confirm user creation
4. **Integrate auth into your main app** pages
5. **Set up production environment** variables when ready

## 🆘 Support

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [FindWorkAI GitHub](https://github.com/Thankswewin/findworkai-frontend)

---

**Your Supabase Project**: https://app.supabase.com/project/iisbjsfjuuxenkkjvpli
