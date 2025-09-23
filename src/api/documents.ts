import { Document } from '../types';
import { ApiError } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export async function uploadDocument(
  applicationId: number,
  file: File,
  kind: 'ID_SCAN' | 'PROOF_OF_RESIDENCE' | 'PAYSLIP' | 'SIGNATURE',
  token: string
): Promise<Document> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('kind', kind);

  const response = await fetch(`${API_BASE_URL}/documents/upload?application_id=${applicationId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    let errorMessage: string;
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorData.message || 'Failed to upload document';
    } catch {
      errorMessage = 'Failed to upload document';
    }
    throw new ApiError(errorMessage, response.status);
  }

  return response.json();
}

export async function getApplicationDocuments(
  applicationId: number,
  token: string
): Promise<Document[]> {
  const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/documents`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    let errorMessage: string;
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorData.message || 'Failed to fetch documents';
    } catch {
      errorMessage = 'Failed to fetch documents';
    }
    throw new ApiError(errorMessage, response.status);
  }

  return response.json();
}

export async function deleteDocument(
  documentId: number,
  token: string
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/documents/${documentId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    let errorMessage: string;
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorData.message || 'Failed to delete document';
    } catch {
      errorMessage = 'Failed to delete document';
    }
    throw new ApiError(errorMessage, response.status);
  }
}