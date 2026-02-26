/**
 * Core type definitions for the Influencer Campaign Tracker
 * 
 * These types match the backend Prisma schema and API responses
 */

// Enums matching backend
export enum Role {
  BRAND = 'brand',
  INFLUENCER = 'influencer',
}

export enum CampaignStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

export enum WorkflowStatus {
  INVITED = 'invited',
  ACCEPTED = 'accepted',
  SUBMITTED = 'submitted',
  VERIFIED = 'verified',
  PAID = 'paid',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
}

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

// Campaign types
export interface Campaign {
  id: string;
  brandId: string;
  title: string;
  brief: string;
  budget: number;
  deadline: string;
  status: CampaignStatus;
  createdAt: string;
  updatedAt: string;
}

// Campaign-Influencer relationship
export interface CampaignInfluencer {
  id: string;
  campaignId: string;
  influencerId: string;
  status: WorkflowStatus;
  postUrl?: string;
  screenshotUrl?: string;
  likes?: number;
  comments?: number;
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
  campaign?: Campaign;
  influencer?: User;
}

// Payment types
export interface Payment {
  id: string;
  campaignInfluencerId: string;
  amount: number;
  status: PaymentStatus;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
  campaignInfluencer?: CampaignInfluencer;
}

// API Response types
export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
}

// Analytics types
export interface BrandAnalytics {
  totalCampaigns: number;
  totalInfluencers: number;
  pendingVerifications: number;
  totalSpend: number;
}
