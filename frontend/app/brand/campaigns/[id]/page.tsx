'use client';

/**
 * Campaign detail page
 * Displays campaign information, assigned influencers, and submissions
 */

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  UserPlus,
  CheckCircle,
  Eye,
  ExternalLink
} from 'lucide-react';
import { BrandLayout } from '@/components/brand/BrandLayout';
import { AssignInfluencerModal } from '@/components/brand/AssignInfluencerModal';
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
import { getCampaign, updateCampaignStatus } from '@/lib/api/campaigns';
import { getCampaignInfluencers, verifySubmission } from '@/lib/api/campaign-influencers';
import type { Campaign, CampaignInfluencer, WorkflowStatus } from '@/types';

export default function CampaignDetailPage() {
  const router = useRouter();
  const params = useParams();
  const campaignId = params.id as string;

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [influencers, setInfluencers] = useState<CampaignInfluencer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [activatingCampaign, setActivatingCampaign] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  useEffect(() => {
    if (campaignId) {
      loadCampaignData();
    }
  }, [campaignId]);

  const loadCampaignData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [campaignData, influencersData] = await Promise.all([
        getCampaign(campaignId),
        getCampaignInfluencers(campaignId),
      ]);
      
      setCampaign(campaignData);
      setInfluencers(influencersData);
    } catch (err: any) {
      setError(err.message || 'Failed to load campaign');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySubmission = async (influencerId: string) => {
    try {
      setVerifyingId(influencerId);
      await verifySubmission(influencerId);
      await loadCampaignData(); // Reload to get updated data
    } catch (err: any) {
      alert(err.message || 'Failed to verify submission');
    } finally {
      setVerifyingId(null);
    }
  };

  const handleActivateCampaign = async () => {
    if (!campaign) return;
    
    try {
      setActivatingCampaign(true);
      await updateCampaignStatus(campaign.id, { status: 'active' });
      await loadCampaignData();
    } catch (err: any) {
      alert(err.message || 'Failed to activate campaign');
    } finally {
      setActivatingCampaign(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getSubmissions = () => {
    return influencers.filter(
      (inf) => inf.status === 'submitted' || inf.status === 'verified' || inf.status === 'paid'
    );
  };

  if (loading) {
    return (
      <BrandLayout title="Campaign Details" description="Loading...">
        <Card>
          <CardContent className="pt-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 rounded bg-gray-200" />
              <div className="h-32 rounded bg-gray-200" />
            </div>
          </CardContent>
        </Card>
      </BrandLayout>
    );
  }

  if (error || !campaign) {
    return (
      <BrandLayout title="Campaign Details" description="Error loading campaign">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-red-600">{error || 'Campaign not found'}</p>
            <div className="mt-4 text-center">
              <Button onClick={() => router.push('/brand/campaigns')}>
                Back to Campaigns
              </Button>
            </div>
          </CardContent>
        </Card>
      </BrandLayout>
    );
  }

  const submissions = getSubmissions();

  return (
    <BrandLayout title={campaign.title} description="Campaign details and management">
      <div className="space-y-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.push('/brand/campaigns')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Campaigns
        </Button>

        {/* Campaign Info Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{campaign.title}</CardTitle>
                <div className="mt-2">
                  <StatusBadge status={campaign.status}>
                    {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                  </StatusBadge>
                </div>
              </div>
              {campaign.status === 'draft' && (
                <Button
                  onClick={handleActivateCampaign}
                  disabled={activatingCampaign || influencers.length === 0}
                  title={influencers.length === 0 ? 'Assign influencers before activating' : ''}
                >
                  {activatingCampaign ? 'Activating...' : 'Activate Campaign'}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Brief */}
            <div>
              <h3 className="mb-2 text-sm font-medium text-gray-500">Campaign Brief</h3>
              <p className="text-gray-900 whitespace-pre-wrap">{campaign.brief}</p>
            </div>

            {/* Meta Info */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Budget</p>
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(Number(campaign.budget))}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50">
                  <Calendar className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Deadline</p>
                  <p className="font-semibold text-gray-900">
                    {formatDate(campaign.deadline)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-50">
                  <UserPlus className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Influencers</p>
                  <p className="font-semibold text-gray-900">{influencers.length}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assigned Influencers */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Assigned Influencers</CardTitle>
              <Button
                size="sm"
                onClick={() => setShowAssignModal(true)}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Assign Influencer
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {influencers.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                No influencers assigned yet
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Influencer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {influencers.map((inf) => (
                    <TableRow key={inf.id}>
                      <TableCell>
                        <p className="font-medium text-gray-900">
                          {inf.influencer?.name || 'Unknown'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {inf.influencer?.email || ''}
                        </p>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={inf.status}>
                          {inf.status.charAt(0).toUpperCase() + inf.status.slice(1)}
                        </StatusBadge>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {inf.submittedAt ? formatDate(inf.submittedAt) : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        {inf.status === 'submitted' && (
                          <Button
                            size="sm"
                            onClick={() => handleVerifySubmission(inf.id)}
                            disabled={verifyingId === inf.id}
                          >
                            {verifyingId === inf.id ? 'Verifying...' : 'Verify'}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Submissions for Review */}
        {submissions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {submissions.map((inf) => (
                  <div
                    key={inf.id}
                    className="rounded-lg border border-gray-200 p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <p className="font-medium text-gray-900">
                            {inf.influencer?.name}
                          </p>
                          <StatusBadge status={inf.status}>
                            {inf.status.charAt(0).toUpperCase() + inf.status.slice(1)}
                          </StatusBadge>
                        </div>

                        {inf.postUrl && (
                          <div className="mb-2">
                            <p className="text-sm text-gray-500 mb-1">Post URL:</p>
                            <a
                              href={inf.postUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                            >
                              {inf.postUrl}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        )}

                        {inf.screenshotUrl && (
                          <div className="mb-2">
                            <p className="text-sm text-gray-500 mb-1">Screenshot:</p>
                            <img
                              src={inf.screenshotUrl}
                              alt="Submission screenshot"
                              className="max-w-md rounded-lg border border-gray-200"
                            />
                          </div>
                        )}

                        <div className="flex gap-6 text-sm text-gray-600">
                          <span>👍 {inf.likes || 0} likes</span>
                          <span>💬 {inf.comments || 0} comments</span>
                        </div>
                      </div>

                      {inf.status === 'submitted' && (
                        <Button
                          onClick={() => handleVerifySubmission(inf.id)}
                          disabled={verifyingId === inf.id}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          {verifyingId === inf.id ? 'Verifying...' : 'Verify'}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Assign Influencer Modal */}
      <AssignInfluencerModal
        open={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        campaignId={campaignId}
        onSuccess={loadCampaignData}
      />
    </BrandLayout>
  );
}
