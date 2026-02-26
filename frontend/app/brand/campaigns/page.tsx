'use client';

/**
 * Brand campaigns list page
 * Displays all campaigns with filtering and search
 */

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus, Search, Filter } from 'lucide-react';
import { BrandLayout } from '@/components/brand/BrandLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/ui/status-badge';
import { SkeletonTable } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { getCampaigns } from '@/lib/api/campaigns';
import type { Campaign, CampaignStatus } from '@/types';

export default function CampaignsPage() {
  return (
    <Suspense fallback={<CampaignsPageSkeleton />}>
      <CampaignsPageContent />
    </Suspense>
  );
}

function CampaignsPageSkeleton() {
  return (
    <BrandLayout title="Campaigns" description="Manage your influencer campaigns">
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

function CampaignsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useToast();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | 'all'>('all');

  useEffect(() => {
    loadCampaigns();
  }, []);

  useEffect(() => {
    filterCampaigns();
  }, [campaigns, searchQuery, statusFilter]);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCampaigns();
      setCampaigns(data);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load campaigns';
      setError(errorMessage);
      addToast({
        title: 'Error loading campaigns',
        description: errorMessage,
        variant: 'error',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const filterCampaigns = () => {
    let filtered = [...campaigns];

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.title.toLowerCase().includes(query) ||
          c.brief.toLowerCase().includes(query)
      );
    }

    setFilteredCampaigns(filtered);
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

  if (loading) {
    return (
      <BrandLayout title="Campaigns" description="Manage your influencer campaigns">
        <Card>
          <CardContent className="pt-6">
            <SkeletonTable />
          </CardContent>
        </Card>
      </BrandLayout>
    );
  }

  if (error) {
    return (
      <BrandLayout title="Campaigns" description="Manage your influencer campaigns">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-red-600">{error}</p>
            <div className="mt-4 text-center">
              <Button onClick={loadCampaigns}>Retry</Button>
            </div>
          </CardContent>
        </Card>
      </BrandLayout>
    );
  }

  return (
    <BrandLayout title="Campaigns" description="Manage your influencer campaigns">
      <div className="space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as CampaignStatus | 'all')}
                className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Create Campaign Button */}
          <Button onClick={() => router.push('/brand/campaigns/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Create Campaign
          </Button>
        </div>

        {/* Campaigns Table */}
        <Card>
          <CardContent className="p-0">
            {filteredCampaigns.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-gray-500">
                  {searchQuery || statusFilter !== 'all'
                    ? 'No campaigns match your filters'
                    : 'No campaigns yet'}
                </p>
                {campaigns.length === 0 && (
                  <Button
                    onClick={() => router.push('/brand/campaigns/new')}
                    className="mt-4"
                    variant="outline"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Campaign
                  </Button>
                )}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCampaigns.map((campaign) => (
                    <TableRow
                      key={campaign.id}
                      className="cursor-pointer"
                      onClick={() => router.push(`/brand/campaigns/${campaign.id}`)}
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">
                            {campaign.title}
                          </p>
                          <p className="text-sm text-gray-500 line-clamp-1">
                            {campaign.brief}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={campaign.status}>
                          {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                        </StatusBadge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(Number(campaign.budget))}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {formatDate(campaign.deadline)}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {formatDate(campaign.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/brand/campaigns/${campaign.id}`);
                          }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Results Count */}
        {filteredCampaigns.length > 0 && (
          <p className="text-sm text-gray-500">
            Showing {filteredCampaigns.length} of {campaigns.length} campaigns
          </p>
        )}
      </div>
    </BrandLayout>
  );
}
