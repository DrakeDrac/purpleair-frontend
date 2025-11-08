const BASE_URL = 'http://localhost:3000';

interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: number;
    username: string;
  };
}

interface ApiError {
  error: {
    message: string;
    status: number;
    type?: string;
  };
}

class ApiClient {
  private getHeaders(includeAuth = false): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = localStorage.getItem('weatherAppToken');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.error.message || 'An error occurred');
    }
    return response.json();
  }

  // Auth endpoints
  async login(username: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ username, password }),
    });
    return this.handleResponse<AuthResponse>(response);
  }

  async register(username: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ username, password }),
    });
    return this.handleResponse<AuthResponse>(response);
  }

  async getCurrentUser() {
    const response = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: this.getHeaders(true),
    });
    return this.handleResponse(response);
  }

  // Health check
  async healthCheck() {
    const response = await fetch(`${BASE_URL}/health`);
    return this.handleResponse(response);
  }

  // Sensors
  async getSensors(fields?: string, location_type?: number) {
    const params = new URLSearchParams();
    if (fields) params.append('fields', fields);
    if (location_type !== undefined) params.append('location_type', location_type.toString());
    
    const response = await fetch(`${BASE_URL}/api/purpleair/sensors?${params}`, {
      headers: this.getHeaders(true),
    });
    return this.handleResponse(response);
  }

  async getSensorByIndex(sensorIndex: number, fields?: string) {
    const params = new URLSearchParams();
    if (fields) params.append('fields', fields);
    
    const response = await fetch(`${BASE_URL}/api/purpleair/sensors/${sensorIndex}?${params}`, {
      headers: this.getHeaders(true),
    });
    return this.handleResponse(response);
  }

  async getSensorHistory(
    sensorIndex: number,
    start_timestamp: number,
    end_timestamp: number,
    fields?: string,
    average?: number
  ) {
    const params = new URLSearchParams({
      start_timestamp: start_timestamp.toString(),
      end_timestamp: end_timestamp.toString(),
    });
    if (fields) params.append('fields', fields);
    if (average) params.append('average', average.toString());
    
    const response = await fetch(`${BASE_URL}/api/purpleair/sensors/${sensorIndex}/history?${params}`, {
      headers: this.getHeaders(true),
    });
    return this.handleResponse(response);
  }

  async getSensorHistoryCSV(
    sensorIndex: number,
    start_timestamp: number,
    end_timestamp: number,
    fields?: string
  ): Promise<string> {
    const params = new URLSearchParams({
      start_timestamp: start_timestamp.toString(),
      end_timestamp: end_timestamp.toString(),
    });
    if (fields) params.append('fields', fields);
    
    const response = await fetch(`${BASE_URL}/api/purpleair/sensors/${sensorIndex}/history/csv?${params}`, {
      headers: this.getHeaders(true),
    });
    
    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.error.message || 'An error occurred');
    }
    
    return response.text();
  }

  // Groups
  async getGroups(fields?: string, group_id?: number) {
    const params = new URLSearchParams();
    if (fields) params.append('fields', fields);
    if (group_id) params.append('group_id', group_id.toString());
    
    const response = await fetch(`${BASE_URL}/api/purpleair/groups?${params}`, {
      headers: this.getHeaders(true),
    });
    return this.handleResponse(response);
  }

  // AI endpoints (placeholders)
  async aiChat(message: string, model = 'openai/gpt-3.5-turbo', temperature = 0.7) {
    const response = await fetch(`${BASE_URL}/api/ai/chat`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify({ message, model, temperature }),
    });
    return this.handleResponse(response);
  }

  async getAIModels() {
    const response = await fetch(`${BASE_URL}/api/ai/models`, {
      headers: this.getHeaders(true),
    });
    return this.handleResponse(response);
  }

  async analyzeWeather(sensor_data: any, analysis_type = 'general', model = 'openai/gpt-3.5-turbo') {
    const response = await fetch(`${BASE_URL}/api/ai/analyze-weather`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify({ sensor_data, analysis_type, model }),
    });
    return this.handleResponse(response);
  }
}

export const apiClient = new ApiClient();
