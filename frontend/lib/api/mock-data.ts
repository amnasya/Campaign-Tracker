/**
 * Mock data for demo mode (no backend required)
 */

export const mockUser = {
  id: '1',
  name: 'Demo User',
  email: 'demo@example.com',
  role: 'brand' as const,
};

export const mockCampaigns = [
  {
    id: '1',
    brandId: '1',
    title: 'Summer Fashion Campaign 2024',
    brief: 'Promote our new summer collection with lifestyle photos and reels',
    budget: 5000,
    deadline: new Date('2024-06-30').toISOString(),
    status: 'active' as const,
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: '2',
    brandId: '1',
    title: 'Product Launch - Eco Friendly Line',
    brief: 'Launch campaign for our new eco-friendly product line',
    budget: 8000,
    deadline: new Date('2024-07-15').toISOString(),
    status: 'active' as const,
    createdAt: new Date('2024-01-20').toISOString(),
    updatedAt: new Date('2024-01-20').toISOString(),
  },
  {
    id: '3',
    brandId: '1',
    title: 'Holiday Special Campaign',
    brief: 'Create engaging content for holiday season promotions',
    budget: 3000,
    deadline: new Date('2024-12-20').toISOString(),
    status: 'draft' as const,
    createdAt: new Date('2024-02-01').toISOString(),
    updatedAt: new Date('2024-02-01').toISOString(),
  },
];

export const mockAnalytics = {
  totalCampaigns: 3,
  totalInfluencers: 5,
  pendingVerifications: 2,
  totalSpend: 16000,
};

export const mockCampaignInfluencers = [
  {
    id: '1',
    campaignId: '1',
    influencerId: '2',
    status: 'submitted' as const,
    postUrl: 'https://instagram.com/p/example1',
    screenshotUrl: 'https://via.placeholder.com/400x600',
    likes: 1250,
    comments: 89,
    submittedAt: new Date('2024-02-10').toISOString(),
    createdAt: new Date('2024-01-16').toISOString(),
    updatedAt: new Date('2024-02-10').toISOString(),
    campaign: mockCampaigns[0],
    influencer: {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      role: 'influencer' as const,
    },
  },
  {
    id: '2',
    campaignId: '1',
    influencerId: '3',
    status: 'verified' as const,
    postUrl: 'https://instagram.com/p/example2',
    screenshotUrl: 'https://via.placeholder.com/400x600',
    likes: 2100,
    comments: 156,
    submittedAt: new Date('2024-02-08').toISOString(),
    createdAt: new Date('2024-01-16').toISOString(),
    updatedAt: new Date('2024-02-12').toISOString(),
    campaign: mockCampaigns[0],
    influencer: {
      id: '3',
      name: 'Mike Chen',
      email: 'mike@example.com',
      role: 'influencer' as const,
    },
  },
];

export const mockPayments = [
  {
    id: '1',
    campaignInfluencerId: '2',
    amount: 1000,
    status: 'pending' as const,
    paidAt: null,
    createdAt: new Date('2024-02-12').toISOString(),
    updatedAt: new Date('2024-02-12').toISOString(),
    campaignInfluencer: mockCampaignInfluencers[1],
  },
];

// Mock API responses
export const mockApiResponses = {
  login: (email: string, password: string) => {
    return Promise.resolve({
      access_token: 'mock-jwt-token',
      user: mockUser,
    });
  },

  register: (data: any) => {
    return Promise.resolve({
      id: '1',
      name: data.name,
      email: data.email,
      role: data.role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  },

  getProfile: () => {
    return Promise.resolve(mockUser);
  },

  getUsers: (role?: 'brand' | 'influencer') => {
    const users = [
      mockUser,
      { id: '2', name: 'Sarah Johnson', email: 'sarah@example.com', role: 'influencer' as const },
      { id: '3', name: 'Mike Chen', email: 'mike@example.com', role: 'influencer' as const },
      { id: '4', name: 'Emma Davis', email: 'emma@example.com', role: 'influencer' as const },
    ];
    return Promise.resolve(role ? users.filter(u => u.role === role) : users);
  },

  getCampaigns: () => {
    return Promise.resolve(mockCampaigns);
  },

  getCampaign: (id: string) => {
    return Promise.resolve(mockCampaigns.find(c => c.id === id) || mockCampaigns[0]);
  },

  getAnalytics: () => {
    return Promise.resolve(mockAnalytics);
  },

  getCampaignInfluencers: () => {
    return Promise.resolve(mockCampaignInfluencers);
  },

  getPayments: () => {
    return Promise.resolve(mockPayments);
  },

  createCampaign: (data: any) => {
    return Promise.resolve({
      id: String(mockCampaigns.length + 1),
      ...data,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  },
};
