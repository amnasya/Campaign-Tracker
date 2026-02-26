'use client';

/**
 * Influencer Payments Page
 * Displays payment history and status for all campaigns
 */

import { useEffect, useState } from 'react';
import { InfluencerLayout } from '@/components/influencer';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { Input } from '@/components/ui/input';
import { getMyPayments } from '@/lib/api/payments';
import { getMyCampaigns } from '@/lib/api/campaign-influencers';
import { 
  DollarSign, 
  Search, 
  Calendar,
  TrendingUp,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import type { Payment, CampaignInfluencer } from '@/types';

interface PaymentWithCampaign extends Payment {
  campaign?: {
    title: string;
    budget: number;
  };
}

export default function InfluencerPaymentsPage() {
  const [payments, setPayments] = useState<PaymentWithCampaign[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignInfluencer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'paid'>('all');

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const [paymentsData, campaignsData] = await Promise.all([
        getMyPayments(),
        getMyCampaigns(),
      ]);

      // Enrich payments with campaign information
      const enrichedPayments = paymentsData.map((payment) => {
        const campaignInfluencer = campaignsData.find(
          (ci) => ci.id === payment.campaignInfluencerId
        );
        return {
          ...payment,
          campaign: campaignInfluencer?.campaign
            ? {
                title: campaignInfluencer.campaign.title,
                budget: campaignInfluencer.campaign.budget,
              }
            : undefined,
        };
      });

      setPayments(enrichedPayments);
      setCampaigns(campaignsData);
    } catch (error) {
      console.error('Failed to load payments:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate summary metrics
  const totalEarnings = payments
    .filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + Number(p.amount), 0);
  
  const pendingAmount = payments
    .filter((p) => p.status === 'pending')
    .reduce((sum, p) => sum + Number(p.amount), 0);
  
  const paidCount = payments.filter((p) => p.status === 'paid').length;
  const pendingCount = payments.filter((p) => p.status === 'pending').length;

  // Filter payments
  const filteredPayments = payments.filter((payment) => {
    // Filter by status
    if (filterStatus !== 'all' && payment.status !== filterStatus) {
      return false;
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const campaignTitle = payment.campaign?.title?.toLowerCase() || '';
      const amount = payment.amount.toString();
      return campaignTitle.includes(query) || amount.includes(query);
    }

    return true;
  });

  // Sort by date (newest first)
  const sortedPayments = [...filteredPayments].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (loading) {
    return (
      <InfluencerLayout title="Payments" description="Track your earnings">
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="p-6">
                <div className="h-20 animate-pulse rounded bg-gray-200" />
              </Card>
            ))}
          </div>
        </div>
      </InfluencerLayout>
    );
  }

  return (
    <InfluencerLayout title="Payments" description="Track your earnings">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Earnings</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">
                  ${totalEarnings.toFixed(2)}
                </p>
                <p className="mt-1 text-sm text-gray-500">{paidCount} payments</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50">
                <DollarSign className="h-6 w-6 text-emerald-500" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">
                  ${pendingAmount.toFixed(2)}
                </p>
                <p className="mt-1 text-sm text-gray-500">{pendingCount} payments</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-50">
                <Clock className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Average Payment</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">
                  ${payments.length > 0 ? (totalEarnings / paidCount || 0).toFixed(2) : '0.00'}
                </p>
                <p className="mt-1 text-sm text-gray-500">Per campaign</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
                <TrendingUp className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  filterStatus === 'all'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({payments.length})
              </button>
              <button
                onClick={() => setFilterStatus('paid')}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  filterStatus === 'paid'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Paid ({paidCount})
              </button>
              <button
                onClick={() => setFilterStatus('pending')}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  filterStatus === 'pending'
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pending ({pendingCount})
              </button>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </Card>

        {/* Payments List */}
        <Card className="overflow-hidden">
          {sortedPayments.length === 0 ? (
            <div className="p-12 text-center">
              <DollarSign className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-2 text-sm text-gray-500">
                {searchQuery || filterStatus !== 'all'
                  ? 'No payments found matching your filters'
                  : 'No payments yet'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Campaign
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {sortedPayments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="transition-colors hover:bg-gray-50"
                    >
                      <td className="whitespace-nowrap px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {payment.campaign?.title || 'Unknown Campaign'}
                          </p>
                          <p className="text-sm text-gray-500">
                            Budget: ${Number(payment.campaign?.budget || 0).toFixed(2)}
                          </p>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <p className="text-lg font-semibold text-gray-900">
                          ${Number(payment.amount).toFixed(2)}
                        </p>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <StatusBadge
                          status={payment.status === 'paid' ? 'paid' : 'submitted'}
                        />
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          {payment.paidAt
                            ? new Date(payment.paidAt).toLocaleDateString()
                            : new Date(payment.createdAt).toLocaleDateString()}
                        </div>
                        {payment.paidAt && (
                          <p className="text-xs text-gray-400">
                            Paid on {new Date(payment.paidAt).toLocaleDateString()}
                          </p>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <Link
                          href={`/influencer/campaigns/${payment.campaignInfluencerId}`}
                          className="text-sm font-medium text-blue-600 hover:text-blue-700"
                        >
                          View Campaign
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Payment Timeline (Recent Activity) */}
        {sortedPayments.length > 0 && (
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Recent Activity</h3>
            <div className="space-y-4">
              {sortedPayments.slice(0, 5).map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between border-l-4 border-gray-200 pl-4"
                  style={{
                    borderLeftColor: payment.status === 'paid' ? '#10B981' : '#F59E0B',
                  }}
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {payment.campaign?.title || 'Unknown Campaign'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {payment.status === 'paid' ? 'Payment received' : 'Payment pending'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ${Number(payment.amount).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {payment.paidAt
                        ? new Date(payment.paidAt).toLocaleDateString()
                        : new Date(payment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </InfluencerLayout>
  );
}
