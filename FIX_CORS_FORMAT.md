# Fix CORS_ORIGINS Format on Render

## The Problem
The backend is crashing with:
```
pydantic_settings.sources.SettingsError: error parsing value for field "CORS_ORIGINS" from source "EnvSettingsSource"
```

This means the CORS_ORIGINS format is incorrect on Render.

## The Solution

### Option 1: Use Simple String Format (RECOMMENDED)
On Render, set CORS_ORIGINS as a simple comma-separated string:

```
Key: CORS_ORIGINS
Value: http://localhost:3000,http://localhost:3001,https://findworkai.vercel.app,https://findworkai-frontend.vercel.app
```

**Note:** NO square brackets, NO quotes, just comma-separated URLs

### Option 2: Quick Fix - Enable DEBUG Mode
If you need it working immediately, temporarily set:

```
Key: DEBUG
Value: True
```

This allows all origins (not recommended for production, but good for testing).

## Step-by-Step Instructions

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Select your backend**: `findworkai-backend-1`
3. **Go to Environment tab**
4. **Find CORS_ORIGINS** and update it to:
   ```
   http://localhost:3000,http://localhost:3001,https://findworkai.vercel.app,https://findworkai-frontend.vercel.app
   ```
   (Copy this exactly - no brackets, no quotes)

5. **Save Changes**
6. **Wait for redeploy**

## Why This Happens

- Render environment variables are strings
- The backend tries to parse JSON from the string
- If it's already in JSON format with brackets, parsing fails
- Solution: Use comma-separated format that the backend can parse

## Verify It's Working

After deployment succeeds, the backend logs should show:
- "Application startup complete"
- No CORS parsing errors

Then test your frontend at https://findworkai.vercel.app
