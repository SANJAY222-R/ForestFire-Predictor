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