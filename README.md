# Forest Fire Predictor

An AI-powered React Native application for predicting forest fire risks using real-time sensor data and machine learning.

## 🚀 Features

- **Real-time Fire Risk Assessment** - Analyze environmental data to predict fire risks
- **IoT Sensor Integration** - Connect with ThingSpeak for live sensor data
- **AI Chatbot Assistant** - Get insights and recommendations about fire safety
- **User Authentication** - Secure login and signup with Clerk
- **Dark/Light Theme** - Customizable theme system
- **Offline Support** - Works without internet connection
- **Cross-platform** - Works on iOS and Android

## 📱 Screenshots

- Dashboard with real-time sensor data
- Fire risk prediction interface
- AI chatbot for fire safety advice
- User profile and settings
- Historical prediction results

## 🛠️ Tech Stack

- **Frontend**: React Native with Expo
- **Authentication**: Clerk
- **Navigation**: React Navigation Drawer
- **State Management**: React Context API
- **IoT Integration**: ThingSpeak API
- **Backend**: Python Flask with ML models
- **Database**: SQLite/PostgreSQL

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ForestFire-Predictor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on device/simulator**
   - Scan QR code with Expo Go app
   - Or press `i` for iOS simulator
   - Or press `a` for Android emulator

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Clerk Authentication
CLERK_PUBLISHABLE_KEY=your_clerk_key

# Backend API
API_BASE_URL=http://your-backend-url:5000/api

# ThingSpeak IoT
THINGSPEAK_CHANNEL_ID=your_channel_id
THINGSPEAK_API_KEY=your_api_key
```

### Backend Setup

1. Navigate to the backend directory
2. Install Python dependencies
3. Run the Flask server

## 📱 App Structure

```
├── app/                    # Expo Router pages
├── components/             # Reusable UI components
├── screens/               # Screen components
├── navigation/            # Navigation configuration
├── hooks/                 # Custom React hooks
├── services/              # API services
├── theme/                 # Theme and styling
├── utils/                 # Utility functions
└── backend/               # Python Flask backend
```

## 🔐 Authentication

The app uses Clerk for authentication:

- Email/password signup and login
- Email verification
- Secure token management
- User profile synchronization

## 🎨 Theming

The app supports both light and dark themes:

- Automatic theme detection
- Manual theme switching
- Persistent theme preferences
- Consistent color scheme

## 📊 Data Sources

- **IoT Sensors**: Temperature, humidity, smoke levels
- **Weather API**: Current weather conditions
- **Historical Data**: Past fire incidents
- **ML Models**: Trained on historical fire data

## 🤖 AI Features

- **Risk Prediction**: ML-based fire risk assessment
- **Chatbot**: AI assistant for fire safety advice
- **Recommendations**: Personalized safety tips
- **Alert System**: Real-time risk notifications

## 🚨 Alerts & Notifications

- High-risk fire conditions
- Sensor malfunction alerts
- Weather warnings
- Safety recommendations

## 📈 Analytics

- User prediction history
- Risk assessment statistics
- Sensor data trends
- Performance metrics

## 🔧 Development

### Code Style

- ESLint configuration
- Prettier formatting
- TypeScript support
- Consistent naming conventions

### Testing

```bash
# Run tests
npm test

# Run linting
npm run lint

# Type checking
npx tsc --noEmit
```

### Building

```bash
# Build for production
npx expo build:android
npx expo build:ios

# Build for development
npx expo build:android --dev-client
```

## 📦 Dependencies

### Core Dependencies
- React Native 0.79.5
- Expo SDK 53
- React Navigation 7
- Clerk Authentication
- AsyncStorage

### UI Dependencies
- React Native Safe Area Context
- React Native Gesture Handler
- React Native Reanimated
- Expo Vector Icons

## 🐛 Troubleshooting

### Common Issues

1. **Metro bundler errors**
   ```bash
   npx expo start --clear
   ```

2. **Authentication issues**
   - Check Clerk configuration
   - Verify environment variables

3. **Network connectivity**
   - Ensure backend server is running
   - Check API endpoint configuration

### Debug Mode

Enable debug logging by setting:
```javascript
console.log('Debug mode enabled');
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Contact the development team

## 🔄 Updates

Stay updated with the latest features and bug fixes by:
- Following the repository
- Checking release notes
- Updating dependencies regularly

---

**Forest Fire Predictor** - Protecting our forests with AI-powered predictions 🔥🌲 