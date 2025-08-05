import apiService from './api';
import notificationService from './notificationService';

class ThingSpeakService {
  constructor() {
    this.baseUrl = 'https://api.thingspeak.com';
    this.channelId = '3019224';
    this.apiKey = 'YKO43PVQCCPOJ404';
    this.updateInterval = 10000; // 10 seconds for very rapid updates
    this.isPolling = false;
    this.pollingInterval = null;
    this.lastProcessedTimestamp = null;
    this.autoPredictionEnabled = true;
    this.autoAlertEnabled = true;
    this.lastNotificationTime = null;
    this.notificationCooldown = 60000; // 1 minute cooldown between notifications
    this.riskThreshold = 'moderate'; // Only notify for moderate+ risk levels
    this.consecutiveHighRiskCount = 0;
    this.requiredConsecutiveHighRisk = 2; // Require 2 consecutive high-risk readings
    this.currentSensorData = null;
    this.currentPrediction = null;
  }

  // Fetch real-time data from ThingSpeak with optimized caching
  async fetchRealTimeData() {
    try {
      const url = `${this.baseUrl}/channels/${this.channelId}/feeds.json?api_key=${this.apiKey}&results=1`;
      
      console.log('🌐 Fetching ThingSpeak data...');
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`ThingSpeak API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.feeds || data.feeds.length === 0) {
        throw new Error('No data available from ThingSpeak');
      }
      
      const latestFeed = data.feeds[0];
      console.log('✅ ThingSpeak data received:', latestFeed);
      
      return this.parseThingSpeakData(latestFeed);
      
    } catch (error) {
      console.error('❌ ThingSpeak fetch error:', error);
      throw error;
    }
  }

  // Parse ThingSpeak data into our sensor reading format with validation
  parseThingSpeakData(feed) {
    const timestamp = new Date(feed.created_at);
    
    // Validate data quality before processing
    const hasRequiredData = feed.field1 && feed.field2 && feed.field3;
    if (!hasRequiredData) {
      throw new Error('Insufficient sensor data for prediction');
    }
    
    // Map ThingSpeak fields to our sensor reading format
    const sensorData = {
      device_id: 1, // Default device ID for ThingSpeak
      temperature: parseFloat(feed.field1) || null,
      humidity: parseFloat(feed.field2) || null,
      smoke_level: parseInt(feed.field3) || null,
      air_quality: parseInt(feed.field4) || null,
      wind_speed: parseFloat(feed.field5) || null,
      wind_direction: parseInt(feed.field6) || null,
      atmospheric_pressure: parseFloat(feed.field7) || null,
      uv_index: parseFloat(feed.field8) || null,
      soil_moisture: parseFloat(feed.field9) || null,
      rainfall: parseFloat(feed.field10) || null,
      timestamp: timestamp,
      data_quality: 'good',
      battery_level: 100, // Default for ThingSpeak
      signal_strength: 100, // Default for ThingSpeak
      source: 'thingspeak'
    };

    console.log('📊 Parsed sensor data:', sensorData);
    return sensorData;
  }

  // Direct ML prediction from current sensor data
  async predictFromCurrentData(sensorData) {
    try {
      console.log('🤖 Creating direct ML prediction from current sensor data...');
      
      // Prepare prediction data from current sensor readings
      const predictionData = {
        temperature: sensorData.temperature,
        humidity: sensorData.humidity,
        smoke_level: sensorData.smoke_level,
        air_quality: sensorData.air_quality,
        wind_speed: sensorData.wind_speed,
        wind_direction: sensorData.wind_direction,
        atmospheric_pressure: sensorData.atmospheric_pressure,
        uv_index: sensorData.uv_index,
        soil_moisture: sensorData.soil_moisture,
        rainfall: sensorData.rainfall,
        device_id: sensorData.device_id
      };

      // Create prediction using the ML model
      const predictionResponse = await apiService.createPrediction(predictionData);
      console.log('✅ Direct ML prediction created:', predictionResponse);
      
      // Update current prediction
      this.currentPrediction = predictionResponse;
      
      return predictionResponse;
      
    } catch (error) {
      console.error('❌ Error creating direct ML prediction:', error);
      throw error;
    }
  }

  // Check if notification should be sent based on risk level and cooldown
  shouldSendNotification(riskLevel) {
    const now = Date.now();
    
    // Check cooldown period
    if (this.lastNotificationTime && (now - this.lastNotificationTime) < this.notificationCooldown) {
      console.log('⏰ Notification cooldown active, skipping...');
      return false;
    }
    
    // Check risk threshold
    const riskLevels = ['low', 'moderate', 'high', 'critical'];
    const currentRiskIndex = riskLevels.indexOf(riskLevel);
    const thresholdIndex = riskLevels.indexOf(this.riskThreshold);
    
    if (currentRiskIndex < thresholdIndex) {
      console.log(`📊 Risk level ${riskLevel} below threshold ${this.riskThreshold}, skipping notification`);
      return false;
    }
    
    // For high/critical risk, require consecutive readings
    if (['high', 'critical'].includes(riskLevel)) {
      this.consecutiveHighRiskCount++;
      if (this.consecutiveHighRiskCount < this.requiredConsecutiveHighRisk) {
        console.log(`⚠️ High risk detected (${this.consecutiveHighRiskCount}/${this.requiredConsecutiveHighRisk} consecutive), waiting for confirmation...`);
        return false;
      }
    } else {
      // Reset counter for lower risk levels
      this.consecutiveHighRiskCount = 0;
    }
    
    return true;
  }

  // Process current sensor data and create rapid predictions
  async processCurrentSensorData(sensorData) {
    try {
      console.log('💾 Processing current sensor data for rapid prediction...');
      
      // Check if this is new data (avoid duplicates)
      if (this.lastProcessedTimestamp && sensorData.timestamp <= this.lastProcessedTimestamp) {
        console.log('⏭️ Skipping duplicate data');
        return { skipped: true, reason: 'duplicate_data' };
      }
      
      // Update current sensor data
      this.currentSensorData = sensorData;
      
      // Create sensor reading in database
      const readingResponse = await apiService.createSensorReading(sensorData);
      console.log('✅ Sensor reading created:', readingResponse);
      
      // Create direct ML prediction from current data
      let predictionResponse = null;
      if (this.autoPredictionEnabled && sensorData.temperature && sensorData.humidity && sensorData.smoke_level) {
        predictionResponse = await this.predictFromCurrentData(sensorData);
        
        // Check if notification should be sent based on risk level
        if (this.autoAlertEnabled && predictionResponse.risk_level && 
            this.shouldSendNotification(predictionResponse.risk_level)) {
          
          console.log(`🚨 ${predictionResponse.risk_level.toUpperCase()} risk confirmed, sending notification...`);
          
          // Send fire alert notification with sound
          try {
            await notificationService.sendFireAlert(predictionResponse);
            console.log('🔔 Fire alert notification sent successfully');
            
            // Update notification timestamp
            this.lastNotificationTime = Date.now();
            
            // Reset consecutive count after successful notification
            this.consecutiveHighRiskCount = 0;
            
          } catch (notificationError) {
            console.error('❌ Error sending fire alert notification:', notificationError);
          }
        } else if (predictionResponse.risk_level) {
          console.log(`📊 Risk level: ${predictionResponse.risk_level} - No notification sent (threshold/cooldown)`);
        }
      }
      
      // Update last processed timestamp
      this.lastProcessedTimestamp = sensorData.timestamp;
      
      return {
        reading: readingResponse,
        prediction: predictionResponse,
        processed: true,
        timestamp: sensorData.timestamp
      };
      
    } catch (error) {
      console.error('❌ Error processing current sensor data:', error);
      throw error;
    }
  }

  // Get current sensor data and prediction
  getCurrentData() {
    return {
      sensorData: this.currentSensorData,
      prediction: this.currentPrediction,
      lastUpdate: this.lastProcessedTimestamp
    };
  }

  // Start rapid real-time polling with direct ML predictions
  startRealTimePolling() {
    if (this.isPolling) {
      console.log('⚠️ ThingSpeak polling already active');
      return;
    }

    console.log('🚀 Starting rapid ThingSpeak polling with direct ML predictions...');
    this.isPolling = true;

    // Initial fetch and prediction
    this.pollThingSpeakData();

    // Set up rapid interval
    this.pollingInterval = setInterval(() => {
      this.pollThingSpeakData();
    }, this.updateInterval);
  }

  // Stop real-time polling
  stopRealTimePolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
    this.isPolling = false;
    console.log('⏹️ ThingSpeak polling stopped');
  }

  // Poll ThingSpeak data with direct ML prediction
  async pollThingSpeakData() {
    try {
      console.log('📡 Rapid polling ThingSpeak for new data with direct ML prediction...');
      
      const sensorData = await this.fetchRealTimeData();
      const result = await this.processCurrentSensorData(sensorData);
      
      if (result.processed) {
        // Emit real-time update event
        this.emitRealTimeUpdate(sensorData, result);
        
        // Show processing notification only for significant updates
        if (result.prediction && ['high', 'critical'].includes(result.prediction.risk_level)) {
          this.showProcessingNotification(result);
        }
      }
      
    } catch (error) {
      console.error('❌ ThingSpeak polling error:', error);
      this.showErrorNotification(error);
    }
  }

  // Emit real-time update event
  emitRealTimeUpdate(sensorData, result) {
    // This can be used to emit events to other parts of the app
    console.log('📡 Emitting real-time update:', {
      sensorData: sensorData,
      prediction: result.prediction,
      timestamp: result.timestamp
    });
  }

  // Show processing notification for significant updates
  showProcessingNotification(result) {
    if (result.prediction) {
      const riskLevel = result.prediction.risk_level;
      const confidence = Math.round((result.prediction.confidence_score || 0) * 100);
      
      console.log(`📊 Processing complete - Risk: ${riskLevel}, Confidence: ${confidence}%`);
    }
  }

  // Show error notification
  showErrorNotification(error) {
    console.error('❌ ThingSpeak error:', error.message);
  }

  // Get channel information
  async getChannelInfo() {
    try {
      const url = `${this.baseUrl}/channels/${this.channelId}.json?api_key=${this.apiKey}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`ThingSpeak API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('❌ Error fetching channel info:', error);
      throw error;
    }
  }

  // Get historical data
  async getHistoricalData(results = 100) {
    try {
      const url = `${this.baseUrl}/channels/${this.channelId}/feeds.json?api_key=${this.apiKey}&results=${results}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`ThingSpeak API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.feeds || [];
      
    } catch (error) {
      console.error('❌ Error fetching historical data:', error);
      throw error;
    }
  }

  // Sync historical data with predictions
  async syncHistoricalData(results = 100) {
    try {
      console.log('🔄 Syncing historical ThingSpeak data...');
      
      const feeds = await this.getHistoricalData(results);
      let processedCount = 0;
      
      for (const feed of feeds) {
        try {
          const sensorData = this.parseThingSpeakData(feed);
          await this.processCurrentSensorData(sensorData);
          processedCount++;
        } catch (error) {
          console.warn('⚠️ Skipping invalid historical data:', error.message);
        }
      }
      
      console.log(`✅ Historical sync complete: ${processedCount} records processed`);
      return { processed: processedCount, total: feeds.length };
      
    } catch (error) {
      console.error('❌ Error syncing historical data:', error);
      throw error;
    }
  }

  // Get polling status
  getPollingStatus() {
    return {
      isPolling: this.isPolling,
      updateInterval: this.updateInterval,
      lastProcessedTimestamp: this.lastProcessedTimestamp,
      autoPredictionEnabled: this.autoPredictionEnabled,
      autoAlertEnabled: this.autoAlertEnabled,
      riskThreshold: this.riskThreshold,
      consecutiveHighRiskCount: this.consecutiveHighRiskCount,
      lastNotificationTime: this.lastNotificationTime,
      currentSensorData: this.currentSensorData ? 'Available' : 'None',
      currentPrediction: this.currentPrediction ? 'Available' : 'None'
    };
  }

  // Set update interval
  setUpdateInterval(interval) {
    this.updateInterval = interval;
    console.log(`⏱️ Update interval set to ${interval}ms`);
    
    // Restart polling if active
    if (this.isPolling) {
      this.stopRealTimePolling();
      this.startRealTimePolling();
    }
  }

  // Set auto prediction enabled
  setAutoPredictionEnabled(enabled) {
    this.autoPredictionEnabled = enabled;
    console.log(`🤖 Auto prediction ${enabled ? 'enabled' : 'disabled'}`);
  }

  // Set auto alert enabled
  setAutoAlertEnabled(enabled) {
    this.autoAlertEnabled = enabled;
    console.log(`🔔 Auto alerts ${enabled ? 'enabled' : 'disabled'}`);
  }

  // Set risk threshold for notifications
  setRiskThreshold(threshold) {
    this.riskThreshold = threshold;
    console.log(`📊 Risk threshold set to: ${threshold}`);
  }

  // Set consecutive high risk requirement
  setConsecutiveHighRiskRequirement(count) {
    this.requiredConsecutiveHighRisk = count;
    console.log(`🔄 Consecutive high risk requirement set to: ${count}`);
  }

  // Get configuration
  getConfiguration() {
    return {
      updateInterval: this.updateInterval,
      autoPredictionEnabled: this.autoPredictionEnabled,
      autoAlertEnabled: this.autoAlertEnabled,
      riskThreshold: this.riskThreshold,
      notificationCooldown: this.notificationCooldown,
      requiredConsecutiveHighRisk: this.requiredConsecutiveHighRisk
    };
  }

  // Update configuration
  updateConfiguration(config) {
    if (config.updateInterval) this.setUpdateInterval(config.updateInterval);
    if (config.autoPredictionEnabled !== undefined) this.setAutoPredictionEnabled(config.autoPredictionEnabled);
    if (config.autoAlertEnabled !== undefined) this.setAutoAlertEnabled(config.autoAlertEnabled);
    if (config.riskThreshold) this.setRiskThreshold(config.riskThreshold);
    if (config.notificationCooldown) this.notificationCooldown = config.notificationCooldown;
    if (config.requiredConsecutiveHighRisk) this.setConsecutiveHighRiskRequirement(config.requiredConsecutiveHighRisk);
    
    console.log('⚙️ ThingSpeak configuration updated');
  }
}

export default new ThingSpeakService(); 