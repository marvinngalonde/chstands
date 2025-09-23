import { Application, ApplicationWithRelations } from '../types';
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

export async function createApplication(
  data: Omit<Application, 'id' | 'user_id' | 'status' | 'created_at'>,
  token: string
): Promise<Application> {
  return apiRequest<Application>('/applications/', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}

export async function getUserApplications(token: string): Promise<ApplicationWithRelations[]> {
  return apiRequest<ApplicationWithRelations[]>('/applications/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getApplicationById(
  applicationId: number,
  token: string
): Promise<ApplicationWithRelations> {
  return apiRequest<ApplicationWithRelations>(`/applications/${applicationId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function updateApplication(
  applicationId: number,
  data: Partial<Application>,
  token: string
): Promise<Application> {
  return apiRequest<Application>(`/applications/${applicationId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}

export async function deleteApplication(
  applicationId: number,
  token: string
): Promise<void> {
  return apiRequest<void>(`/applications/${applicationId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// Admin only endpoints
export async function getAllApplications(token: string): Promise<ApplicationWithRelations[]> {
  return apiRequest<ApplicationWithRelations[]>('/applications/', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function updateApplicationStatus(
  applicationId: number,
  status: 'NOT YET APPROVED' | 'APPROVED' | 'DISAPPROVED',
  token: string
): Promise<Application> {
  return apiRequest<Application>(`/applications/${applicationId}/status`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
}