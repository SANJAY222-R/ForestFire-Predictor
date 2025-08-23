# Forest Fire Predictor - Setup Instructions

## 🚀 Quick Start

This guide will help you set up the Forest Fire Predictor application with proper authentication and all features working.

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- Python 3.8+ (for backend)
- PostgreSQL (for database)
- Clerk account (for authentication)
- Gemini AI API key (for chatbot)

## 🔧 Step 1: Environment Setup

### 1.1 Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd ForestFire-Predictor

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
pip install -r requirements.txt
cd ..
```

### 1.2 Environment Configuration

Create a `.env` file in the root directory:

```bash
# Copy the example environment file
cp env.example .env
```

Edit the `.env` file with your actual credentials:

```env
# Clerk Authentication (Get these from your Clerk dashboard)
CLERK_PUBLISHABLE_KEY=pk_test_your_actual_clerk_key_here
CLERK_SECRET_KEY=sk_test_your_actual_clerk_secret_key_here

# Backend API Configuration
API_BASE_URL=http://your-backend-url:5000/api
DEV_API_BASE_URL=http://10.122.117.191:5000/api

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/forest_fire_predictor
DEV_DATABASE_URL=postgresql://username:password@localhost:5432/forest_fire_predictor_dev

# JWT Configuration
JWT_SECRET_KEY=your-jwt-secret-key-change-this-in-production

# Gemini AI Configuration
GEMINI_API_KEY=your_actual_gemini_api_key_here

# Weather API Configuration
WEATHER_API_KEY=your_weather_api_key_here

# ThingSpeak IoT Configuration
THINGSPEAK_CHANNEL_ID=your_channel_id
THINGSPEAK_API_KEY=your_api_key

# Flask Configuration
FLASK_ENV=development
SECRET_KEY=your-secret-key-change-this-in-production
```

## 🔐 Step 2: Clerk Authentication Setup

### 2.1 Create Clerk Account

1. Go to [Clerk.com](https://clerk.com)
2. Create a new account
3. Create a new application
4. Note down your publishable key and secret key

### 2.2 Configure Clerk Application

1. In your Clerk dashboard, go to **API Keys**
2. Copy the **Publishable Key** and **Secret Key**
3. Update your `.env` file with these keys

### 2.3 Configure Clerk Settings

1. Go to **User & Authentication** → **Email, Phone, Username**
2. Enable **Email address** and **Username**
3. Go to **Email, Phone, Username** → **Email addresses**
4. Enable **Email verification**
5. Go to **Paths** and set:
   - Sign in URL: `/sign-in`
   - Sign up URL: `/sign-up`
   - After sign in URL: `/`
   - After sign up URL: `/`

## 🗄️ Step 3: Database Setup

### 3.1 Install PostgreSQL

```bash
# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# macOS
brew install postgresql

# Windows
# Download from https://www.postgresql.org/download/windows/
```

### 3.2 Create Database

```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Create database
CREATE DATABASE forest_fire_predictor;
CREATE DATABASE forest_fire_predictor_dev;

# Create user (optional)
CREATE USER forest_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE forest_fire_predictor TO forest_user;
GRANT ALL PRIVILEGES ON DATABASE forest_fire_predictor_dev TO forest_user;

# Exit PostgreSQL
\q
```

### 3.3 Initialize Database

```bash
cd backend

# Set environment variables
export DATABASE_URL=postgresql://username:password@localhost:5432/forest_fire_predictor_dev

# Run database migrations
python migrations.py

# Or if using Flask-Migrate
flask db upgrade
```

## 🤖 Step 4: AI Configuration

### 4.1 Gemini AI Setup

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add the key to your `.env` file

### 4.2 Update AI Configuration

Edit `screens/AIChatbotScreen.jsx` and replace the API key:

```javascript
const apiKey = "your_actual_gemini_api_key_here";
```

## 🔧 Step 5: Backend Setup

### 5.1 Configure Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 5.2 Start Backend Server

```bash
# Set environment variables
export FLASK_ENV=development
export DATABASE_URL=postgresql://username:password@localhost:5432/forest_fire_predictor_dev

# Start the server
python run.py
```

The backend should start on `http://localhost:5000`

## 📱 Step 6: Frontend Setup

### 6.1 Configure API URL

Edit `services/api.js` and update the API URL:

```javascript
const API_BASE_URL = __DEV__ 
  ? 'http://YOUR_COMPUTER_IP:5000/api'  // Replace with your computer's IP
  : 'https://your-production-api.com/api';
```

### 6.2 Start Frontend

```bash
# In the root directory
npx expo start
```

## 🧪 Step 7: Testing

### 7.1 Test Authentication

1. Open the app on your device/simulator
2. Try to sign up with a new account
3. Verify your email
4. Try to sign in
5. Check if user sync works

### 7.2 Test Backend API

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Test authentication
curl -X POST http://localhost:5000/api/auth/sync \
  -H "Content-Type: application/json" \
  -d '{"token": "test_token", "userData": {"clerk_user_id": "test_user", "email": "test@example.com", "full_name": "Test User"}}'
```

## 🔍 Troubleshooting

### Authentication Issues

1. **Clerk keys not working**
   - Verify your Clerk keys are correct
   - Check if Clerk application is properly configured
   - Ensure email verification is enabled

2. **Token not found**
   - Clear app storage and restart
   - Check if Clerk session is properly stored
   - Verify token cache configuration

3. **User sync failing**
   - Check backend logs for errors
   - Verify database connection
   - Check if user model is properly configured

### Network Issues

1. **API connection failed**
   - Verify backend server is running
   - Check if IP address is correct
   - Ensure firewall allows connections

2. **CORS errors**
   - Check CORS configuration in backend
   - Verify allowed origins include your IP

### Database Issues

1. **Connection refused**
   - Verify PostgreSQL is running
   - Check database credentials
   - Ensure database exists

2. **Migration errors**
   - Drop and recreate database
   - Run migrations again
   - Check migration files

## 📊 Monitoring

### Backend Logs

```bash
# View backend logs
tail -f backend/logs/app.log

# Check database logs
sudo tail -f /var/log/postgresql/postgresql-*.log
```

### Frontend Debugging

```bash
# Enable debug mode
export DEBUG=*

# View Expo logs
npx expo start --clear
```

## 🚀 Production Deployment

### Environment Variables

Update `.env` for production:

```env
FLASK_ENV=production
DATABASE_URL=your_production_database_url
CLERK_PUBLISHABLE_KEY=pk_live_your_production_key
CLERK_SECRET_KEY=sk_live_your_production_secret
```

### Security Checklist

- [ ] Change all default passwords
- [ ] Use strong JWT secret
- [ ] Enable HTTPS
- [ ] Configure proper CORS
- [ ] Set up monitoring
- [ ] Enable logging
- [ ] Configure backups

## 📞 Support

If you encounter issues:

1. Check the logs for error messages
2. Verify all environment variables are set
3. Ensure all services are running
4. Test each component individually
5. Check the troubleshooting section above

For additional help, create an issue in the repository with:
- Error messages
- Steps to reproduce
- Environment details
- Screenshots if applicable

## 🎉 Success!

Once everything is set up correctly, you should have:

- ✅ Working authentication with Clerk
- ✅ User profile synchronization
- ✅ Real-time sensor data
- ✅ AI chatbot functionality
- ✅ Fire risk predictions
- ✅ Notification system
- ✅ Dark/light theme support

The application is now ready for development and testing!
