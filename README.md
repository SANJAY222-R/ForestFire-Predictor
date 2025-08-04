# 🔥 Forest Fire Predictor

A comprehensive React Native application for predicting forest fire risks using machine learning and real-time sensor data.

## 🌟 Features

- **Real-time Fire Risk Prediction**: Advanced ML models analyze environmental conditions
- **IoT Sensor Integration**: Connect and monitor multiple sensor devices
- **Real-time Alerts**: Instant notifications for high-risk conditions
- **AI Chatbot Assistant**: Get insights and recommendations
- **User Authentication**: Secure login with Clerk
- **Responsive Design**: Works on mobile and web platforms
- **Dark/Light Theme**: Customizable UI themes

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- Python (v3.8 or higher)
- Expo CLI
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ForestFire-Predictor
   ```

2. **Install Frontend Dependencies**
   ```bash
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   cd ..
   ```

### Running the Application

#### Option 1: Using Batch Files (Windows)
- **Backend**: Double-click `start_backend.bat`
- **Frontend**: Double-click `start_frontend.bat`

#### Option 2: Manual Start

1. **Start Backend Server**
   ```bash
   cd backend
   python run.py --seed --debug
   ```
   The server will start on `http://localhost:5000`

2. **Start Frontend**
   ```bash
   npm start
   ```
   This will open Expo DevTools in your browser

3. **Run on Device/Simulator**
   - Scan the QR code with Expo Go app (mobile)
   - Press 'w' for web version
   - Press 'a' for Android emulator
   - Press 'i' for iOS simulator

## 📱 API Endpoints

### Health Check
- `GET /api/health` - Server status

### Authentication
- `POST /api/auth/verify` - Verify user token
- `GET /api/auth/user` - Get current user

### Sensors
- `GET /api/sensors/test` - Test sensor API
- `GET /api/sensors/devices` - Get all sensor devices
- `POST /api/sensors/readings` - Create sensor reading

### Predictions
- `POST /api/predictions` - Create fire risk prediction
- `GET /api/predictions` - Get user predictions
- `GET /api/predictions/stats` - Get prediction statistics

### Alerts
- `GET /api/alerts` - Get user alerts
- `PUT /api/alerts/{id}/acknowledge` - Acknowledge alert
- `PUT /api/alerts/{id}/resolve` - Resolve alert

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## 🛠️ Development

### Recent Updates

#### User Authentication Fix (Latest)
- **Issue**: The application was storing random/incorrect user data because it was extracting from Clerk's user object instead of using the actual user input
- **Root Cause**: Clerk's user object might not contain the exact username/email that the user entered during signup
- **Solution**: Capture the actual user input during signup and send it to the backend immediately after verification
- **User Data Flow**: 
  - Users provide: **username**, **email**, **password** during signup
  - Frontend captures: **username**, **email** from user input
  - Frontend sends: **username**, **email**, **display name** to backend
  - Backend stores: **clerk_user_id**, **email**, **full_name** in database
  - Profile screen displays: **actual username** and **email** from backend data
- **Existing Users Fix**: 
  - Existing users get their data updated when they log in
  - AuthGate automatically syncs and updates user data on login
  - Backend compares and updates with latest data from Clerk
- **Database-First Display Fix**:
  - Profile screen now gets data **directly from Neon database**
  - No more dependency on Clerk data for display
  - Real-time display of actual user data from database
  - Works for all users (new and existing)
- **Correct User Identification Fix**:
  - Backend now identifies the correct user based on authentication token
  - Development mode uses token decoding to find the right user
  - Profile screen shows the actual logged-in user's data
  - No more showing development user data for all users
- **Changes Made**:
  - Modified `SignupScreen.jsx` to capture and pass actual user input to sync
  - Updated `useUserSync.js` to accept and prioritize actual user input over Clerk data
  - Enhanced `auth.py` backend endpoint to use real user data and update existing users
  - **Updated `ProfileScreen.jsx` to use ONLY backend data (no Clerk data)**
  - **Modified `users.py` backend endpoint to return actual database data**
  - **Enhanced authentication decorator to identify correct user from token**
  - Updated `User.to_dict()` to include username field
  - Enhanced `AuthGate.jsx` to ensure existing users get updated on login
  - Added detailed logging to track actual user input flow
  - Created test endpoints for debugging user storage

**Files Modified**:
- `hooks/useUserSync.js` - Extract real user data from Clerk
- `services/api.js` - Send user data with sync request
- `backend/app/routes/auth.py` - Use real user data for database storage
- `test_user_sync.js` - Test script to verify the fix

### Testing User Sync

To test that real user data is being stored correctly:

1. **Start the backend server**
2. **Run the test script**:
   ```bash
   node test_user_sync.js
   ```
3. **Check the backend logs** for detailed user data flow
4. **Use the API endpoint** to list users:
   ```bash
   curl http://localhost:5000/api/auth/list-users
   ```

### Database Schema

### Backend Structure
```
backend/
├── app/
│   ├── models/          # Database models
│   ├── routes/          # API endpoints
│   ├── services/        # Business logic
│   └── utils/           # Utilities
├── config.py            # Configuration
├── run.py              # Server entry point
└── requirements.txt    # Python dependencies
```

### Frontend Structure
```
├── app/                # Main app screens
├── components/         # Reusable components
├── navigation/         # Navigation setup
├── services/          # API services
├── theme/             # UI theming
└── utils/             # Utilities
```

### Environment Variables

Create a `.env` file in the backend directory:
```env
FLASK_ENV=development
DATABASE_URL=sqlite:///forest_fire_predictor.db
SECRET_KEY=your-secret-key
```

## 🧪 Testing

### Backend API Testing
```bash
cd backend
python test_api.py
```

This will test all major API endpoints and verify functionality.

## 🔧 Troubleshooting

### Common Issues

1. **Backend won't start**
   - Ensure Python dependencies are installed: `pip install -r requirements.txt`
   - Check if port 5000 is available
   - Verify database permissions

2. **Frontend connection issues**
   - Ensure backend is running on `localhost:5000`
   - Check network connectivity
   - Verify API configuration in `services/api.js`

3. **Authentication issues**
   - Verify Clerk configuration
   - Check token storage in SecureStore
   - Ensure proper environment variables

### Debug Mode

Run the backend with debug flags:
```bash
python backend/run.py --seed --debug
```

This will:
- Seed the database with sample data
- Enable detailed logging
- Show all API endpoints

## 📊 Database

The application uses SQLite for development and can be configured for PostgreSQL in production.

### Sample Data

The backend automatically seeds the database with:
- 3 sample users (rangers, firefighters, researchers)
- 3 sensor devices with realistic locations
- 7 days of sensor readings
- Sample predictions and alerts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Test with the provided test script
4. Create an issue with detailed information

---

**🔥 Stay safe and protect our forests! 🌲** 