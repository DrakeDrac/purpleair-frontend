let BASE_URL = 'https://weather.mojserver.fun';
// BASE_URL = 'http://localhost:3000';

export interface User {
  id: number;
  username: string;
}

export interface AuthResponse {
  message?: string;
  token?: string;
  user?: User;
}

export interface AiAnalyzeResponse {
  weather: string;
  suggestions: {
    cloth: string;
    game: string;
    smart_suggestion: string;
    short_response_to_weather: string;
  };
}

export interface Sensor {
  sensor_index: number;
  name: string;
  latitude: number;
  longitude: number;
  pm2_5: number;
  temperature?: number;
  humidity?: number;
  // Add other fields as necessary from specific endpoints
}

export interface SensorListResponse {
  api_version: string;
  time_stamp: number;
  data_time_stamp: number;
  fields: string[];
  data: Array<any[]>; // Array of arrays as per PurpleAir format
}

export interface ApiError {
  error: {
    message: string;
    status: number;
    type?: string;
  };
}

export interface CitySearchResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

export interface CitySearchResponse {
  results: CitySearchResult[];
}

export interface LocationWeatherResponse {
  location: {
    city: string;
    latitude: number;
    longitude: number;
    country: string;
  };
  weather: {
    temperature: string;
    feels_like: string;
    humidity: string;
    condition: string;
    is_day: boolean;
    precipitation: number;
    snowfall: number;
    wind_speed: string;
    cloud_cover: string;
    visibility: string;
    temp_max: string;
    temp_min: string;
  };
  air_quality: {
    aqi: number;
    pm2_5: number;
    pm10: number;
    uv_index: number;
  };
  source: string;
}

export interface WeatherSource {
  id: string;
  name: string;
}

export interface WeatherSourcesResponse {
  sources: WeatherSource[];
}

export interface FeedbackPayload {
  feedback: string;
  rating?: number;
  location: {
    lat: number;
    lon: number;
  };
  api_source?: string;
  user_id?: string;
}

export interface FeedbackResponse {
  message: string;
}


class ApiClient {
  private getHeaders(includeAuth = false): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = localStorage.getItem('weatherAppToken');
      if (token && token !== 'guest_token') {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorStr = await response.text();
      try {
        const errorJson: ApiError = JSON.parse(errorStr);
        throw new Error(errorJson.error?.message || 'An error occurred');
      } catch (e) {
        throw new Error(errorStr || `Error: ${response.status} ${response.statusText}`);
      }
    }
    return response.json();
  }

  // --- Auth Endpoints ---

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
    return this.handleResponse<{ user: User }>(response);
  }

  // --- AI Weather Analysis ---

  async analyzeWeather(weather_data: any, model = 'gemini-2.5-flash') {
    const response = await fetch(`${BASE_URL}/api/ai/analyze-weather`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify({
        weather_data,
        model
      }),
    });
    return this.handleResponse<AiAnalyzeResponse>(response);
  }



  // --- Location & Weather ---

  async searchCities(query: string): Promise<CitySearchResponse> {
    const params = new URLSearchParams({ q: query });
    const response = await fetch(`${BASE_URL}/api/location/search?${params}`, {
      method: 'GET',
      headers: this.getHeaders(), // Ops auth maybe not needed but harmless
    });
    return this.handleResponse<CitySearchResponse>(response);
  }

  async getLocationWeather(lat: number, lon: number, api_source?: string): Promise<LocationWeatherResponse> {
    const params = new URLSearchParams({ lat: lat.toString(), lon: lon.toString() });
    if (api_source) {
      params.append('api_source', api_source);
    }
    const response = await fetch(`${BASE_URL}/api/location/weather?${params}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse<LocationWeatherResponse>(response);
  }

  async getWeatherSources(): Promise<WeatherSourcesResponse> {
    const response = await fetch(`${BASE_URL}/api/location/sources`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse<WeatherSourcesResponse>(response);
  }

  async submitFeedback(payload: FeedbackPayload): Promise<FeedbackResponse> {
    const response = await fetch(`${BASE_URL}/api/feedback`, {
      method: 'POST',
      headers: this.getHeaders(true), // Feedback might benefit from auth if available, but optional based on spec
      body: JSON.stringify(payload),
    });
    return this.handleResponse<FeedbackResponse>(response);
  }

  // --- PurpleAir Data ---

  async getSensors(fields?: string, location_type?: number) {
    const params = new URLSearchParams();
    if (fields) params.append('fields', fields);
    if (location_type !== undefined) params.append('location_type', location_type.toString());

    const response = await fetch(`${BASE_URL}/api/purpleair/sensors?${params}`, {
      headers: this.getHeaders(true),
    });
    return this.handleResponse<SensorListResponse>(response);
  }

  async getSensorByIndex(sensorIndex: number) {
    const response = await fetch(`${BASE_URL}/api/purpleair/sensors/${sensorIndex}`, {
      headers: this.getHeaders(true),
    });
    return this.handleResponse<{ sensor: Sensor }>(response);
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
    return this.handleResponse<{ data: any[], fields: string[] }>(response);
  }

  async getGroups() {
    const response = await fetch(`${BASE_URL}/api/purpleair/groups`, {
      headers: this.getHeaders(true),
    });
    return this.handleResponse<{ data: any[], fields: string[] }>(response);
  }
}

export const apiClient = new ApiClient();
