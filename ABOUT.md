# Forest Fire Predictor 🔥

A comprehensive React Native mobile application designed to predict and monitor forest fire risks using real-time sensor data and AI-powered analysis.

## 🌟 Overview

Forest Fire Predictor is an intelligent mobile application that combines IoT sensor monitoring, machine learning predictions, and AI-powered assistance to help users assess and respond to forest fire risks. The app provides real-time monitoring, risk assessment, and educational resources for fire safety.

## 🚀 Key Features

### 🔥 **Real-Time Sensor Monitoring**
- **Temperature Monitoring**: Track ambient temperature readings with risk level indicators
- **Humidity Tracking**: Monitor humidity levels to assess fire risk conditions
- **Smoke Detection**: Real-time smoke level monitoring in parts per million (ppm)
- **Live Alerts**: Instant notifications for critical sensor readings

### 🧠 **AI-Powered Risk Prediction**
- **Manual Input Analysis**: Enter sensor readings to get instant fire risk assessments
- **Risk Level Classification**: 
  - 🔥 **High Risk**: Dangerous conditions requiring immediate action
  - 🟡 **Moderate Risk**: Elevated conditions requiring increased monitoring
  - ✅ **Low Risk**: Safe conditions with continued monitoring
- **Predictive Analytics**: Machine learning algorithms analyze multiple parameters

### 🤖 **AI Fire Safety Assistant**
- **Interactive Chatbot**: Powered by Google Gemini AI
- **Quick Questions**: Pre-built queries for common fire safety concerns
- **Educational Content**: Fire prevention tips and evacuation guidance
- **Real-time Responses**: Instant answers to fire safety questions

### 📊 **Dashboard & Monitoring**
- **Live Sensor Feed**: Real-time display of all sensor readings
- **Alert History**: Track system alerts and maintenance notifications
- **Risk Assessment**: Visual indicators and recommendations
- **Pull-to-Refresh**: Real-time data updates

### 🔐 **User Authentication**
- **Secure Login/Signup**: Powered by Clerk authentication
- **User Profiles**: Personalized experience and settings
- **Session Management**: Secure token-based authentication

## 🛠️ Technical Stack

### **Frontend Framework**
- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and build tools
- **TypeScript**: Type-safe JavaScript development

### **Navigation & UI**
- **React Navigation**: Drawer navigation with custom styling
- **React Native Paper**: Material Design components
- **Custom Theme System**: Light/dark mode support
- **Vector Icons**: Ionicons for consistent iconography

### **AI & Backend**
- **Google Gemini AI**: Natural language processing for chatbot
- **Flask API**: Python-based RESTful backend
- **Neon PostgreSQL**: Cloud-native database for data persistence
- **Real-time Updates**: Live data synchronization via WebSocket

### **Authentication & Security**
- **Clerk**: User authentication and session management
- **Secure Storage**: Encrypted local data storage
- **Environment Variables**: Secure API key management

## 📱 App Structure

### **Core Screens**
1. **Dashboard (Home)**: Live sensor readings and alerts
2. **Fire Risk Prediction**: Manual input for risk assessment
3. **Prediction History**: Historical analysis results
4. **AI Assistant**: Interactive fire safety chatbot
5. **Profile**: User account management
6. **Settings**: App configuration and preferences

### **Key Components**
- **SensorCard**: Displays individual sensor readings with risk indicators
- **RiskBadge**: Visual risk level indicators (High/Moderate/Low)
- **AlertCard**: System notifications and alerts
- **AuthGate**: Authentication flow management

### **Theme System**
- **Light Theme**: Warm orange/yellow color scheme
- **Dark Theme**: Dark mode with orange accents
- **Risk Colors**: 
  - 🔴 High Risk: Red (#FF4444)
  - 🟡 Moderate Risk: Orange (#FFA500)
  - 🟢 Low Risk: Green (#4CAF50)

## 🔧 Installation & Setup

### **Prerequisites**
- Node.js (v16 or higher)
- Expo CLI
- Android Studio / Xcode (for device testing)

### **Environment Setup**
```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

### **Environment Variables**
Create a `.env` file with:
```
GEMINI_API_KEY=your_gemini_api_key
CLERK_PUBLISHABLE_KEY=your_clerk_key
```

## 🎯 Use Cases

### **Forest Rangers & Firefighters**
- Real-time monitoring of remote forest areas
- Quick risk assessment during patrols
- Emergency response planning

### **Environmental Researchers**
- Data collection for fire prediction models
- Historical analysis of fire patterns
- Climate change impact studies

### **General Public**
- Fire safety education and awareness
- Emergency preparedness guidance
- Local fire risk monitoring

## 🔮 Future Enhancements

### **Planned Features**
- **GPS Integration**: Location-based risk assessment
- **Weather API**: Real-time weather data integration
- **Push Notifications**: Critical alert system
- **Offline Mode**: Local data storage and analysis
- **Multi-language Support**: International accessibility
- **Advanced Analytics**: Machine learning model improvements

### **IoT Integration**
- **Sensor Network**: Expandable IoT sensor support
- **Real-time Data**: Live sensor data streaming
- **Automated Alerts**: Smart notification system

## 🤝 Contributing

This project is designed to help communities better understand and respond to forest fire risks. Contributions are welcome in the following areas:

- **UI/UX Improvements**: Enhanced user experience
- **AI Model Enhancement**: Better prediction algorithms
- **Sensor Integration**: Additional IoT device support
- **Documentation**: Improved guides and tutorials

## 📄 License

This project is developed for educational and community safety purposes. Please ensure compliance with local regulations and safety standards when implementing fire monitoring systems.

---

**Built with ❤️ for forest conservation and community safety** 