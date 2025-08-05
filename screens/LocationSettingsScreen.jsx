import React, { useContext, useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Switch,
  Alert,
  ActivityIndicator,
  TextInput 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';

const LocationSettingsScreen = ({ navigation }) => {
  const { colors } = useTheme();
  
  const [isLoading, setIsLoading] = useState(false);
  const [locationPermission, setLocationPermission] = useState(null);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [savedLocations, setSavedLocations] = useState([
    {
      id: 1,
      name: 'Home',
      address: '123 Main St, City, State',
      coordinates: { latitude: 37.7749, longitude: -122.4194 },
      isDefault: true
    },
    {
      id: 2,
      name: 'Work',
      address: '456 Business Ave, City, State',
      coordinates: { latitude: 37.7849, longitude: -122.4094 },
      isDefault: false
    }
  ]);

  const [locationSettings, setLocationSettings] = useState({
    backgroundLocation: false,
    highAccuracy: true,
    locationHistory: true,
    locationSharing: false,
    emergencyLocation: true,
    weatherUpdates: true,
    fireRiskAlerts: true,
  });

  useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      setLocationPermission(status);
      setLocationEnabled(status === 'granted');
    } catch (error) {
      console.error('Error checking location permission:', error);
    }
  };

  const requestLocationPermission = async () => {
    setIsLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status);
      setLocationEnabled(status === 'granted');
      
      if (status === 'granted') {
        Alert.alert('Success', 'Location permission granted!');
        getCurrentLocation();
      } else {
        Alert.alert('Permission Denied', 'Location permission is required for fire risk predictions.');
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      Alert.alert('Error', 'Failed to request location permission.');
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setCurrentLocation(location);
    } catch (error) {
      console.error('Error getting current location:', error);
    }
  };

  const handleSaveLocation = () => {
    if (!currentLocation) {
      Alert.alert('No Location', 'Please enable location services to save your current location.');
      return;
    }

    const newLocation = {
      id: Date.now(),
      name: 'Current Location',
      address: 'Current GPS Location',
      coordinates: {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      },
      isDefault: false
    };

    setSavedLocations(prev => [...prev, newLocation]);
    Alert.alert('Success', 'Current location saved!');
  };

  const handleDeleteLocation = (locationId) => {
    Alert.alert(
      'Delete Location',
      'Are you sure you want to delete this location?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setSavedLocations(prev => prev.filter(loc => loc.id !== locationId));
          }
        }
      ]
    );
  };

  const handleToggleSetting = (key) => {
    setLocationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const LocationItem = ({ 
    icon, 
    title, 
    subtitle, 
    value, 
    onToggle, 
    showSwitch = true,
    onPress = null 
  }) => (
    <TouchableOpacity 
      style={[
        styles.locationItem, 
        { 
          backgroundColor: colors.surface,
          shadowColor: colors.shadow
        }
      ]} 
      onPress={onPress}
      disabled={showSwitch}
    >
      <View style={[styles.locationIcon, { backgroundColor: colors.primary + '20' }]}>
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>
      <View style={styles.locationContent}>
        <Text style={[styles.locationTitle, { color: colors.text }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.locationSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
        )}
      </View>
      {showSwitch && (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: colors.border, true: colors.primary + '40' }}
          thumbColor={value ? colors.primary : colors.textLight}
        />
      )}
    </TouchableOpacity>
  );

  const SavedLocationItem = ({ location, onDelete }) => (
    <View style={[styles.savedLocationItem, { backgroundColor: colors.surface }]}>
      <View style={styles.savedLocationContent}>
        <View style={styles.locationHeader}>
          <Text style={[styles.locationName, { color: colors.text }]}>{location.name}</Text>
          {location.isDefault && (
            <View style={[styles.defaultBadge, { backgroundColor: colors.primary }]}>
              <Text style={[styles.defaultText, { color: colors.surface }]}>Default</Text>
            </View>
          )}
        </View>
        <Text style={[styles.locationAddress, { color: colors.textSecondary }]}>
          {location.address}
        </Text>
        <Text style={[styles.locationCoords, { color: colors.textLight }]}>
          {location.coordinates.latitude.toFixed(4)}, {location.coordinates.longitude.toFixed(4)}
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.deleteButton, { backgroundColor: colors.error + '20' }]}
        onPress={() => onDelete(location.id)}
      >
        <Ionicons name="trash-outline" size={16} color={colors.error} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Location Settings</Text>
        </View>
        {/* Location Permission */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>📍 Location Permission</Text>
          
          <View style={[styles.permissionCard, { backgroundColor: colors.surface }]}>
            <View style={styles.permissionHeader}>
              <Ionicons 
                name={locationEnabled ? "checkmark-circle" : "close-circle"} 
                size={24} 
                color={locationEnabled ? colors.success : colors.error} 
              />
              <Text style={[styles.permissionStatus, { color: colors.text }]}>
                {locationEnabled ? 'Location Enabled' : 'Location Disabled'}
              </Text>
            </View>
            
            {currentLocation && (
              <View style={styles.currentLocationInfo}>
                <Text style={[styles.currentLocationTitle, { color: colors.text }]}>Current Location:</Text>
                <Text style={[styles.currentLocationText, { color: colors.textSecondary }]}>
                  {currentLocation.coords.latitude.toFixed(4)}, {currentLocation.coords.longitude.toFixed(4)}
                </Text>
              </View>
            )}
            
            <TouchableOpacity
              style={[
                styles.permissionButton,
                { 
                  backgroundColor: locationEnabled ? colors.success : colors.primary,
                  opacity: isLoading ? 0.7 : 1
                }
              ]}
              onPress={locationEnabled ? getCurrentLocation : requestLocationPermission}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={colors.surface} />
              ) : (
                <Ionicons 
                  name={locationEnabled ? "refresh" : "location"} 
                  size={20} 
                  color={colors.surface} 
                />
              )}
              <Text style={[styles.permissionButtonText, { color: colors.surface }]}>
                {isLoading ? 'Loading...' : (locationEnabled ? 'Update Location' : 'Enable Location')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Saved Locations */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>💾 Saved Locations</Text>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: colors.primary }]}
              onPress={handleSaveLocation}
            >
              <Ionicons name="add" size={16} color={colors.surface} />
              <Text style={[styles.addButtonText, { color: colors.surface }]}>Add</Text>
            </TouchableOpacity>
          </View>
          
          {savedLocations.map(location => (
            <SavedLocationItem 
              key={location.id} 
              location={location} 
              onDelete={handleDeleteLocation}
            />
          ))}
        </View>

        {/* Location Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>⚙️ Location Settings</Text>
          
          <LocationItem
            icon="location-outline"
            title="Background Location"
            subtitle="Track location even when app is closed"
            value={locationSettings.backgroundLocation}
            onToggle={() => handleToggleSetting('backgroundLocation')}
          />
          
          <LocationItem
            icon="compass-outline"
            title="High Accuracy"
            subtitle="Use GPS for precise location tracking"
            value={locationSettings.highAccuracy}
            onToggle={() => handleToggleSetting('highAccuracy')}
          />
          
          <LocationItem
            icon="time-outline"
            title="Location History"
            subtitle="Save location history for analysis"
            value={locationSettings.locationHistory}
            onToggle={() => handleToggleSetting('locationHistory')}
          />
          
          <LocationItem
            icon="share-outline"
            title="Location Sharing"
            subtitle="Share location with emergency services"
            value={locationSettings.locationSharing}
            onToggle={() => handleToggleSetting('locationSharing')}
          />
        </View>

        {/* Location-Based Features */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>🎯 Location Features</Text>
          
          <LocationItem
            icon="warning-outline"
            title="Emergency Location"
            subtitle="Share location during emergencies"
            value={locationSettings.emergencyLocation}
            onToggle={() => handleToggleSetting('emergencyLocation')}
          />
          
          <LocationItem
            icon="cloudy-outline"
            title="Weather Updates"
            subtitle="Get weather updates for your location"
            value={locationSettings.weatherUpdates}
            onToggle={() => handleToggleSetting('weatherUpdates')}
          />
          
          <LocationItem
            icon="flame-outline"
            title="Fire Risk Alerts"
            subtitle="Get alerts based on your location"
            value={locationSettings.fireRiskAlerts}
            onToggle={() => handleToggleSetting('fireRiskAlerts')}
          />
        </View>

        {/* Location Accuracy Info */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>ℹ️ Location Information</Text>
          
          <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.infoTitle, { color: colors.text }]}>Why Location Access?</Text>
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              Location access helps us provide accurate fire risk predictions for your area, 
              send relevant alerts, and improve the accuracy of our predictions.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: 'transparent', // Ensure it doesn't interfere with SafeAreaView
  },
  backButton: {
    padding: 8,
    marginRight: 10,
  },
  title: {
    ...typography.h4,
    fontWeight: 'bold',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    ...typography.h3,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  addButtonText: {
    ...typography.caption,
    fontWeight: '600',
    marginLeft: 4,
  },
  permissionCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  permissionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  permissionStatus: {
    ...typography.body1,
    fontWeight: '600',
    marginLeft: 8,
  },
  currentLocationInfo: {
    marginBottom: 16,
  },
  currentLocationTitle: {
    ...typography.body2,
    fontWeight: '600',
    marginBottom: 4,
  },
  currentLocationText: {
    ...typography.caption,
  },
  permissionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    padding: 12,
  },
  permissionButtonText: {
    ...typography.body2,
    fontWeight: '600',
    marginLeft: 8,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  locationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  locationContent: {
    flex: 1,
  },
  locationTitle: {
    ...typography.body1,
    fontWeight: '600',
  },
  locationSubtitle: {
    ...typography.caption,
    marginTop: 2,
  },
  savedLocationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  savedLocationContent: {
    flex: 1,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationName: {
    ...typography.body1,
    fontWeight: '600',
    marginRight: 8,
  },
  defaultBadge: {
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  defaultText: {
    ...typography.caption,
    fontWeight: '600',
  },
  locationAddress: {
    ...typography.body2,
    marginBottom: 2,
  },
  locationCoords: {
    ...typography.caption,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
  },
  infoTitle: {
    ...typography.body1,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    ...typography.body2,
    lineHeight: 20,
  },
});

export default LocationSettingsScreen; 