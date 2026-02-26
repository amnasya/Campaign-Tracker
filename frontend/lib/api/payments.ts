/**
 * Payment API service
 */

import apiClient from './client';
import { DEMO_MODE, demoApi } from './demo-mode';
import type { Payment } from '@/types';

/**
 * Get all payments for a campaign
 */
export async function getCampaignPayments(campaignId: string): Promise<Payment[]> {
  if (DEMO_MODE) {
    const allPayments = await demoApi.payments.getAll();
    return allPayments.filter(p => p.campaignId === campaignId);
  }
  const response = await apiClient.get<Payment[]>(`/payments/campaign/${campaignId}`);
  return response.data;
}

/**
 * Get payments for the authenticated influencer
 */
export async function getMyPayments(): Promise<Payment[]> {
  if (DEMO_MODE) {
    return demoApi.payments.getAll();
  }
  const response = await apiClient.get<Payment[]>('/payments/my-payments');
  return response.data;
}

/**
 * Mark a payment as paid
 */
export async function markPaymentAsPaid(id: string): Promise<Payment> {
  const response = await apiClient.patch<Payment>(`/payments/${id}/mark-paid`);
  return response.data;
}
