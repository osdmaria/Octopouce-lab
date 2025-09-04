# OctoLab Deployment Guide

This guide explains how to deploy the OctoLab application with the frontend on Vercel and the backend on Render.

## Prerequisites

- GitHub account
- Vercel account (connected to GitHub)
- Render account (connected to GitHub)
- Git repository with your OctoLab code

## Backend Deployment (Render)

### 1. Prepare Your Repository

Ensure your backend code is in the `backend/` directory with:
- `package.json` with proper scripts
- `render.yaml` configuration file
- `.env.example` file

### 2. Deploy to Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `octolab-backend`
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### 3. Set Environment Variables

In the Render dashboard, add these environment variables:

```
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-frontend-app.vercel.app
JWT_SECRET=your-super-secure-jwt-secret-key
DB_PATH=./database/octolab.db
```

**Important**: Replace `your-frontend-app.vercel.app` with your actual Vercel domain after frontend deployment.

### 4. Deploy

Click "Create Web Service" and wait for deployment to complete.
Your backend will be available at: `https://your-backend-app.onrender.com`

## Frontend Deployment (Vercel)

### 1. Prepare Your Repository

Ensure your frontend code is in the `frontend/` directory with:
- `package.json` with build scripts
- `vercel.json` configuration file
- `.env.example` file

### 2. Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)

### 3. Set Environment Variables

In the Vercel dashboard, go to Settings → Environment Variables and add:

```
VITE_API_URL=https://your-backend-app.onrender.com
```

**Important**: Replace `your-backend-app.onrender.com` with your actual Render backend URL.

### 4. Deploy

Click "Deploy" and wait for deployment to complete.
Your frontend will be available at: `https://your-frontend-app.vercel.app`

## Post-Deployment Configuration

### 1. Update CORS Settings

After both deployments are complete:

1. Go to your Render backend dashboard
2. Update the `FRONTEND_URL` environment variable with your actual Vercel URL
3. Redeploy the backend service

### 2. Test the Application

1. Visit your Vercel frontend URL
2. Test the login functionality
3. Verify API calls are working correctly
4. Check browser console for any CORS errors

## Environment Variables Summary

### Backend (Render)
```
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-frontend-app.vercel.app
JWT_SECRET=your-super-secure-jwt-secret-key
DB_PATH=./database/octolab.db
```

### Frontend (Vercel)
```
VITE_API_URL=https://your-backend-app.onrender.com
```

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure `FRONTEND_URL` in backend matches your Vercel domain exactly
   - Check that both HTTP and HTTPS protocols match

2. **API Calls Failing**
   - Verify `VITE_API_URL` in frontend points to correct Render backend URL
   - Check Render backend logs for errors

3. **Build Failures**
   - Ensure all dependencies are listed in `package.json`
   - Check build logs in respective dashboards

4. **Database Issues**
   - SQLite database will be recreated on each Render deployment
   - Consider using a persistent database service for production

5. **SQLite3 Binary Compatibility Error**
   - Error: `invalid ELF header` when using sqlite3
   - Solution: The `render.yaml` includes `npm rebuild sqlite3` in build command
   - This rebuilds SQLite3 binaries for the Linux environment on Render

### Checking Logs

- **Render**: Go to your service dashboard → "Logs" tab
- **Vercel**: Go to your project dashboard → "Functions" tab → Click on any function

## Security Considerations

1. **JWT Secret**: Use a strong, unique secret for production
2. **Environment Variables**: Never commit `.env` files to version control
3. **CORS**: Keep CORS configuration restrictive to your frontend domain only
4. **Database**: Consider using a managed database service for production data persistence

## Automatic Deployments

Both Vercel and Render support automatic deployments:
- **Vercel**: Automatically deploys on every push to main branch
- **Render**: Automatically deploys on every push to main branch

To disable automatic deployments, check the respective platform settings.

## Custom Domains

Both platforms support custom domains:
- **Vercel**: Go to Project Settings → Domains
- **Render**: Go to Service Settings → Custom Domains

Remember to update environment variables when changing domains!