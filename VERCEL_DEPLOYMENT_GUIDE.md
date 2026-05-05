# 🚀 Vercel Deployment Guide

## **Prerequisites**
- ✅ Vercel account (free at [vercel.com](https://vercel.com))
- ✅ GitHub account (recommended)
- ✅ Google API Key (already configured)

## **Step-by-Step Deployment**

### **Step 1: Push to GitHub**
```bash
# Initialize git if not already done
git init
git add .
git commit -m "Ready for Vercel deployment"

# Create GitHub repository
# 1. Go to github.com and create new repository
# 2. Add remote and push
git remote add origin https://github.com/yourusername/smart-study-planner.git
git branch -M main
git push -u origin main
```

### **Step 2: Deploy to Vercel**

#### **Option A: Through Vercel Dashboard (Recommended)**
1. **Go to [vercel.com](https://vercel.com) and sign in**
2. **Click "Add New..." → "Project"**
3. **Import your GitHub repository**
4. **Vercel will auto-detect the framework (React)**
5. **Configure settings:**
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `FrontEnd/dist`
   - **Install Command**: `npm install`

#### **Option B: Using Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel --prod
```

### **Step 3: Configure Environment Variables**

In Vercel Dashboard → Settings → Environment Variables:

```env
GOOGLE_API_KEY=AIzaSyBCNQuANVzNBW0mu1pAI_aSqQHyDAGxtg8
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
ADMIN_EMAIL=chennakeshavareddy05@gmail.com
NODE_ENV=production
```

### **Step 4: Update CORS Settings**

After deployment, update the CORS settings in `api/index.js`:

```javascript
app.use(cors({
  origin: ['https://your-domain.vercel.app'],
  credentials: true
}));
```

## **🔧 Post-Deployment Checklist**

### **Step 5: Test the Deployment**
1. **Visit your Vercel URL**
2. **Test user registration**
3. **Test admin login** (`gunav@example.com` / `Admin@123!`)
4. **Test AI generation features**
5. **Test sharing functionality**

### **Step 6: Update API URLs (if needed)**
The frontend should automatically work with relative URLs, but if you encounter issues:

Update `FrontEnd/src/main.jsx`:
```javascript
// Remove any hardcoded localhost URLs
// Use relative URLs like '/api/auth/login'
```

### **Step 7: Set Up Custom Domain (Optional)**
1. **Go to Vercel Dashboard → Domains**
2. **Add your custom domain**
3. **Update DNS records**
4. **Update CORS settings to include your domain**

## **📊 Expected Performance**

- **Cold Start**: ~2-3 seconds
- **API Response**: <2 seconds
- **Static Assets**: <500ms
- **Global CDN**: Automatic with Vercel

## **🛠️ Troubleshooting**

### **Common Issues & Solutions**

#### **1. API Routes Not Working**
```bash
# Check vercel.json configuration
# Ensure routes are properly configured
```

#### **2. Database Issues**
```bash
# SQLite works fine for serverless
# For production, consider PostgreSQL
```

#### **3. CORS Errors**
```bash
# Update CORS origins in api/index.js
# Add your Vercel domain to allowed origins
```

#### **4. Environment Variables Not Loading**
```bash
# Ensure variables are set in Vercel dashboard
# Redeploy after adding variables
```

## **📈 Scaling Considerations**

### **Free Tier Limits**
- **Bandwidth**: 100GB/month
- **Function Invocations**: 100k/month
- **Build Time**: 4500 minutes/month
- **Sufficient for 1000+ users**

### **When to Upgrade**
- **>10,000 monthly users**
- **>100GB bandwidth usage**
- **Need custom domains**

## **🎯 Quick Commands**

```bash
# Local testing before deployment
npm run build
npm run preview

# Deploy to Vercel
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs
```

## **🔗 Important URLs**

- **Your App**: `https://your-domain.vercel.app`
- **Admin Dashboard**: `https://your-domain.vercel.app` (login as admin)
- **Vercel Dashboard**: `https://vercel.com/dashboard`
- **Analytics**: `https://vercel.com/analytics`

## **✅ Success Indicators**

Your deployment is successful when:
- ✅ Frontend loads without errors
- ✅ User registration works
- ✅ Admin login works
- ✅ AI generation features work
- ✅ Sharing features work
- ✅ All API endpoints respond correctly

---

## **🚀 Ready to Deploy!**

Your Smart Study Planner is now configured for Vercel deployment. Follow the steps above and your app will be live in minutes!

**Need help?** Check Vercel's [deployment docs](https://vercel.com/docs) or contact support.
