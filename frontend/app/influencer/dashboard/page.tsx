'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { InfluencerLayout } from '@/components/influencer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { getMyCampaigns } from '@/lib/api/campaign-influencers';
import { getMyPayments } from '@/lib/api/payments';
import { 
  Calendar, 
  DollarSign, 
  Megaphone, 
  TrendingUp, 
  Activity,
  Users,
  ArrowUpRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Upload,
  Eye
} from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import Link from 'next/link';
import type { CampaignInfluencer, Payment, WorkflowStatus } from '@/types';

// Mock earnings trend data
const earningsTrendData = [
  { month: 'Jan', earnings: 2400 },
  { month: 'Feb', earnings: 2800 },
  { month: 'Mar', earnings: 2200 },
  { month: 'Apr', earnings: 3200 },
  { month: 'May', earnings: 2900 },
  { month: 'Jun', earnings: 3600 },
];

export default function InfluencerDashboardPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<CampaignInfluencer[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [campaignsData, paymentsData] = await Promise.all([
        getMyCampaigns(),
        getMyPayments(),
      ]);
      setCampaigns(campaignsData);
      setPayments(paymentsData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate metrics
  const activeCampaigns = campaigns.filter(
    (c) => c.status === 'accepted' || c.status === 'submitted'
  ).length;
  
  const thisMonthEarnings = 3600;
  const pendingPaymentsAmount = payments
    .filter((p) => p.status === 'pending')
    .reduce((sum, p) => sum + Number(p.amount), 0);
  
  const withdrawableBalance = payments
    .filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + Number(p.amount), 0);
  
  const avgEngagement = 5.2;
  const totalReach = 450000;
  const bestCampaign = 'Summer Launch';
  const engagementGrowth = 12;

  // Get upcoming deadlines
  const upcomingDeadlines = campaigns
    .filter((c) => c.status === 'accepted' || c.status === 'submitted')
    .filter((c) => c.campaign?.deadline)
    .sort((a, b) => {
      const dateA = new Date(a.campaign!.deadline).getTime();
      const dateB = new Date(b.campaign!.deadline).getTime();
      return dateA - dateB;
    })
    .slice(0, 4);

  // Get recent campaigns
  const recentCampaigns = [...campaigns]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-700';
      case 'submitted':
        return 'bg-blue-100 text-blue-700';
      case 'revision_needed':
        return 'bg-amber-100 text-amber-700';
      case 'verified':
        return 'bg-emerald-100 text-emerald-700';
      case 'paid':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <Clock className="h-3 w-3" />;
      case 'submitted':
        return <Upload className="h-3 w-3" />;
      case 'revision_needed':
        return <AlertCircle className="h-3 w-3" />;
      case 'verified':
      case 'paid':
        return <CheckCircle className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  if (loading) {
    return (
      <InfluencerLayout title="Dashboard" description="Welcome back!">
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
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
    <InfluencerLayout title="Dashboard" description="Welcome back!">
      <div className="space-y-6">
        {/* Earnings Overview KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
                <Megaphone className="h-4 w-4 text-gray-400" />
              </div>
              <p className="mt-2 text-2xl font-semibold text-gray-900">{activeCampaigns}</p>
              <div className="mt-2 flex items-center text-xs text-gray-600">
                <span>{campaigns.length} total campaigns</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-600">This Month Earnings</p>
                <DollarSign className="h-4 w-4 text-gray-400" />
              </div>
              <p className="mt-2 text-2xl font-semibold text-gray-900">
                ${thisMonthEarnings.toLocaleString()}
              </p>
              <div className="mt-2 flex items-center text-xs text-emerald-600">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                <span>+12% vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-600">Pending Payments</p>
                <Clock className="h-4 w-4 text-gray-400" />
              </div>
              <p className="mt-2 text-2xl font-semibold text-gray-900">
                ${pendingPaymentsAmount.toFixed(2)}
              </p>
              <div className="mt-2 flex items-center text-xs text-gray-600">
                <span>{payments.filter(p => p.status === 'pending').length} pending</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-600">Withdrawable Balance</p>
                <DollarSign className="h-4 w-4 text-gray-400" />
              </div>
              <p className="mt-2 text-2xl font-semibold text-gray-900">
                ${withdrawableBalance.toFixed(2)}
              </p>
              <div className="mt-2 flex items-center text-xs text-emerald-600">
                <span>Available now</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-600">Avg Engagement Rate</p>
                <Activity className="h-4 w-4 text-gray-400" />
              </div>
              <p className="mt-2 text-2xl font-semibold text-gray-900">{avgEngagement}%</p>
              <div className="mt-2 flex items-center text-xs text-emerald-600">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                <span>Above average</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Earnings Trend Chart */}
        <Card className="border-gray-200">
          <CardHeader className="border-b border-gray-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-gray-900">
                Earnings Trend
              </CardTitle>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">Growth:</span>
                <span className="font-semibold text-emerald-600 flex items-center">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  +{engagementGrowth}%
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={earningsTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip 
                  formatter={(value: number) => `$${value.toLocaleString()}`}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="earnings" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', r: 4 }}
                  name="Earnings"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Upcoming Deadlines & Performance Snapshot */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Upcoming Deadlines */}
          <Card className="border-gray-200">
            <CardHeader className="border-b border-gray-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-gray-900">
                  Upcoming Deadlines
                </CardTitle>
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {upcomingDeadlines.length === 0 ? (
                <div className="py-8 text-center">
                  <Calendar className="mx-auto h-12 w-12 text-gray-300" />
                  <p className="mt-2 text-sm text-gray-500">No upcoming deadlines</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingDeadlines.map((ci) => {
                    const daysUntil = Math.ceil(
                      (new Date(ci.campaign!.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                    );
                    const isUrgent = daysUntil <= 3;
                    
                    return (
                      <div
                        key={ci.id}
                        className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                          isUrgent ? 'border-amber-200 bg-amber-50' : 'border-gray-200 bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-sm font-medium text-gray-900">
                                {ci.campaign?.title}
                              </h3>
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-md ${getStatusColor(ci.status)}`}>
                                {getStatusIcon(ci.status)}
                                {ci.status.replace('_', ' ')}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600">
                              {ci.campaign?.description || 'No description'}
                            </p>
                            <div className="mt-2 flex items-center gap-4 text-xs">
                              <span className={`font-medium ${isUrgent ? 'text-amber-700' : 'text-gray-600'}`}>
                                Due: {new Date(ci.campaign!.deadline).toLocaleDateString()}
                              </span>
                              <span className="text-gray-500">
                                {daysUntil} days left
                              </span>
                            </div>
                            <div className="mt-3">
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="text-gray-600">Progress</span>
                                <span className="font-medium text-gray-900">
                                  {ci.status === 'verified' || ci.status === 'paid' ? '100' : ci.status === 'submitted' ? '75' : '25'}%
                                </span>
                              </div>
                              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full transition-all ${
                                    ci.status === 'verified' || ci.status === 'paid' 
                                      ? 'bg-emerald-500' 
                                      : ci.status === 'submitted' 
                                      ? 'bg-blue-500' 
                                      : 'bg-gray-400'
                                  }`}
                                  style={{ 
                                    width: `${ci.status === 'verified' || ci.status === 'paid' ? '100' : ci.status === 'submitted' ? '75' : '25'}%` 
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => router.push(`/influencer/campaigns/${ci.id}`)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          {ci.status === 'accepted' && (
                            <Button
                              size="sm"
                              className="flex-1 bg-blue-600 hover:bg-blue-700"
                              onClick={() => router.push(`/influencer/campaigns/${ci.id}`)}
                            >
                              <Upload className="h-3 w-3 mr-1" />
                              Submit
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Performance Snapshot */}
          <Card className="border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader className="border-b border-blue-100">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-base font-semibold text-gray-900">
                  Performance Snapshot
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-lg border border-blue-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Total Reach Generated</span>
                    <Users className="h-4 w-4 text-gray-400" />
                  </div>
                  <p className="text-2xl font-semibold text-gray-900">
                    {(totalReach / 1000).toFixed(0)}K
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Across all campaigns</p>
                </div>

                <div className="p-4 bg-white rounded-lg border border-blue-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Total Engagement</span>
                    <Activity className="h-4 w-4 text-gray-400" />
                  </div>
                  <p className="text-2xl font-semibold text-gray-900">
                    {(totalReach * avgEngagement / 100).toFixed(0)}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Likes, comments, shares</p>
                </div>

                <div className="p-4 bg-white rounded-lg border border-emerald-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Best Performing Campaign</span>
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                  </div>
                  <p className="text-lg font-semibold text-gray-900">{bestCampaign}</p>
                  <p className="text-xs text-emerald-600 mt-1">8.2% engagement rate</p>
                </div>

                <div className="p-4 bg-white rounded-lg border border-blue-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Engagement Rate Trend</span>
                    <ArrowUpRight className="h-4 w-4 text-emerald-600" />
                  </div>
                  <p className="text-2xl font-semibold text-gray-900">{avgEngagement}%</p>
                  <p className="text-xs text-emerald-600 mt-1">+0.4% from last period</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Campaign Activity Table */}
        <Card className="border-gray-200">
          <CardHeader className="border-b border-gray-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-gray-900">
                Campaign Activity
              </CardTitle>
              <Link href="/influencer/campaigns">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {recentCampaigns.length === 0 ? (
              <div className="py-12 text-center">
                <Megaphone className="mx-auto h-12 w-12 text-gray-300" />
                <p className="mt-2 text-sm text-gray-500">No campaigns yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Campaign
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Brand
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Deliverable
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Payment Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentCampaigns.map((ci) => (
                      <tr key={ci.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {ci.campaign?.title}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {ci.campaign?.brand?.name || 'Brand Name'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {ci.campaign?.description?.substring(0, 30) || 'Content creation'}...
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            ${Number(ci.campaign?.budget || 0).toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md ${getStatusColor(ci.status)}`}>
                            {getStatusIcon(ci.status)}
                            {ci.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/influencer/campaigns/${ci.id}`)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </InfluencerLayout>
  );
}
