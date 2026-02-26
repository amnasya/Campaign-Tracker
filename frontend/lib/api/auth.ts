/**
 * Authentication API service
 */

import apiClient from './client';
import { setToken } from '../auth/token';
import type { AuthResponse, User } from '@/types';
import { DEMO_MODE, demoApi } from './demo-mode';

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  role: 'brand' | 'influencer';
}

export interface LoginDto {
  email: string;
  password: string;
}

/**
 * Register a new user
 */
export async function register(data: RegisterDto): Promise<User> {
  if (DEMO_MODE) {
    return demoApi.auth.register(data);
  }
  const response = await apiClient.post<User>('/auth/register', data);
  return response.data;
}

/**
 * Login with email and password
 */
export async function login(data: LoginDto): Promise<AuthResponse> {
  if (DEMO_MODE) {
    const result = await demoApi.auth.login(data.email, data.password);
    if (result.access_token) {
      setToken(result.access_token);
    }
    return result;
  }
  
  const response = await apiClient.post<AuthResponse>('/auth/login', data);
  
  // Store the token
  if (response.data.access_token) {
    setToken(response.data.access_token);
  }
  
  return response.data;
}

/**
 * Get current user profile
 */
export async function getProfile(): Promise<User> {
  if (DEMO_MODE) {
    return demoApi.auth.getProfile();
  }
  const response = await apiClient.get<User>('/auth/profile');
  return response.data;
}

/**
 * Get users (optionally filtered by role)
 */
export async function getUsers(role?: 'brand' | 'influencer'): Promise<User[]> {
  if (DEMO_MODE) {
    return demoApi.auth.getUsers(role);
  }
  const params = role ? { role } : {};
  const response = await apiClient.get<User[]>('/auth/users', { params });
  return response.data;
}
