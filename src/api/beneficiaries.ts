import { Beneficiary } from '../types';
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

export async function createBeneficiary(
  applicationId: number,
  data: Omit<Beneficiary, 'id' | 'application_id'>,
  token: string
): Promise<Beneficiary> {
  return apiRequest<Beneficiary>(`/applications/${applicationId}/beneficiaries`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}

export async function updateBeneficiary(
  beneficiaryId: number,
  data: Partial<Beneficiary>,
  token: string
): Promise<Beneficiary> {
  return apiRequest<Beneficiary>(`/beneficiaries/${beneficiaryId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}

export async function deleteBeneficiary(
  beneficiaryId: number,
  token: string
): Promise<void> {
  return apiRequest<void>(`/beneficiaries/${beneficiaryId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}