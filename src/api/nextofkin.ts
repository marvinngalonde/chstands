import { NextOfKin } from '../types';
import { ApiError } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

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

export async function createNextOfKin(
  applicationId: number,
  data: Omit<NextOfKin, 'id' | 'application_id'>,
  token: string
): Promise<NextOfKin> {
  return apiRequest<NextOfKin>(`/applications/${applicationId}/next-of-kin`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}

export async function updateNextOfKin(
  applicationId: number,
  data: Partial<NextOfKin>,
  token: string
): Promise<NextOfKin> {
  return apiRequest<NextOfKin>(`/applications/${applicationId}/next-of-kin`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}

export async function deleteNextOfKin(
  applicationId: number,
  token: string
): Promise<void> {
  return apiRequest<void>(`/applications/${applicationId}/next-of-kin`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}