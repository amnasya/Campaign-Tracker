import { CampaignStatus } from '@prisma/client';


export class CampaignResponseDto {
  id: string;
  brandId: string;
  title: string;
  brief: string;
  budget: number;
  deadline: Date;
  status: CampaignStatus;
  createdAt: Date;
  updatedAt: Date;
}

