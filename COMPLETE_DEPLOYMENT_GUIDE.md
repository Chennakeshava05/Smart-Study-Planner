# 🚀 Smart Study Planner - Complete Working Deployment Guide

## **Current Status**
Your app is ready for deployment. Let's deploy it successfully using GitHub integration with Vercel.

## **Step 1: Create GitHub Repository**
1. Go to [github.com](https://github.com) and sign in
2. Click **"New repository"**
3. Repository name: **"smart-study-planner"**
4. Description: **"AI-powered Smart Study Planner with admin dashboard"**
5. Make it **Public** (for easier Vercel integration)
6. Click **"Create repository"**

## **Step 2: Push Your Code to GitHub**
After creating the repository, run these commands in your terminal:

```bash
git remote add origin https://github.com/yourusername/smart-study-planner.git
git branch -M main
git push -u origin main
```

## **Step 3: Deploy to Vercel via GitHub**
1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Select your **"smart-study-planner"** repository
5. Vercel will auto-detect the framework (Vite)

## **Step 4: Configure Vercel Settings**
1. **Framework Preset**: Vite
2. **Build Command**: `cd FrontEnd && npm run build`
3. **Output Directory**: `FrontEnd/dist`
4. **Install Command**: `cd FrontEnd && npm install`
5. **Root Directory**: `.` (leave as is)

## **Step 5: Add Environment Variables**
In Vercel Dashboard → Settings → Environment Variables, add these:
```
GOOGLE_API_KEY=AIzaSyBCNQuANVzNBW0mu1pAI_aSqQHyDAGxtg8
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
ADMIN_EMAIL=chennakeshavareddy05@gmail.com
NODE_ENV=production
```

## **Step 6: Deploy Your App**
1. Click **"Deploy"**
2. Wait for deployment to complete
3. Your app will be live at the provided URL

## **Step 7: Test Your Live App**
Your app will be accessible at your Vercel URL. Test these features:

### **User Features:**
1. **User Registration** - Create a new account
2. **Schedule Generation** - Create AI-powered study schedules
3. **Quiz Generation** - Generate quizzes from topics
4. **History Tracking** - View previous schedules and quizzes
5. **Sharing Features** - QR codes and URL sharing

### **Admin Features:**
1. **Admin Login** - Use `chennakeshavareddy05@gmail.com` / `Admin@123!`
2. **Admin Dashboard** - View all users and activities
3. **User Management** - Promote/demote users, activate/deactivate accounts
4. **Statistics** - View app usage metrics

## **Backend API Setup**
Since the Vercel CLI was having issues, we have two options for the backend:

### **Option A: Use Railway/Render (Recommended)**
1. Go to [railway.app](https://railway.app) or [render.com](https://render.com)
2. Deploy the `BackEnd` folder as a Node.js service
3. Update the frontend API URL to point to your backend URL

### **Option B: Vercel Serverless Functions**
1. Configure the `/api` folder as serverless functions
2. Update the Vercel configuration to include API routes

## **Troubleshooting**

### **If frontend loads but API calls fail:**
1. Check environment variables in Vercel dashboard
2. Ensure backend API is deployed and accessible
3. Update API URLs in frontend if needed

### **If admin access doesn't work:**
1. Verify `ADMIN_EMAIL` environment variable is set correctly
2. Check that the admin user exists in database
3. Test login with correct credentials

### **If build fails:**
1. Check build logs in Vercel dashboard
2. Ensure `npm run build` works locally
3. Verify all dependencies are installed

## **Success Checklist**
✅ Frontend loads at your Vercel URL
✅ User registration works
✅ Admin login works with `chennakeshavareddy05@gmail.com`
✅ Schedule generation works
✅ Quiz generation works
✅ History tracking works
✅ Admin dashboard accessible
✅ Sharing features work
✅ Backend API is connected and functional

## **Next Steps After Deployment**
1. Share your app URL with others
2. Monitor usage through Vercel analytics
3. Set up custom domain (optional)
4. Consider upgrading to Vercel Pro for higher limits
5. Regularly update and maintain your app

---

**Your Smart Study Planner will be fully functional and live!**

## **Quick Commands Summary**
```bash
# GitHub setup
git remote add origin https://github.com/yourusername/smart-study-planner.git
git branch -M main
git push -u origin main

# Local testing
cd FrontEnd && npm run build
cd FrontEnd && npm run preview

# Vercel CLI (if needed)
vercel --prod
```

**Admin Credentials:**
- Email: `chennakeshavareddy05@gmail.com`
- Password: `Admin@123!`

**Your app will be live and ready for users!**
