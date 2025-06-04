
// API service for communicating with the Python backend

const API_URL = 'http://localhost:5001';

export interface QueryResponse {
  response: string;
  metadata?: any;
  format?: 'markdown' | 'text';
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
