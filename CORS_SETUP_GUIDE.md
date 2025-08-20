# CORS Setup Guide for Render Backend

## Steps to Add CORS_ORIGINS Environment Variable on Render:

1. **Go to Render Dashboard**
   - Navigate to https://dashboard.render.com
   - Select your backend service: `findworkai-backend-1`

2. **Navigate to Environment Variables**
   - Click on your backend service
   - Go to the "Environment" tab in the left sidebar
   - You'll see a section for "Environment Variables"

3. **Add CORS_ORIGINS Variable**
   - Click "Add Environment Variable" button
   - Add the following:
     ```
     Key: CORS_ORIGINS
     Value: ["http://localhost:3000","http://localhost:3001","https://findworkai.vercel.app","https://findworkai-frontend.vercel.app"]
     ```

4. **Alternative: Enable DEBUG Mode (Temporary)**
   - If CORS issues persist, temporarily add:
     ```
     Key: DEBUG
     Value: True
     ```
   - This allows all origins during testing (remove for production)

5. **Save and Deploy**
   - Click "Save Changes"
   - Your backend will automatically redeploy with the new settings

## What This Does:
- `CORS_ORIGINS`: Specifies which frontend URLs can access your backend
- `DEBUG=True`: Temporarily allows all origins (use only for testing)

## Your Current Setup:
- Frontend URL: https://findworkai.vercel.app
- Backend URL: https://findworkai-backend-1.onrender.com
- Backend API Base: https://findworkai-backend-1.onrender.com/api/v1

## Verify It's Working:
After deployment, test by visiting your frontend and checking if API calls succeed without CORS errors.
