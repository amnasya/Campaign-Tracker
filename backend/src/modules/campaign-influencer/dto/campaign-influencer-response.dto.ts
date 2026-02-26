import { CampaignInfluencerStatus } from '@prisma/client';


export class CampaignInfluencerResponseDto {
  id: string;
  campaignId: string;
  influencerId: string;
  status: CampaignInfluencerStatus;
  postUrl: string | null;
  screenshotUrl: string | null;
  likes: number | null;
  comments: number | null;
  submittedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  campaign?: {
    id: string;
    title: string;
    brief: string;
    budget: number;
    deadline: Date;
    status: string;
  };
  influencer?: {
    id: string;
    name: string;
    email: string;
  };
}

