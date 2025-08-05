import apiService from './api';

class ThingSpeakService {
  constructor() {
    this.baseUrl = 'https://api.thingspeak.com';
    this.channelId = '3019224';
    this.apiKey = 'YKO43PVQCCPOJ404';
    this.updateInterval = 30000; // 30 seconds
    this.isPolling = false;
    this.pollingInterval = null;
  }

  // Fetch real-time data from ThingSpeak
  async fetchRealTimeData() {
    try {
      const url = `${this.baseUrl}/channels/${this.channelId}/feeds.json?api_key=${this.apiKey}&results=1`;
      
      console.log('🌐 Fetching ThingSpeak data...');
      
      const response = await fetch(url);
      
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

  // Parse ThingSpeak data into our sensor reading format
  parseThingSpeakData(feed) {
    const timestamp = new Date(feed.created_at);
    
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

  // Store ThingSpeak data in Neon database
  async storeThingSpeakData(sensorData) {
    try {
      console.log('💾 Storing ThingSpeak data in database...');
      
      // Create sensor reading
      const readingResponse = await apiService.createSensorReading(sensorData);
      
      // Create prediction using the sensor data
      if (sensorData.temperature && sensorData.humidity && sensorData.smoke_level) {
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
        
        const predictionResponse = await apiService.createPrediction(predictionData);
        console.log('✅ Prediction created from ThingSpeak data');
        
        return {
          reading: readingResponse,
          prediction: predictionResponse
        };
      }
      
      return { reading: readingResponse };
      
    } catch (error) {
      console.error('❌ Error storing ThingSpeak data:', error);
      throw error;
    }
  }

  // Start real-time polling
  startRealTimePolling() {
    if (this.isPolling) {
      console.log('⚠️ ThingSpeak polling already active');
      return;
    }

    console.log('🚀 Starting ThingSpeak real-time polling...');
    this.isPolling = true;

    // Initial fetch
    this.pollThingSpeakData();

    // Set up interval
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

  // Poll ThingSpeak data
  async pollThingSpeakData() {
    try {
      const sensorData = await this.fetchRealTimeData();
      await this.storeThingSpeakData(sensorData);
      
      // Emit real-time update event
      this.emitRealTimeUpdate(sensorData);
      
    } catch (error) {
      console.error('❌ ThingSpeak polling error:', error);
    }
  }

  // Emit real-time update for UI
  emitRealTimeUpdate(sensorData) {
    // This will be handled by the UI components
    console.log('📡 Real-time update emitted:', sensorData);
  }

  // Get ThingSpeak channel info
  async getChannelInfo() {
    try {
      const url = `${this.baseUrl}/channels/${this.channelId}.json?api_key=${this.apiKey}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`ThingSpeak channel info error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.channel;
      
    } catch (error) {
      console.error('❌ Error fetching channel info:', error);
      throw error;
    }
  }

  // Get historical data from ThingSpeak
  async getHistoricalData(results = 100) {
    try {
      const url = `${this.baseUrl}/channels/${this.channelId}/feeds.json?api_key=${this.apiKey}&results=${results}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`ThingSpeak historical data error: ${response.status}`);
      }
      
      const data = await response.json();
      
      return data.feeds.map(feed => this.parseThingSpeakData(feed));
      
    } catch (error) {
      console.error('❌ Error fetching historical data:', error);
      throw error;
    }
  }

  // Sync historical data to database
  async syncHistoricalData(results = 100) {
    try {
      console.log('🔄 Syncing historical ThingSpeak data...');
      
      const historicalData = await this.getHistoricalData(results);
      let syncedCount = 0;
      
      for (const sensorData of historicalData) {
        try {
          await this.storeThingSpeakData(sensorData);
          syncedCount++;
        } catch (error) {
          console.error('❌ Error syncing data point:', error);
        }
      }
      
      console.log(`✅ Synced ${syncedCount} historical data points`);
      return syncedCount;
      
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
      channelId: this.channelId
    };
  }

  // Update polling interval
  setUpdateInterval(interval) {
    this.updateInterval = interval;
    
    if (this.isPolling) {
      this.stopRealTimePolling();
      this.startRealTimePolling();
    }
  }
}

// Create singleton instance
const thingSpeakService = new ThingSpeakService();

export default thingSpeakService; 