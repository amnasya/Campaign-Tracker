import { CampaignStatus } from '@prisma/client';
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateCampaignDto,
  UpdateCampaignDto,
  CampaignResponseDto,
} from './dto';


@Injectable()
export class CampaignService {
  constructor(private prisma: PrismaService) {}

  async create(
    brandId: string,
    dto: CreateCampaignDto,
  ): Promise<CampaignResponseDto> {
    // Validate deadline is in the future
    const deadline = new Date(dto.deadline);
    if (deadline <= new Date()) {
      throw new BadRequestException('Deadline must be a future date');
    }

    const campaign = await this.prisma.campaign.create({
      data: {
        brandId,
        title: dto.title,
        brief: dto.brief,
        budget: dto.budget,
        deadline,
        status: CampaignStatus.draft,
      },
    });

    return this.toCampaignResponse(campaign);
  }

  async findAllByBrand(brandId: string): Promise<CampaignResponseDto[]> {
    const campaigns = await this.prisma.campaign.findMany({
      where: { brandId },
      orderBy: { createdAt: 'desc' },
    });

    return campaigns.map((campaign) => this.toCampaignResponse(campaign));
  }

  async findOne(id: string, userId: string): Promise<CampaignResponseDto> {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id },
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    // Authorization: Only the brand owner can access the campaign
    if (campaign.brandId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to access this campaign',
      );
    }

    return this.toCampaignResponse(campaign);
  }

  async update(
    id: string,
    brandId: string,
    dto: UpdateCampaignDto,
  ): Promise<CampaignResponseDto> {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id },
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    // Authorization: Only the brand owner can update the campaign
    if (campaign.brandId !== brandId) {
      throw new ForbiddenException(
        'You do not have permission to update this campaign',
      );
    }

    // Validate deadline if provided
    if (dto.deadline) {
      const deadline = new Date(dto.deadline);
      if (deadline <= new Date()) {
        throw new BadRequestException('Deadline must be a future date');
      }
    }

    const updatedCampaign = await this.prisma.campaign.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.brief && { brief: dto.brief }),
        ...(dto.budget && { budget: dto.budget }),
        ...(dto.deadline && { deadline: new Date(dto.deadline) }),
      },
    });

    return this.toCampaignResponse(updatedCampaign);
  }

  async updateStatus(
    id: string,
    brandId: string,
    status: CampaignStatus,
  ): Promise<CampaignResponseDto> {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id },
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    // Authorization: Only the brand owner can update the campaign status
    if (campaign.brandId !== brandId) {
      throw new ForbiddenException(
        'You do not have permission to update this campaign',
      );
    }

    // Validate status transition
    this.validateStatusTransition(campaign.status, status);

    const updatedCampaign = await this.prisma.campaign.update({
      where: { id },
      data: { status },
    });

    return this.toCampaignResponse(updatedCampaign);
  }

  async getAnalytics(brandId: string): Promise<{
    totalCampaigns: number;
    totalInfluencers: number;
    pendingVerifications: number;
    totalSpend: number;
  }> {
    // Get all campaigns for the brand
    const campaigns = await this.prisma.campaign.findMany({
      where: { brandId },
      include: {
        campaignInfluencers: {
          include: {
            payment: true,
          },
        },
      },
    });

    const totalCampaigns = campaigns.length;

    // Count unique influencers across all campaigns
    const influencerIds = new Set<string>();
    let pendingVerifications = 0;
    let totalSpend = 0;

    campaigns.forEach((campaign) => {
      campaign.campaignInfluencers.forEach((ci) => {
        influencerIds.add(ci.influencerId);

        // Count pending verifications (submitted status)
        if (ci.status === 'submitted') {
          pendingVerifications++;
        }

        // Sum up paid amounts
        if (ci.payment && ci.payment.status === 'paid') {
          totalSpend += Number(ci.payment.amount);
        }
      });
    });

    return {
      totalCampaigns,
      totalInfluencers: influencerIds.size,
      pendingVerifications,
      totalSpend,
    };
  }

  private validateStatusTransition(
    currentStatus: CampaignStatus,
    newStatus: CampaignStatus,
  ): void {
    const allowedTransitions: Record<CampaignStatus, CampaignStatus[]> = {
      [CampaignStatus.draft]: [CampaignStatus.active],
      [CampaignStatus.active]: [CampaignStatus.completed],
      [CampaignStatus.completed]: [],
    };

    const allowed = allowedTransitions[currentStatus] || [];

    if (!allowed.includes(newStatus)) {
      throw new BadRequestException(
        `Cannot transition from ${currentStatus} to ${newStatus}`,
      );
    }
  }

  private toCampaignResponse(campaign: any): CampaignResponseDto {
    return {
      id: campaign.id,
      brandId: campaign.brandId,
      title: campaign.title,
      brief: campaign.brief,
      budget: Number(campaign.budget),
      deadline: campaign.deadline,
      status: campaign.status,
      createdAt: campaign.createdAt,
      updatedAt: campaign.updatedAt,
    };
  }
}

