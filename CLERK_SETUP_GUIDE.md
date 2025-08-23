# 🔐 Clerk Authentication Setup Guide

## The Issue
You're getting the error `Cannot read property 'create' of undefined` because Clerk is not properly initialized. This happens when the Clerk publishable key is not set correctly.

## 🚀 Quick Fix Steps

### Step 1: Get Your Clerk Keys

1. **Go to [Clerk.com](https://clerk.com)**
2. **Create an account** (if you don't have one)
3. **Create a new application**
4. **Go to API Keys** in your dashboard
5. **Copy your Publishable Key** (starts with `pk_test_`)

### Step 2: Update Your Configuration

1. **Open `utils/authConfig.js`**
2. **Find this line:**
   ```javascript
   PUBLISHABLE_KEY: 'pk_test_Y2hhcm1lZC1tb29zZS01Ni5jbGVyay5hY2NvdW50cy5kZXYk', // ← REPLACE THIS
   ```
3. **Replace it with your actual key:**
   ```javascript
   PUBLISHABLE_KEY: 'pk_test_YOUR_ACTUAL_KEY_HERE',
   ```

### Step 3: Configure Clerk Settings

1. **In your Clerk dashboard, go to User & Authentication**
2. **Enable Email address and Username**
3. **Go to Email addresses and enable Email verification**
4. **Set up your paths:**
   - Sign in URL: `/sign-in`
   - Sign up URL: `/sign-up`
   - After sign in URL: `/`
   - After sign up URL: `/`

### Step 4: Test the Fix

1. **Restart your Expo development server:**
   ```bash
   npx expo start --clear
   ```
2. **Try signing up again**
3. **Check the console logs for debugging information**

## 🔍 Debugging

If you still have issues, check the console logs for:

- `🔧 Clerk Configuration:` - Shows if your key is loaded
- `🔍 SignupScreen Debug:` - Shows if Clerk is loaded
- `❌ Invalid or default Clerk publishable key detected!` - Means you need to update your key

## 📱 Alternative: Use Development Mode

If you want to test without Clerk for now, you can temporarily bypass authentication:

1. **Edit `utils/authConfig.js`**
2. **Set `BYPASS_AUTH: true` in the `DEV_AUTH` section**
3. **This will allow you to test the app without authentication**

## 🆘 Still Having Issues?

1. **Check your internet connection**
2. **Verify your Clerk key is correct**
3. **Make sure you're using the test key (starts with `pk_test_`)**
4. **Try clearing your app cache and restarting**

## 📞 Need Help?

If you're still having issues:
1. Check the console logs for specific error messages
2. Verify your Clerk configuration in the dashboard
3. Make sure your Clerk application is properly set up

---

**Remember:** The key you're currently using is a placeholder. You need to replace it with your actual Clerk publishable key from your dashboard.
