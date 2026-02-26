/**
 * File upload API service
 */

import apiClient from './client';

export interface UploadResponse {
  url: string;
}

/**
 * Upload a file to cloud storage
 */
export async function uploadFile(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await apiClient.post<UploadResponse>('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
}
