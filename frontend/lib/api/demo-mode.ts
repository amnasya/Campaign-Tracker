/**
 * Demo mode API client - uses mock data instead of real backend
 * Enable this to run frontend without backend
 */

import { mockApiResponses } from './mock-data';

export const DEMO_MODE = false; // Set to false when backend is ready

export const demoApi = {
  auth: {
    login: mockApiResponses.login,
    register: mockApiResponses.register,
    getProfile: mockApiResponses.getProfile,
    getUsers: mockApiResponses.getUsers,
  },
  campaigns: {
    getAll: mockApiResponses.getCampaigns,
    getOne: mockApiResponses.getCampaign,
    getAnalytics: mockApiResponses.getAnalytics,
    create: mockApiResponses.createCampaign,
  },
  campaignInfluencers: {
    getAll: mockApiResponses.getCampaignInfluencers,
  },
  payments: {
    getAll: mockApiResponses.getPayments,
  },
};
