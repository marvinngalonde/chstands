import { User, RegisterData, LoginData, LoginResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    let errorMessage: string;
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorData.message || `HTTP ${response.status}: ${response.statusText}`;
    } catch {
      errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    }
    throw new ApiError(errorMessage, response.status);
  }

  return response.json();
}

export async function registerUser(data: RegisterData): Promise<User> {
  return apiRequest<User>('/register', {
    method: 'POST',
    body: JSON.stringify({
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      password: data.password,
      company_id: data.company_id,
    }),
  });
}

export async function loginUser(data: LoginData): Promise<LoginResponse> {
  const formData = new URLSearchParams();
  formData.append('username', data.email);
  formData.append('password', data.password);

  return fetch(`${API_BASE_URL}/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
  }).then(async (response) => {
    if (!response.ok) {
      let errorMessage: string;
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || 'Login failed';
      } catch {
        errorMessage = 'Login failed';
      }
      throw new ApiError(errorMessage, response.status);
    }
    return response.json();
  });
}

export async function getCurrentUser(token: string): Promise<User> {
  return apiRequest<User>('/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export { ApiError };