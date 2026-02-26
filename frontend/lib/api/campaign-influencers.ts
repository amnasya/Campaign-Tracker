/**
 * Campaign-Influencer API service
 */

import apiClient from './client';
import { DEMO_MODE, demoApi } from './demo-mode';
import type { CampaignInfluencer } from '@/types';

export interface AssignInfluencerDto {
  campaignId: string;
  influencerId: string;
}

export interface SubmitDeliverableDto {
  postUrl: string;
  screenshotUrl: string;
  likes: number;
  comments: number;
}

/**
 * Assign an influencer to a campaign
 */
export async function assignInfluencer(data: AssignInfluencerDto): Promise<CampaignInfluencer> {
  const response = await apiClient.post<CampaignInfluencer>('/campaign-influencers', data);
  return response.data;
}

/**
 * Get campaigns assigned to the authenticated influencer
 */
export async function getMyCampaigns(): Promise<CampaignInfluencer[]> {
  if (DEMO_MODE) {
    return demoApi.campaignInfluencers.getAll();
  }
  const response = await apiClient.get<CampaignInfluencer[]>('/campaign-influencers/my-campaigns');
  return response.data;
}

/**
 * Get all influencers assigned to a campaign
 */
export async function getCampaignInfluencers(campaignId: string): Promise<CampaignInfluencer[]> {
  if (DEMO_MODE) {
    const allInfluencers = await demoApi.campaignInfluencers.getAll();
    return allInfluencers.filter(ci => ci.campaignId === campaignId);
  }
  const response = await apiClient.get<CampaignInfluencer[]>(`/campaign-influencers/campaign/${campaignId}`);
  return response.data;
}

/**
 * Accept a campaign invitation
 */
export async function acceptCampaign(id: string): Promise<CampaignInfluencer> {
  const response = await apiClient.patch<CampaignInfluencer>(`/campaign-influencers/${id}/accept`);
  return response.data;
}

/**
 * Submit deliverable for a campaign
 */
export async function submitDeliverable(id: string, data: SubmitDeliverableDto): Promise<CampaignInfluencer> {
  const response = await apiClient.patch<CampaignInfluencer>(`/campaign-influencers/${id}/submit`, data);
  return response.data;
}

/**
 * Verify an influencer's submission
 */
export async function verifySubmission(id: string): Promise<CampaignInfluencer> {
  const response = await apiClient.patch<CampaignInfluencer>(`/campaign-influencers/${id}/verify`);
  return response.data;
}
