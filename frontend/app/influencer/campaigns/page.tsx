'use client';

/**
 * Influencer Campaigns List Page
 * Displays all campaigns assigned to the influencer
 */

import { useEffect, useState } from 'react';
import { InfluencerLayout } from '@/components/influencer';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getMyCampaigns } from '@/lib/api/campaign-influencers';
import { Search, Calendar, DollarSign, Megaphone } from 'lucide-react';
import Link from 'next/link';
import type { CampaignInfluencer, WorkflowStatus } from '@/types';

export default function InfluencerCampaignsPage() {
  const [campaigns, setCampaigns] = useState<CampaignInfluencer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<WorkflowStatus | 'all'>('all');

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      const data = await getMyCampaigns();
      setCampaigns(data);
    } catch (error) {
      console.error('Failed to load campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter campaigns
  const filteredCampaigns = campaigns.filter((campaign) => {
    // Filter by status
    if (filterStatus !== 'all' && campaign.status !== filterStatus) {
      return false;
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const title = campaign.campaign?.title?.toLowerCase() || '';
      const brief = campaign.campaign?.brief?.toLowerCase() || '';
      return title.includes(query) || brief.includes(query);
    }

    return true;
  });

  // Sort by date (newest first)
  const sortedCampaigns = [...filteredCampaigns].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Count by status
  const statusCounts = {
    invited: campaigns.filter((c) => c.status === 'invited').length,
    accepted: campaigns.filter((c) => c.status === 'accepted').length,
    submitted: campaigns.filter((c) => c.status === 'submitted').length,
    verified: campaigns.filter((c) => c.status === 'verified').length,
    paid: campaigns.filter((c) => c.status === 'paid').length,
  };

  if (loading) {
    return (
      <InfluencerLayout title="My Campaigns" description="View and manage your campaigns">
        <div className="space-y-6">
          <Card className="p-6">
            <div className="h-96 animate-pulse rounded bg-gray-200" />
          </Card>
        </div>
      </InfluencerLayout>
    );
  }

  return (
    <InfluencerLayout title="My Campaigns" description="View and manage your campaigns">
      <div className="space-y-6">
        {/* Filters and Search */}
        <Card className="p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  filterStatus === 'all'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({campaigns.length})
              </button>
              <button
                onClick={() => setFilterStatus('invited' as WorkflowStatus)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  filterStatus === 'invited'
                    ? 'bg-gray-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Invited ({statusCounts.invited})
              </button>
              <button
                onClick={() => setFilterStatus('accepted' as WorkflowStatus)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  filterStatus === 'accepted'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Accepted ({statusCounts.accepted})
              </button>
              <button
                onClick={() => setFilterStatus('submitted' as WorkflowStatus)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  filterStatus === 'submitted'
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Submitted ({statusCounts.submitted})
              </button>
              <button
                onClick={() => setFilterStatus('verified' as WorkflowStatus)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  filterStatus === 'verified'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Verified ({statusCounts.verified})
              </button>
              <button
                onClick={() => setFilterStatus('paid' as WorkflowStatus)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  filterStatus === 'paid'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Paid ({statusCounts.paid})
              </button>
            </div>

            <div className="relative">
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

        {/* Campaigns List */}
        {sortedCampaigns.length === 0 ? (
          <Card className="p-12 text-center">
            <Megaphone className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-2 text-sm text-gray-500">
              {searchQuery || filterStatus !== 'all'
                ? 'No campaigns found matching your filters'
                : 'No campaigns assigned yet'}
            </p>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedCampaigns.map((campaignInfluencer) => {
              const campaign = campaignInfluencer.campaign!;
              const status = campaignInfluencer.status as WorkflowStatus;
              const isOverdue =
                (status === 'accepted' || status === 'submitted') &&
                new Date(campaign.deadline) < new Date();

              return (
                <Card
                  key={campaignInfluencer.id}
                  className="flex flex-col transition-all hover:shadow-md"
                >
                  <div className="flex-1 p-6">
                    <div className="mb-3 flex items-start justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {campaign.title}
                      </h3>
                      <StatusBadge status={status} />
                    </div>

                    <p className="mb-4 line-clamp-2 text-sm text-gray-500">
                      {campaign.brief}
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">
                          ${Number(campaign.budget).toFixed(2)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className={isOverdue ? 'text-red-600' : ''}>
                          {new Date(campaign.deadline).toLocaleDateString()}
                          {isOverdue && ' (Overdue)'}
                        </span>
                      </div>
                    </div>

                    {/* Action indicators */}
                    {status === 'invited' && (
                      <div className="mt-4 rounded-lg bg-blue-50 p-3">
                        <p className="text-sm font-medium text-blue-800">
                          Action required: Accept invitation
                        </p>
                      </div>
                    )}

                    {status === 'accepted' && (
                      <div className="mt-4 rounded-lg bg-amber-50 p-3">
                        <p className="text-sm font-medium text-amber-800">
                          Action required: Submit deliverable
                        </p>
                      </div>
                    )}

                    {status === 'submitted' && (
                      <div className="mt-4 rounded-lg bg-gray-50 p-3">
                        <p className="text-sm text-gray-600">
                          Waiting for brand verification
                        </p>
                      </div>
                    )}

                    {status === 'verified' && (
                      <div className="mt-4 rounded-lg bg-emerald-50 p-3">
                        <p className="text-sm font-medium text-emerald-800">
                          Verified! Payment pending
                        </p>
                      </div>
                    )}

                    {status === 'paid' && (
                      <div className="mt-4 rounded-lg bg-emerald-50 p-3">
                        <p className="text-sm font-medium text-emerald-800">
                          Completed & Paid
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-gray-200 p-4">
                    <Link href={`/influencer/campaigns/${campaignInfluencer.id}`}>
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </InfluencerLayout>
  );
}
