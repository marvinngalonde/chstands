import { Payment } from '../types';
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

export async function createPayment(
  applicationId: number,
  data: Omit<Payment, 'id' | 'application_id' | 'created_at'>,
  token: string
): Promise<Payment> {
  return apiRequest<Payment>(`/applications/${applicationId}/payments`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}

export async function getApplicationPayments(
  applicationId: number,
  token: string
): Promise<Payment[]> {
  return apiRequest<Payment[]>(`/applications/${applicationId}/payments`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getAllPayments(token: string): Promise<Payment[]> {
  return apiRequest<Payment[]>('/payments', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function updatePayment(
  paymentId: number,
  data: Partial<Payment>,
  token: string
): Promise<Payment> {
  return apiRequest<Payment>(`/payments/${paymentId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}

export async function deletePayment(
  paymentId: number,
  token: string
): Promise<void> {
  return apiRequest<void>(`/payments/${paymentId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}