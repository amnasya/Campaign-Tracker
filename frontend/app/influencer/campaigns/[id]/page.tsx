'use client';

/**
 * Influencer Campaign Detail Page
 * Displays campaign details with actions based on current status
 */

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { InfluencerLayout } from '@/components/influencer';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { getMyCampaigns, acceptCampaign } from '@/lib/api/campaign-influencers';
import { getMyPayments } from '@/lib/api/payments';
import { 
  Calendar, 
  DollarSign, 
  FileText, 
  CheckCircle, 
  Upload,
  ExternalLink,
  ThumbsUp,
  MessageCircle
} from 'lucide-react';
import Link from 'next/link';
import type { CampaignInfluencer, Payment, WorkflowStatus } from '@/types';

export default function InfluencerCampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const campaignInfluencerId = params.id as string;

  const [campaignInfluencer, setCampaignInfluencer] = useState<CampaignInfluencer | null>(null);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    loadCampaignDetails();
  }, [campaignInfluencerId]);

  const loadCampaignDetails = async () => {
    try {
      setLoading(true);
      const [campaigns, payments] = await Promise.all([
        getMyCampaigns(),
        getMyPayments(),
      ]);

      const campaign = campaigns.find((c) => c.id === campaignInfluencerId);
      if (!campaign) {
        router.push('/influencer/campaigns');
        return;
      }

      setCampaignInfluencer(campaign);

      // Find associated payment
      const associatedPayment = payments.find(
        (p) => p.campaignInfluencerId === campaignInfluencerId
      );
      setPayment(associatedPayment || null);
    } catch (error) {
      console.error('Failed to load campaign details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptCampaign = async () => {
    if (!campaignInfluencer) return;

    try {
      setAccepting(true);
      await acceptCampaign(campaignInfluencer.id);
      await loadCampaignDetails();
    } catch (error) {
      console.error('Failed to accept campaign:', error);
      alert('Failed to accept campaign. Please try again.');
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <InfluencerLayout title="Campaign Details" description="Loading...">
        <div className="space-y-6">
          <Card className="p-6">
            <div className="h-64 animate-pulse rounded bg-gray-200" />
          </Card>
        </div>
      </InfluencerLayout>
    );
  }

  if (!campaignInfluencer) {
    return (
      <InfluencerLayout title="Campaign Not Found">
        <Card className="p-6">
          <p className="text-gray-500">Campaign not found.</p>
        </Card>
      </InfluencerLayout>
    );
  }

  const campaign = campaignInfluencer.campaign!;
  const status = campaignInfluencer.status as WorkflowStatus;
  const canAccept = status === 'invited';
  const canSubmit = status === 'accepted';
  const isSubmitted = status === 'submitted' || status === 'verified' || status === 'paid';
  const isVerified = status === 'verified' || status === 'paid';
  const isPaid = status === 'paid';

  return (
    <InfluencerLayout 
      title={campaign.title}
      description="Campaign Details"
    >
      <div className="space-y-6">
        {/* Status and Actions */}
        <Card className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-gray-900">Campaign Status</h2>
                <StatusBadge status={status} />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                {canAccept && 'You have been invited to this campaign'}
                {canSubmit && 'Ready to submit your deliverable'}
                {status === 'submitted' && 'Waiting for brand verification'}
                {isVerified && !isPaid && 'Verified! Payment is being processed'}
                {isPaid && 'Campaign completed and paid'}
              </p>
            </div>
            <div className="flex gap-3">
              {canAccept && (
                <Button 
                  onClick={handleAcceptCampaign}
                  disabled={accepting}
                  className="w-full sm:w-auto"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {accepting ? 'Accepting...' : 'Accept Campaign'}
                </Button>
              )}
              {canSubmit && (
                <Link href={`/influencer/campaigns/${campaignInfluencer.id}/submit`}>
                  <Button className="w-full sm:w-auto">
                    <Upload className="mr-2 h-4 w-4" />
                    Submit Deliverable
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Campaign Details */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Campaign Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Brief</label>
                  <p className="mt-1 text-gray-900">{campaign.brief}</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Budget</label>
                    <div className="mt-1 flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <p className="text-lg font-semibold text-gray-900">
                        ${Number(campaign.budget).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Deadline</label>
                    <div className="mt-1 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <p className="text-gray-900">
                        {new Date(campaign.deadline).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Campaign Status</label>
                  <p className="mt-1 text-gray-900 capitalize">{campaign.status}</p>
                </div>
              </div>
            </Card>

            {/* Submission Details */}
            {isSubmitted && (
              <Card className="mt-6 p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Your Submission</h3>
                
                <div className="space-y-4">
                  {campaignInfluencer.postUrl && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Post URL</label>
                      <a
                        href={campaignInfluencer.postUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 flex items-center gap-2 text-blue-600 hover:text-blue-700"
                      >
                        {campaignInfluencer.postUrl}
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  )}

                  {campaignInfluencer.screenshotUrl && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Screenshot</label>
                      <div className="mt-2">
                        <img
                          src={campaignInfluencer.screenshotUrl}
                          alt="Post screenshot"
                          className="max-h-96 rounded-lg border border-gray-200"
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Likes</label>
                      <div className="mt-1 flex items-center gap-2">
                        <ThumbsUp className="h-4 w-4 text-gray-400" />
                        <p className="text-lg font-semibold text-gray-900">
                          {campaignInfluencer.likes?.toLocaleString() || 0}
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500">Comments</label>
                      <div className="mt-1 flex items-center gap-2">
                        <MessageCircle className="h-4 w-4 text-gray-400" />
                        <p className="text-lg font-semibold text-gray-900">
                          {campaignInfluencer.comments?.toLocaleString() || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  {campaignInfluencer.submittedAt && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Submitted At</label>
                      <p className="mt-1 text-gray-900">
                        {new Date(campaignInfluencer.submittedAt).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>

          {/* Payment Information */}
          <div>
            <Card className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Payment Status</h3>
              
              {payment ? (
                <div className="space-y-4">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <label className="text-sm font-medium text-gray-500">Amount</label>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">
                      ${Number(payment.amount).toFixed(2)}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <div className="mt-1">
                      <StatusBadge 
                        status={payment.status === 'paid' ? 'paid' : 'submitted'} 
                      />
                    </div>
                  </div>

                  {payment.paidAt && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Paid At</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(payment.paidAt).toLocaleString()}
                      </p>
                    </div>
                  )}

                  {payment.status === 'pending' && (
                    <div className="rounded-lg bg-amber-50 p-3">
                      <p className="text-sm text-amber-800">
                        Payment is pending. You'll be notified once it's processed.
                      </p>
                    </div>
                  )}

                  {payment.status === 'paid' && (
                    <div className="rounded-lg bg-emerald-50 p-3">
                      <p className="text-sm text-emerald-800">
                        Payment has been completed!
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-lg bg-gray-50 p-4 text-center">
                  <DollarSign className="mx-auto h-8 w-8 text-gray-300" />
                  <p className="mt-2 text-sm text-gray-500">
                    {status === 'invited' && 'Accept the campaign to see payment details'}
                    {status === 'accepted' && 'Submit your deliverable to initiate payment'}
                    {status === 'submitted' && 'Payment will be created after verification'}
                  </p>
                </div>
              )}
            </Card>

            {/* Timeline */}
            <Card className="mt-6 p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Timeline</h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className={`mt-1 h-2 w-2 rounded-full ${status !== 'invited' ? 'bg-blue-500' : 'bg-gray-300'}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Invited</p>
                    <p className="text-xs text-gray-500">
                      {new Date(campaignInfluencer.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className={`mt-1 h-2 w-2 rounded-full ${status === 'accepted' || status === 'submitted' || status === 'verified' || status === 'paid' ? 'bg-blue-500' : 'bg-gray-300'}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Accepted</p>
                    {status !== 'invited' && (
                      <p className="text-xs text-gray-500">
                        {new Date(campaignInfluencer.updatedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className={`mt-1 h-2 w-2 rounded-full ${status === 'submitted' || status === 'verified' || status === 'paid' ? 'bg-blue-500' : 'bg-gray-300'}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Submitted</p>
                    {campaignInfluencer.submittedAt && (
                      <p className="text-xs text-gray-500">
                        {new Date(campaignInfluencer.submittedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className={`mt-1 h-2 w-2 rounded-full ${status === 'verified' || status === 'paid' ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Verified</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className={`mt-1 h-2 w-2 rounded-full ${status === 'paid' ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Paid</p>
                    {payment?.paidAt && (
                      <p className="text-xs text-gray-500">
                        {new Date(payment.paidAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </InfluencerLayout>
  );
}
