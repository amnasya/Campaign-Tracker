'use client';

/**
 * Brand influencers page
 * Displays list of all influencers for assigning to campaigns
 */

import { useEffect, useState } from 'react';
import { Users, Mail, UserCheck } from 'lucide-react';
import { BrandLayout } from '@/components/brand/BrandLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/toast';
import { getUsers } from '@/lib/api/auth';
import type { User } from '@/types';

export default function BrandInfluencersPage() {
  const { addToast } = useToast();
  const [influencers, setInfluencers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInfluencers();
  }, []);

  const loadInfluencers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get all users with role 'influencer'
      const users = await getUsers('influencer');
      setInfluencers(users);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load influencers';
      setError(errorMessage);
      addToast({
        title: 'Error loading influencers',
        description: errorMessage,
        variant: 'error',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <BrandLayout title="Influencers" description="Manage your influencer network">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-64" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </BrandLayout>
    );
  }

  if (error) {
    return (
      <BrandLayout title="Influencers" description="Manage your influencer network">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-red-600">{error}</p>
            <div className="mt-4 text-center">
              <Button onClick={loadInfluencers}>Retry</Button>
            </div>
          </CardContent>
        </Card>
      </BrandLayout>
    );
  }

  return (
    <BrandLayout title="Influencers" description="Manage your influencer network">
      <div className="space-y-6">
        {/* Stats Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Influencers
                </p>
                <p className="text-3xl font-semibold text-gray-900">
                  {influencers.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Influencers List */}
        <Card>
          <CardHeader>
            <CardTitle>All Influencers</CardTitle>
          </CardHeader>
          <CardContent>
            {influencers.length === 0 ? (
              <div className="py-12 text-center">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  No influencers yet
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Influencers will appear here once they register on the platform.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {influencers.map((influencer) => (
                  <div
                    key={influencer.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                        {influencer.name.charAt(0).toUpperCase()}
                      </div>

                      {/* Info */}
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {influencer.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Mail className="h-4 w-4" />
                          {influencer.email}
                        </div>
                      </div>
                    </div>

                    {/* Badge */}
                    <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                      <UserCheck className="h-4 w-4" />
                      Influencer
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="font-medium text-blue-900">
                  How to work with influencers
                </h3>
                <p className="mt-1 text-sm text-blue-700">
                  To assign an influencer to your campaign, go to the campaign detail page 
                  and use the "Assign Influencer" button. You can select from the list of 
                  registered influencers on the platform.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </BrandLayout>
  );
}
