# 🚀 GitHub Setup for Vercel Deployment

## **Step 1: Create GitHub Repository**
1. Go to [github.com](https://github.com)
2. Click **"New repository"**
3. Repository name: **"smart-study-planner"**
4. Description: **"AI-powered Smart Study Planner with admin dashboard"**
5. Make it **Public** (for easier Vercel integration)
6. Click **"Create repository"**

## **Step 2: Push to GitHub**
After creating the repository, run these commands:

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

## **Step 5: Add Environment Variables**
In Vercel Dashboard → Settings → Environment Variables:
```
GOOGLE_API_KEY=AIzaSyBCNQuANVzNBW0mu1pAI_aSqQHyDAGxtg8
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
ADMIN_EMAIL=chennakeshavareddy05@gmail.com
NODE_ENV=production
```

## **Step 6: Deploy**
1. Click **"Deploy"**
2. Wait for deployment to complete
3. Your app will be live at the provided URL

## **Step 7: Test Your Live App**
1. **Visit your Vercel URL**
2. **Test user registration**
3. **Test admin login**:
   - Email: `chennakeshavareddy05@gmail.com`
   - Password: `Admin@123!`
4. **Test all features**:
   - Schedule generation
   - Quiz generation
   - History tracking
   - Admin dashboard
   - Sharing features

## **Success Indicators**
✅ Frontend loads without errors
✅ User registration works
✅ Admin login works
✅ AI generation features work
✅ Admin dashboard accessible
✅ Sharing features work

---

**Your Smart Study Planner will be live and accessible worldwide!**
