import { ApiError } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export interface Company {
  id: number;
  name: string;
  description?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  is_active: number;
  created_at: string;
}

export interface CompanyCreate {
  name: string;
  description?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  is_active?: number;
}

export interface CompanyUpdate {
  name?: string;
  description?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  is_active?: number;
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

export async function getAllCompaniesPublic(
  params?: { skip?: number; limit?: number; active_only?: boolean }
): Promise<Company[]> {
  const searchParams = new URLSearchParams();
  if (params?.skip !== undefined) searchParams.append('skip', params.skip.toString());
  if (params?.limit !== undefined) searchParams.append('limit', params.limit.toString());
  if (params?.active_only !== undefined) searchParams.append('active_only', params.active_only.toString());

  const url = `/companies/public${searchParams.toString() ? '?' + searchParams.toString() : ''}`;

  return apiRequest<Company[]>(url, {
    method: 'GET',
  });
}

export async function getAllCompanies(
  token: string,
  params?: { skip?: number; limit?: number; active_only?: boolean }
): Promise<Company[]> {
  const searchParams = new URLSearchParams();
  if (params?.skip !== undefined) searchParams.append('skip', params.skip.toString());
  if (params?.limit !== undefined) searchParams.append('limit', params.limit.toString());
  if (params?.active_only !== undefined) searchParams.append('active_only', params.active_only.toString());

  const url = `/companies/${searchParams.toString() ? '?' + searchParams.toString() : ''}`;

  return apiRequest<Company[]>(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getCompanyById(
  companyId: number,
  token: string
): Promise<Company> {
  return apiRequest<Company>(`/companies/${companyId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function createCompany(
  data: CompanyCreate,
  token: string
): Promise<Company> {
  return apiRequest<Company>('/companies/', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}

export async function updateCompany(
  companyId: number,
  data: CompanyUpdate,
  token: string
): Promise<Company> {
  return apiRequest<Company>(`/companies/${companyId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}

export async function deleteCompany(
  companyId: number,
  token: string
): Promise<void> {
  return apiRequest<void>(`/companies/${companyId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}