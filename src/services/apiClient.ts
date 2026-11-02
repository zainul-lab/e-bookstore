import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const REQUEST_TIMEOUT = 10000;

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const createApiClient = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: REQUEST_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      console.error('Request interceptor error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      let apiError: ApiError;

      if (error.response) {
        // Server responded with error status
        apiError = new ApiError(
          error.response.status,
          (error.response.data as any)?.message || error.message,
          error.response.data
        );
      } else if (error.request) {
        // Request made but no response
        apiError = new ApiError(
          0,
          'Network error: No response from server. Please check your connection.',
          error
        );
      } else {
        // Error in request setup
        apiError = new ApiError(
          0,
          'Failed to process request',
          error
        );
      }

      console.error('API Error:', apiError);
      return Promise.reject(apiError);
    }
  );

  return instance;
};

export const apiClient = createApiClient();
