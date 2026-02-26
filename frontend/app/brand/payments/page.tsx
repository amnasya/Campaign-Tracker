'use client';

/**
 * Brand payments management page
 * Displays all payments across campaigns with mark-as-paid functionality
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DollarSign, CheckCircle, Clock, ExternalLink } from 'lucide-react';
import { BrandLayout } from '@/components/brand/BrandLayout';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getCampaigns } from '@/lib/api/campaigns';
import { getCampaignPayments, markPaymentAsPaid } from '@/lib/api/payments';
import type { Campaign, Payment } from '@/types';

interface PaymentWithCampaign extends Payment {
  campaign?: Campaign;
}

export default function PaymentsPage() {
  const router = useRouter();
  const [payments, setPayments] = useState<PaymentWithCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [markingPaidId, setMarkingPaidId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'paid'>('all');

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      setError(null);

      // First, get all campaigns
      const campaigns = await getCampaigns();

      // Then, get payments for each campaign
      const allPayments: PaymentWithCampaign[] = [];
      
      for (const campaign of campaigns) {
        try {
          const campaignPayments = await getCampaignPayments(campaign.id);
          // Attach campaign info to each payment
          const paymentsWithCampaign = campaignPayments.map((payment) => ({
            ...payment,
            campaign,
          }));
          allPayments.push(...paymentsWithCampaign);
        } catch (err) {
          // Skip campaigns with no payments or errors
          console.error(`Failed to load payments for campaign ${campaign.id}:`, err);
        }
      }

      // Sort by creation date (newest first)
      allPayments.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setPayments(allPayments);
    } catch (err: any) {
      setError(err.message || 'Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsPaid = async (paymentId: string) => {
    try {
      setMarkingPaidId(paymentId);
      await markPaymentAsPaid(paymentId);
      await loadPayments(); // Reload to get updated data
    } catch (err: any) {
      alert(err.message || 'Failed to mark payment as paid');
    } finally {
      setMarkingPaidId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getFilteredPayments = () => {
    if (statusFilter === 'all') return payments;
    return payments.filter((p) => p.status === statusFilter);
  };

  const getTotalStats = () => {
    const pending = payments.filter((p) => p.status === 'pending');
    const paid = payments.filter((p) => p.status === 'paid');
    
    return {
      totalPending: pending.reduce((sum, p) => sum + Number(p.amount), 0),
      totalPaid: paid.reduce((sum, p) => sum + Number(p.amount), 0),
      pendingCount: pending.length,
      paidCount: paid.length,
    };
  };

  if (loading) {
    return (
      <BrandLayout title="Payments" description="Manage influencer payments">
        <Card>
          <CardContent className="pt-6">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 rounded bg-gray-200" />
              ))}
            </div>
          </CardContent>
        </Card>
      </BrandLayout>
    );
  }

  if (error) {
    return (
      <BrandLayout title="Payments" description="Manage influencer payments">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-red-600">{error}</p>
            <div className="mt-4 text-center">
              <Button onClick={loadPayments}>Retry</Button>
            </div>
          </CardContent>
        </Card>
      </BrandLayout>
    );
  }

  const filteredPayments = getFilteredPayments();
  const stats = getTotalStats();

  return (
    <BrandLayout title="Payments" description="Manage influencer payments">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Pending Payments
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">
                    {stats.pendingCount}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Pending Amount
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">
                    {formatCurrency(stats.totalPending)}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                  <DollarSign className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Paid Payments
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">
                    {stats.paidCount}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Paid
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">
                    {formatCurrency(stats.totalPaid)}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payments Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Payment History</CardTitle>
              <div className="flex items-center gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'all' | 'pending' | 'paid')}
                  className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredPayments.length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                {payments.length === 0
                  ? 'No payments yet'
                  : 'No payments match your filter'}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Influencer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Paid Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <button
                          onClick={() =>
                            router.push(`/brand/campaigns/${payment.campaign?.id}`)
                          }
                          className="text-left hover:underline"
                        >
                          <p className="font-medium text-gray-900">
                            {payment.campaign?.title || 'Unknown Campaign'}
                          </p>
                        </button>
                      </TableCell>
                      <TableCell>
                        <p className="text-gray-900">
                          {payment.campaignInfluencer?.influencer?.name || 'Unknown'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {payment.campaignInfluencer?.influencer?.email || ''}
                        </p>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(Number(payment.amount))}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={payment.status}>
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </StatusBadge>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {formatDate(payment.createdAt)}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {payment.paidAt ? formatDate(payment.paidAt) : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        {payment.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => handleMarkAsPaid(payment.id)}
                            disabled={markingPaidId === payment.id}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            {markingPaidId === payment.id ? 'Processing...' : 'Mark as Paid'}
                          </Button>
                        )}
                        {payment.status === 'paid' && (
                          <span className="text-sm text-emerald-600">✓ Paid</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Results Count */}
        {filteredPayments.length > 0 && (
          <p className="text-sm text-gray-500">
            Showing {filteredPayments.length} of {payments.length} payments
          </p>
        )}
      </div>
    </BrandLayout>
  );
}
