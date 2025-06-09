
// API service for communicating with the Python backend

const API_URL = 'http://localhost:5001';

export interface QueryResponse {
  response: string;
  metadata?: any;
  format?: 'markdown' | 'text';
}

export interface InspectionFilters {
  machineName?: string;
  sensorType?: string;
}

export interface MultiValueDataPoint {
  timestamp: string;
  value1: number;
  value2: number;
  value3: number;
}

export interface SingleValueDataPoint {
  timestamp: string;
  value: number;
}

export interface Anomaly {
  start: string;
  end: string;
}

export interface GraphData {
  title: string;
  x_label: string;
  y_label: string;
  x_tick_labels: string[];
  vibration_data?: SingleValueDataPoint[];
  multi_value_data?: MultiValueDataPoint[];
  anomalies: Anomaly[];
  data_type: 'single' | 'multi';
}

export async function sendQuery(query: string, source?: string): Promise<QueryResponse> {
  console.log(`sendQuery called with query: ${query}`);
  console.log(`Source: ${source || 'unknown'}`);
  console.log(`Sending POST request to: ${API_URL}/query`);

  const payload = { 
    query,
    source: source || 'unknown',
    responseFormat: 'markdown' // Request markdown format from backend
  };
  
  console.log('Request payload:', JSON.stringify(payload, null, 2));

  try {
    const response = await fetch(`${API_URL}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log(`Response status: ${response.status}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Response data:', data);
    return {
      ...data,
      format: 'markdown' // Ensure the response is marked as markdown for rendering
    };
  } catch (error) {
    console.error('Error querying the API:', error);
    throw error;
  }
}

export async function fetchInspectionData(filters?: InspectionFilters): Promise<GraphData> {
  console.log('fetchInspectionData called with filters:', filters);
  
  // Check if this is a current sensor type request
  if (filters?.sensorType?.toLowerCase() === 'current') {
    console.log('Returning hardcoded current sensor data');
    
    // Generate sample multi-value data for current sensor
    const now = new Date();
    const multiValueData: MultiValueDataPoint[] = [];
    
    for (let i = 0; i < 50; i++) {
      const timestamp = new Date(now.getTime() - (49 - i) * 30000); // 30 second intervals
      multiValueData.push({
        timestamp: timestamp.toISOString(),
        value1: 15 + Math.sin(i * 0.3) * 5 + Math.random() * 2, // Current Phase A
        value2: 14 + Math.cos(i * 0.25) * 4 + Math.random() * 2, // Current Phase B  
        value3: 16 + Math.sin(i * 0.35 + 1) * 3 + Math.random() * 2, // Current Phase C
      });
    }
    
    return {
      title: `${filters.machineName || 'Machine'} - Current Sensor Data`,
      x_label: 'Time',
      y_label: 'Current (A)',
      x_tick_labels: [],
      multi_value_data: multiValueData,
      data_type: 'multi',
      anomalies: [
        {
          start: new Date(now.getTime() - 600000).toISOString(), // 10 minutes ago
          end: new Date(now.getTime() - 480000).toISOString(), // 8 minutes ago
        },
        {
          start: new Date(now.getTime() - 180000).toISOString(), // 3 minutes ago
          end: new Date(now.getTime() - 120000).toISOString(), // 2 minutes ago
        }
      ]
    };
  }
  
  // Build query parameters for regular API call
  const queryParams = new URLSearchParams();
  if (filters?.machineName) {
    queryParams.append('machine_name', filters.machineName);
  }
  if (filters?.sensorType) {
    queryParams.append('sensor_type', filters.sensorType);
  }
  
  const url = `${API_URL}/inspection${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  console.log(`Sending GET request to: ${url}`);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log(`Response status: ${response.status}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Inspection data:', data);
    
    return data;
  } catch (error) {
    console.error('Error fetching inspection data:', error);
    throw error;
  }
}

export async function checkBackendStatus(): Promise<boolean> {
  console.log('checkBackendStatus called');
  console.log(`Attempting to fetch: ${API_URL}/status`);
  try {
    const response = await fetch(`${API_URL}/status`, {
      method: 'GET',
    });
    console.log(`Response status: ${response.status}`);
    return response.ok;
  } catch (error) {
    console.error('Backend connection error:', error);
    return false;
  }
}
