# 🚀 Deployment Guide - Vercel

This guide will help you deploy your Breast Cancer Detection app to Vercel.

## 📋 Prerequisites

1. **GitHub Account**: To connect your repository
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Node.js & npm**: For local development and building

## 🎯 Quick Deployment Steps

### Method 1: GitHub Integration (Recommended)

1. **Push to GitHub**
   ```bash
   cd breast-cancer-detector
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/breast-cancer-detector.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Configure project settings:
     - **Framework Preset**: Other
     - **Root Directory**: Leave empty (default)
     - **Build Command**: `cd frontend && npm run build`
     - **Output Directory**: `frontend/build`
     - **Install Command**: `cd frontend && npm install`

3. **Environment Variables**
   Add these environment variables in Vercel Dashboard:
   ```
   REACT_APP_API_URL = https://your-app-name.vercel.app/api
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your app will be available at `https://your-app-name.vercel.app`

### Method 2: Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from project root**
   ```bash
   cd breast-cancer-detector
   vercel --prod
   ```

## ⚙️ Configuration Files

The project includes these configuration files for deployment:

### `vercel.json`
```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/app.py",
      "use": "@vercel/python"
    },
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ]
}
```

## 🔧 Environment Configuration

### Frontend Environment Variables

Create `.env.production` in frontend directory:
```bash
REACT_APP_API_URL=https://your-app-name.vercel.app/api
```

### Backend Environment Variables

In Vercel Dashboard, set:
- `PYTHONPATH`: `./backend`
- Any other environment variables your backend needs

## 📁 Project Structure for Deployment

```
breast-cancer-detector/
├── backend/
│   ├── app.py                 # Flask API
│   ├── requirements.txt       # Python dependencies
│   └── [model files]         # Generated ML models
├── frontend/
│   ├── build/                 # Production build (generated)
│   ├── src/
│   │   ├── App.tsx
│   │   └── App.css
│   ├── package.json
│   └── .env                   # Environment variables
├── vercel.json                # Vercel configuration
└── README.md
```

## 🐛 Troubleshooting

### Common Issues:

1. **Build Fails**
   - Check that all dependencies are listed in `package.json`
   - Ensure `npm run build` works locally
   - Check build logs in Vercel dashboard

2. **API Not Working**
   - Verify `REACT_APP_API_URL` environment variable
   - Check API routes are correctly configured
   - Ensure backend dependencies are in `requirements.txt`

3. **CORS Issues**
   - Make sure Flask-CORS is properly configured
   - Check that origin URLs match your deployment URL

4. **Python Version Issues**
   - Vercel uses Python 3.9 by default
   - Add `runtime.txt` with `python-3.9.16` if needed

### Debug Steps:

1. **Check Deployment Logs**
   - Go to Vercel Dashboard → Your Project → Deployments
   - Click on failed deployment to see logs

2. **Test Locally First**
   ```bash
   # Test backend
   cd backend && python app.py
   
   # Test frontend
   cd frontend && npm start
   ```

3. **Check Environment Variables**
   - Ensure all required environment variables are set in Vercel
   - Verify variable names match exactly

## 🎉 Post-Deployment

After successful deployment:

1. **Test Your App**
   - Visit your Vercel URL
   - Test prediction functionality
   - Check mobile responsiveness

2. **Custom Domain** (Optional)
   - Go to Project Settings → Domains
   - Add your custom domain

3. **Analytics** (Optional)
   - Enable Vercel Analytics in project settings

## 🔄 Continuous Deployment

With GitHub integration:
- Every push to main branch triggers automatic deployment
- Pull requests get preview deployments
- Check deployment status in GitHub and Vercel

## 📊 Performance Tips

1. **Optimize Bundle Size**
   ```bash
   npm run build
   npm install -g serve
   serve -s build
   ```

2. **Enable Compression**
   - Vercel automatically enables gzip compression
   - No additional configuration needed

3. **Monitor Performance**
   - Use Vercel Analytics
   - Monitor API response times

## 🔐 Security Considerations

1. **Environment Variables**
   - Never commit `.env` files to Git
   - Use Vercel environment variables for sensitive data

2. **API Security**
   - Implement rate limiting if needed
   - Add input validation
   - Consider authentication for production use

## 📞 Support

If you encounter issues:
1. Check [Vercel Documentation](https://vercel.com/docs)
2. Review deployment logs in Vercel dashboard
3. Check this project's GitHub issues

---

Happy Deploying! 🚀
