/**
 * Campaign API service
 */

import apiClient from './client';
import type { Campaign, BrandAnalytics } from '@/types';
import { DEMO_MODE, demoApi } from './demo-mode';

export interface CreateCampaignDto {
  title: string;
  brief: string;
  budget: number;
  deadline: string;
}

export interface UpdateCampaignDto {
  title?: string;
  brief?: string;
  budget?: number;
  deadline?: string;
}

export interface UpdateCampaignStatusDto {
  status: 'draft' | 'active' | 'completed';
}

/**
 * Create a new campaign
 */
export async function createCampaign(data: CreateCampaignDto): Promise<Campaign> {
  if (DEMO_MODE) {
    return demoApi.campaigns.create(data);
  }
  const response = await apiClient.post<Campaign>('/campaigns', data);
  return response.data;
}

/**
 * Get all campaigns for the authenticated brand
 */
export async function getCampaigns(): Promise<Campaign[]> {
  if (DEMO_MODE) {
    return demoApi.campaigns.getAll();
  }
  const response = await apiClient.get<Campaign[]>('/campaigns');
  return response.data;
}

/**
 * Get a single campaign by ID
 */
export async function getCampaign(id: string): Promise<Campaign> {
  if (DEMO_MODE) {
    return demoApi.campaigns.getOne(id);
  }
  const response = await apiClient.get<Campaign>(`/campaigns/${id}`);
  return response.data;
}

/**
 * Update a campaign
 */
export async function updateCampaign(id: string, data: UpdateCampaignDto): Promise<Campaign> {
  if (DEMO_MODE) {
    return demoApi.campaigns.getOne(id); // Return unchanged for demo
  }
  const response = await apiClient.patch<Campaign>(`/campaigns/${id}`, data);
  return response.data;
}

/**
 * Update campaign status
 */
export async function updateCampaignStatus(id: string, data: UpdateCampaignStatusDto): Promise<Campaign> {
  if (DEMO_MODE) {
    return demoApi.campaigns.getOne(id); // Return unchanged for demo
  }
  const response = await apiClient.patch<Campaign>(`/campaigns/${id}/status`, data);
  return response.data;
}

/**
 * Get brand analytics for dashboard
 */
export async function getAnalytics(): Promise<BrandAnalytics> {
  if (DEMO_MODE) {
    return demoApi.campaigns.getAnalytics();
  }
  const response = await apiClient.get<BrandAnalytics>('/campaigns/analytics');
  return response.data;
}
