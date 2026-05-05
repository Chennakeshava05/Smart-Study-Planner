# 🚀 Smart Study Planner - Deployment Instructions

## **Quick Deployment Guide**

### **Step 1: Go to Vercel Dashboard**
1. Visit [vercel.com](https://vercel.com)
2. Sign in with your account (you're already logged in)

### **Step 2: Create New Project**
1. Click **"Add New..."** → **"Project"**
2. Click **"Import Git Repository"**
3. If you haven't pushed to GitHub yet:
   - Go to [github.com](https://github.com)
   - Create a new repository called "smart-study-planner"
   - Push your code:
   ```bash
   git init
   git add .
   git commit -m "Ready for deployment"
   git remote add origin https://github.com/yourusername/smart-study-planner.git
   git push -u origin main
   ```

### **Step 3: Configure Vercel Settings**
1. **Framework Preset**: Vite
2. **Build Command**: `cd FrontEnd && npm run build`
3. **Output Directory**: `FrontEnd/dist`
4. **Install Command**: `cd FrontEnd && npm install`
5. **Root Directory**: `.` (leave as is)

### **Step 4: Add Environment Variables**
In Vercel Dashboard → Settings → Environment Variables:
```
GOOGLE_API_KEY=AIzaSyBCNQuANVzNBW0mu1pAI_aSqQHyDAGxtg8
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
ADMIN_EMAIL=chennakeshavareddy05@gmail.com
NODE_ENV=production
```

### **Step 5: Deploy**
1. Click **"Deploy"**
2. Wait for deployment to complete
3. Your app will be live at the provided URL

### **Step 6: Test Your Live App**
1. **Visit your Vercel URL**
2. **Test user registration** (create a new account)
3. **Test admin login**:
   - Email: `chennakeshavareddy05@gmail.com`
   - Password: `Admin@123!`
4. **Test all features**:
   - Schedule generation
   - Quiz generation
   - History tracking
   - Admin dashboard
   - Sharing features

## **Troubleshooting**

### **If deployment fails:**
1. Check the build logs in Vercel dashboard
2. Ensure all dependencies are installed
3. Verify the build command and output directory

### **If API calls fail:**
1. Ensure environment variables are set correctly
2. Check the serverless function logs
3. Verify the API routes are properly configured

### **If admin access doesn't work:**
1. Ensure ADMIN_EMAIL environment variable is set
2. Check the database initialization
3. Verify the authentication system

## **Success Indicators**

Your deployment is successful when:
- ✅ Frontend loads without errors
- ✅ User registration works
- ✅ Admin login works with `chennakeshavareddy05@gmail.com`
- ✅ AI generation features work
- ✅ Admin dashboard is accessible
- ✅ Sharing features work

## **Next Steps**

After successful deployment:
1. Share your app URL with others
2. Monitor usage through Vercel analytics
3. Set up custom domain (optional)
4. Consider upgrading to Vercel Pro for higher limits

---

**Your Smart Study Planner will be live and accessible to users worldwide!**
