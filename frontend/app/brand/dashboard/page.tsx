'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  TrendingUp, 
  DollarSign,
  Users,
  Target,
  Activity,
  Clock,
  Plus,
  Eye,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  TrendingDown
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { BrandLayout } from '@/components/brand/BrandLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkeletonDashboard } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/toast';
import { getAnalytics, getCampaigns } from '@/lib/api/campaigns';
import type { BrandAnalytics, Campaign, CampaignStatus } from '@/types';

// Status colors
const STATUS_COLORS: Record<CampaignStatus, string> = {
  draft: '#9CA3AF',
  active: '#3B82F6',
  completed: '#10B981',
};

export default function BrandDashboardPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [analytics, setAnalytics] = useState<BrandAnalytics | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timePeriod, setTimePeriod] = useState<'7d' | '30d' | 'quarterly'>('30d');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [analyticsData, campaignsData] = await Promise.all([
        getAnalytics(),
        getCampaigns(),
      ]);
      
      setAnalytics(analyticsData);
      setCampaigns(campaignsData);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load dashboard data';
      setError(errorMessage);
      addToast({
        title: 'Error loading dashboard',
        description: errorMessage,
        variant: 'error',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate metrics from real data
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const totalBudget = campaigns.reduce((sum, c) => sum + Number(c.budget), 0);
  const totalSpent = analytics?.totalSpend || 0;
  
  // Only show mock data if there are campaigns, otherwise show 0
  const avgEngagement = campaigns.length > 0 ? 4.8 : 0;
  const totalReach = campaigns.length > 0 ? 2400000 : 0;
  const roi = campaigns.length > 0 ? 3.2 : 0;

  // Mock data for charts - only when there are campaigns
  const performanceData = campaigns.length > 0 ? [
    { month: 'Jan', earnings: 45000, performance: 78 },
    { month: 'Feb', earnings: 52000, performance: 82 },
    { month: 'Mar', earnings: 48000, performance: 75 },
    { month: 'Apr', earnings: 61000, performance: 88 },
    { month: 'May', earnings: 55000, performance: 85 },
    { month: 'Jun', earnings: 67000, performance: 92 },
  ] : [];

  const campaignComparisonData = campaigns.length > 0 ? [
    { name: 'Summer Launch', roi: 3.2, engagement: 4.8, reach: 2.1 },
    { name: 'Product Drop', roi: 2.8, engagement: 5.2, reach: 1.8 },
    { name: 'Brand Awareness', roi: 2.1, engagement: 3.9, reach: 3.5 },
    { name: 'Holiday Special', roi: 4.1, engagement: 6.1, reach: 2.8 },
  ] : [];

  const engagementTrendData = campaigns.length > 0 ? [
    { week: 'W1', rate: 4.2 },
    { week: 'W2', rate: 4.5 },
    { week: 'W3', rate: 4.1 },
    { week: 'W4', rate: 4.8 },
  ] : [];

  // Budget allocation for donut chart - only from real campaigns
  const budgetAllocation = campaigns
    .filter(c => c.status === 'active')
    .map(c => ({
      name: c.title,
      value: Number(c.budget),
      spent: Number(c.budget) * 0.65, // Mock: 65% spent
    }));

  // Campaign status for table
  const getCampaignStatus = (campaign: Campaign) => {
    const spent = Number(campaign.budget) * 0.65;
    const progress = (spent / Number(campaign.budget)) * 100;
    
    if (progress > 90) return 'Over Budget';
    if (progress > 75) return 'At Risk';
    if (campaign.status === 'completed') return 'Completed';
    return 'Active';
  };

  const getCampaignRisk = (campaign: Campaign) => {
    const status = getCampaignStatus(campaign);
    if (status === 'Over Budget') return 'text-red-600 bg-red-50';
    if (status === 'At Risk') return 'text-amber-600 bg-amber-50';
    if (status === 'Completed') return 'text-emerald-600 bg-emerald-50';
    return 'text-blue-600 bg-blue-50';
  };

  if (loading) {
    return (
      <BrandLayout title="Dashboard" description="Performance and financial visibility">
        <SkeletonDashboard />
      </BrandLayout>
    );
  }

  if (error) {
    return (
      <BrandLayout title="Dashboard" description="Performance and financial visibility">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-red-600">{error}</p>
            <div className="mt-4 text-center">
              <Button onClick={loadDashboardData}>Retry</Button>
            </div>
          </CardContent>
        </Card>
      </BrandLayout>
    );
  }

  return (
    <BrandLayout title="Dashboard" description="Performance and financial visibility">
      <div className="space-y-6">
        {/* KPI Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
                <Target className="h-4 w-4 text-gray-400" />
              </div>
              <p className="mt-2 text-2xl font-semibold text-gray-900">{activeCampaigns}</p>
              <div className="mt-2 flex items-center text-xs text-emerald-600">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                <span>+12% vs last period</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-600">Total Budget Spent</p>
                <DollarSign className="h-4 w-4 text-gray-400" />
              </div>
              <p className="mt-2 text-2xl font-semibold text-gray-900">
                ${totalSpent.toLocaleString()}
              </p>
              <div className="mt-2 flex items-center text-xs text-gray-600">
                <span>of ${totalBudget.toLocaleString()} total</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-600">ROI</p>
                <TrendingUp className="h-4 w-4 text-gray-400" />
              </div>
              <p className="mt-2 text-2xl font-semibold text-gray-900">{roi}x</p>
              <div className="mt-2 flex items-center text-xs text-emerald-600">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                <span>+15% improvement</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-600">Total Reach</p>
                <Users className="h-4 w-4 text-gray-400" />
              </div>
              <p className="mt-2 text-2xl font-semibold text-gray-900">
                {(totalReach / 1000000).toFixed(1)}M
              </p>
              <div className="mt-2 flex items-center text-xs text-emerald-600">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                <span>+28% growth</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-600">Avg Engagement</p>
                <Activity className="h-4 w-4 text-gray-400" />
              </div>
              <p className="mt-2 text-2xl font-semibold text-gray-900">{avgEngagement}%</p>
              <div className="mt-2 flex items-center text-xs text-emerald-600">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                <span>+0.3% increase</span>
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
                {analytics?.pendingVerifications || 0}
              </p>
              <div className="mt-2 flex items-center text-xs text-gray-600">
                <span>Awaiting approval</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Analytics Section */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 border-gray-200">
            <CardHeader className="border-b border-gray-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-gray-900">
                  Performance Over Time
                </CardTitle>
                <div className="flex gap-2">
                  {(['7d', '30d', 'quarterly'] as const).map((period) => (
                    <button
                      key={period}
                      onClick={() => setTimePeriod(period)}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                        timePeriod === period
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {period === '7d' ? '7 Days' : period === '30d' ? '30 Days' : 'Quarterly'}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {campaigns.length === 0 ? (
                <div className="flex h-[280px] items-center justify-center">
                  <div className="text-center">
                    <Activity className="mx-auto h-12 w-12 text-gray-300" />
                    <p className="mt-2 text-sm text-gray-500">No campaign data yet</p>
                    <p className="text-xs text-gray-400 mt-1">Create your first campaign to see performance metrics</p>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                    <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }} 
                    />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Line 
                      type="monotone" 
                      dataKey="earnings" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', r: 4 }}
                      name="Earnings ($)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="performance" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      dot={{ fill: '#8b5cf6', r: 4 }}
                      name="Performance Score"
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-base font-semibold text-gray-900">
                Engagement Trend
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {campaigns.length === 0 ? (
                <div className="flex h-[280px] items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="mx-auto h-12 w-12 text-gray-300" />
                    <p className="mt-2 text-sm text-gray-500">No engagement data</p>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={engagementTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                    <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="rate" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={{ fill: '#10b981', r: 4 }}
                      name="Engagement %"
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Campaign Comparison */}
        <Card className="border-gray-200">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-base font-semibold text-gray-900">
              Campaign Comparison
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {campaigns.length === 0 ? (
              <div className="flex h-[300px] items-center justify-center">
                <div className="text-center">
                  <Target className="mx-auto h-12 w-12 text-gray-300" />
                  <p className="mt-2 text-sm text-gray-500">No campaigns to compare</p>
                  <Button 
                    onClick={() => router.push('/brand/campaigns/new')}
                    className="mt-4"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Campaign
                  </Button>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={campaignComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }} 
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="roi" fill="#3b82f6" name="ROI" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="engagement" fill="#8b5cf6" name="Engagement %" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="reach" fill="#10b981" name="Reach (M)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Budget Allocation & Smart Insights */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="border-gray-200">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-base font-semibold text-gray-900">
                Budget Allocation
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {budgetAllocation.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={budgetAllocation}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {budgetAllocation.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'][index % 5]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => `$${value.toLocaleString()}`}
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {budgetAllocation.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div 
                            className="h-3 w-3 rounded-full" 
                            style={{ 
                              backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981'][index] 
                            }}
                          />
                          <span className="text-gray-600 truncate max-w-[120px]">{item.name}</span>
                        </div>
                        <span className="font-medium text-gray-900">
                          ${item.value.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex h-[200px] items-center justify-center text-gray-500 text-sm">
                  No active campaigns
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader className="border-b border-blue-100">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-base font-semibold text-gray-900">
                  Smart Insights
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {campaigns.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="mx-auto h-12 w-12 text-gray-300" />
                  <p className="mt-2 text-sm text-gray-500">No insights available yet</p>
                  <p className="text-xs text-gray-400 mt-1">Create campaigns to get AI-powered insights</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-blue-100">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Campaign "Summer Launch" is outperforming by 18%
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Consider allocating more budget to similar campaigns
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-amber-100">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                      <AlertCircle className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Budget usage is at 85% across active campaigns
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Review spending to avoid overruns
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-blue-100">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Top creator delivers 2x higher engagement rate
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Average 9.6% vs platform average of 4.8%
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Active Campaign Table */}
        <Card className="border-gray-200">
          <CardHeader className="border-b border-gray-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-gray-900">
                Active Campaigns
              </CardTitle>
              <Button 
                onClick={() => router.push('/brand/campaigns/new')}
                size="sm"
                className="bg-gray-900 hover:bg-gray-800"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Campaign
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Campaign Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Goal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Budget
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Progress
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      ROI
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {campaigns.slice(0, 5).map((campaign) => {
                    const progress = 65; // Mock progress
                    const campaignRoi = (Math.random() * 2 + 2).toFixed(1);
                    const status = getCampaignStatus(campaign);
                    
                    return (
                      <tr key={campaign.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{campaign.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{campaign.goal || 'Brand Awareness'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            ${Number(campaign.budget).toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden max-w-[100px]">
                              <div 
                                className="h-full bg-blue-600 rounded-full transition-all"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium text-gray-600">{progress}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${getCampaignRisk(campaign)}`}>
                            {status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{campaignRoi}x</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/brand/campaigns/${campaign.id}`)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {campaigns.length === 0 && (
              <div className="py-12 text-center">
                <Target className="mx-auto h-12 w-12 text-gray-300" />
                <p className="mt-2 text-sm text-gray-500">No campaigns yet</p>
                <Button 
                  onClick={() => router.push('/brand/campaigns/new')}
                  className="mt-4"
                  size="sm"
                >
                  Create Your First Campaign
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </BrandLayout>
  );
}
