
// API service for communicating with the Python backend

const API_URL = 'http://localhost:5001';

export interface QueryResponse {
  response: string;
  metadata?: any;
  format?: 'markdown' | 'text';
}

export interface InspectionFilters {
  machineId?: string;
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

export async function sendQuery(query: string, source?: string, machineId?: string): Promise<QueryResponse> {
  console.log(`sendQuery called with query: ${query}`);
  console.log(`Source: ${source || 'unknown'}`);
  console.log(`Machine ID: ${machineId || 'not provided'}`);
  console.log(`Sending POST request to: ${API_URL}/query`);

  const payload: any = { 
    query,
    source: source || 'unknown',
    responseFormat: 'markdown' // Request markdown format from backend
  };
  
  // Add machine_id to payload if we're on anomaly inspection page and have machine data
  if (source === 'anomaly' && machineId) {
    payload.machine_id = machineId;
    console.log('✅ Added machine_id to query payload:', machineId);
  }
  
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
    
    // Process the response to ensure proper formatting
    let processedResponse = data.response || data;
    
    // If the response is a string that looks like a work order, format it properly
    if (typeof processedResponse === 'string') {
      // Clean up the formatting and convert to markdown
      processedResponse = processedResponse
        .replace(/Page No\. \d+\s+COMPANY NAME\s+PRIORITY: \d+/, '# Work Order Details\n\n**Priority:** 1  \n**Date:** 04/19/2025\n\n')
        .replace(/P\.M\. WORK ORDER No\. (\d+)/, '## Work Order #$1')
        .replace(/WEEK No\. (\d+)\s+WEEK OF: (.+)/, '**Week:** $1 | **Week of:** $2\n\n')
        .replace(/EQUIPMENT I\.D\.: (.+)\s+CATEGORY: (.+)/, '## Equipment Information\n**Equipment ID:** $1  \n**Category:** $2')
        .replace(/EQUIPMENT DESCRIPTION: (.+)/, '**Description:** $1')
        .replace(/LOCATION: BUILDING: (.+)\s+DESCR:/, '**Location:** Building $1')
        .replace(/FLOOR: (.+)/, '**Floor:** $1')
        .replace(/ROOM: (.+)/, '**Room:** $1')
        .replace(/DESCRIPTION: (.+)/, '**Area Description:** $1\n\n')
        .replace(/CALL (.+) TO NOTIFY BEFORE SHUTDOWN\s+SPECIAL INSTRUCTIONS/, '## Special Instructions\n**Emergency Contact:** $1')
        .replace(/SHOP\/VENDOR: (.+)\s+NAME: (.+)/, '**Shop/Vendor:** $1  \n**Department:** $2')
        .replace(/EMPLOYEE:\s+(.+)/, '**Assigned Employee:** $1\n\n')
        .replace(/TASK #: (\d+)\s+DESCRIPTION OF WORK\s+FREQ\./, '## Task #$1 - Work Description\n\n')
        .replace(/(\d+)\.\s+(.+?)(?=\d+\.|PARTS AND COMPONENTS|$)/gs, '**$1.** $2\n\n')
        .replace(/PARTS AND COMPONENTS REQUIRED/, '## Parts and Components Required\n\n')
        .replace(/PART #:\s+QUANTITY PER ASSEMBLY:\s*\n(.+)\s+(.+)\s+(.+)/, '| Part # | Description | Quantity |\n|--------|-------------|----------|\n| $1 | $3 | $2 |')
        .replace(/\*\*Possible Causes of Vibration Anomalies:\*\*/, '\n## Possible Causes of Vibration Anomalies\n\n')
        .replace(/(\d+)\.\s+\*\*(.+?):\*\*\s+(.+?)(?=\d+\.|$)/gs, '**$1. $2:** $3\n\n')
        // Clean up extra whitespace
        .replace(/\n{3,}/g, '\n\n')
        .trim();
    }
    
    return {
      response: processedResponse,
      format: 'markdown' // Ensure the response is marked as markdown for rendering
    };
  } catch (error) {
    console.error('Error querying the API:', error);
    throw error;
  }
}

export async function fetchInspectionData(filters?: InspectionFilters): Promise<GraphData> {
  console.log('🔧 fetchInspectionData called with filters:', filters);
  console.log('🏭 Machine ID from filters:', filters?.machineId);
  console.log('🏷️ Machine name from filters:', filters?.machineName);
  console.log('📡 Sensor type from filters:', filters?.sensorType);
  
  // Build query parameters for API call
  const queryParams = new URLSearchParams();
  
  if (filters?.machineId) {
    queryParams.append('machine_id', filters.machineId);
    console.log('✅ Added machine_id to query params:', filters.machineId);
  } else {
    console.log('❌ No machineId provided in filters');
  }
  
  if (filters?.machineName) {
    queryParams.append('machine_name', filters.machineName);
    console.log('✅ Added machine_name to query params:', filters.machineName);
  } else {
    console.log('❌ No machineName provided in filters');
  }
  
  if (filters?.sensorType) {
    queryParams.append('sensor_type', filters.sensorType);
    console.log('✅ Added sensor_type to query params:', filters.sensorType);
  } else {
    console.log('❌ No sensorType provided in filters');
  }
  
  const url = `${API_URL}/inspection${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  console.log(`🚀 Final URL being called: ${url}`);
  console.log(`📋 Query params string: ${queryParams.toString()}`);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log(`📡 Response status: ${response.status}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('📊 Raw backend response:', JSON.stringify(data, null, 2));
    console.log('📈 Data type received:', data.data_type);
    console.log('📋 Title:', data.title);
    
    if (data.data_type === 'multi') {
      console.log('🔢 Multi-value data points:', data.multi_value_data?.length || 0);
      console.log('🔍 First multi-value data point:', data.multi_value_data?.[0]);
    } else {
      console.log('📈 Single-value data points:', data.vibration_data?.length || 0);
      console.log('🔍 First single-value data point:', data.vibration_data?.[0]);
    }
    
    // Fix the anomalies logging - ensure we handle both array and undefined cases
    const anomaliesArray = Array.isArray(data.anomalies) ? data.anomalies : [];
    console.log('⚠️ Anomalies count:', anomaliesArray.length);
    console.log('⚠️ Anomalies data:', anomaliesArray);
    
    // Ensure anomalies is always an array in the returned data
    return {
      ...data,
      anomalies: anomaliesArray
    };
  } catch (error) {
    console.error('❌ Error fetching inspection data:', error);
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
