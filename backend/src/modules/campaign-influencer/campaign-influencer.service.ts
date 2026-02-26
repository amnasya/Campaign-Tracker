import { CampaignInfluencerStatus } from '@prisma/client';
import { UserRole } from '@prisma/client';
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  AssignInfluencerDto,
  SubmitDeliverableDto,
  CampaignInfluencerResponseDto,
} from './dto';

import { validateWorkflowTransition } from './utils/workflow-validation';

@Injectable()
export class CampaignInfluencerService {
  constructor(private prisma: PrismaService) {}

  async assignInfluencer(
    dto: AssignInfluencerDto,
    brandId: string,
  ): Promise<CampaignInfluencerResponseDto> {
    // Verify campaign exists and belongs to the brand
    const campaign = await this.prisma.campaign.findUnique({
      where: { id: dto.campaignId },
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    if (campaign.brandId !== brandId) {
      throw new ForbiddenException(
        'You do not have permission to assign influencers to this campaign',
      );
    }

    // Verify influencer exists and has the influencer role
    const influencer = await this.prisma.user.findUnique({
      where: { id: dto.influencerId },
    });

    if (!influencer) {
      throw new NotFoundException('Influencer not found');
    }

    if (influencer.role !== UserRole.influencer) {
      throw new BadRequestException(
        'User must have influencer role to be assigned to campaigns',
      );
    }

    // Check for duplicate assignment
    const existingAssignment = await this.prisma.campaignInfluencer.findUnique({
      where: {
        campaignId_influencerId: {
          campaignId: dto.campaignId,
          influencerId: dto.influencerId,
        },
      },
    });

    if (existingAssignment) {
      throw new ConflictException(
        'Influencer is already assigned to this campaign',
      );
    }

    // Create the assignment
    const assignment = await this.prisma.campaignInfluencer.create({
      data: {
        campaignId: dto.campaignId,
        influencerId: dto.influencerId,
        status: CampaignInfluencerStatus.invited,
      },
    });

    return this.toResponseDto(assignment);
  }

  async findByInfluencer(
    influencerId: string,
  ): Promise<CampaignInfluencerResponseDto[]> {
    const assignments = await this.prisma.campaignInfluencer.findMany({
      where: { influencerId },
      include: {
        campaign: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return assignments.map((assignment) =>
      this.toResponseDto(assignment, true, false),
    );
  }

  async findByCampaign(
    campaignId: string,
    brandId: string,
  ): Promise<CampaignInfluencerResponseDto[]> {
    // Verify campaign belongs to the brand
    const campaign = await this.prisma.campaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    if (campaign.brandId !== brandId) {
      throw new ForbiddenException(
        'You do not have permission to view this campaign',
      );
    }

    const assignments = await this.prisma.campaignInfluencer.findMany({
      where: { campaignId },
      include: {
        influencer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return assignments.map((assignment) =>
      this.toResponseDto(assignment, false, true),
    );
  }

  async acceptCampaign(
    id: string,
    influencerId: string,
  ): Promise<CampaignInfluencerResponseDto> {
    const assignment = await this.prisma.campaignInfluencer.findUnique({
      where: { id },
    });

    if (!assignment) {
      throw new NotFoundException('Campaign assignment not found');
    }

    // Verify the assignment belongs to the influencer
    if (assignment.influencerId !== influencerId) {
      throw new ForbiddenException(
        'You do not have permission to accept this campaign',
      );
    }

    // Validate workflow transition
    validateWorkflowTransition(assignment.status, CampaignInfluencerStatus.accepted);

    // Update status to accepted
    const updatedAssignment = await this.prisma.campaignInfluencer.update({
      where: { id },
      data: {
        status: CampaignInfluencerStatus.accepted,
      },
    });

    return this.toResponseDto(updatedAssignment);
  }

  async submitDeliverable(
    id: string,
    influencerId: string,
    dto: SubmitDeliverableDto,
  ): Promise<CampaignInfluencerResponseDto> {
    const assignment = await this.prisma.campaignInfluencer.findUnique({
      where: { id },
    });

    if (!assignment) {
      throw new NotFoundException('Campaign assignment not found');
    }

    // Verify the assignment belongs to the influencer
    if (assignment.influencerId !== influencerId) {
      throw new ForbiddenException(
        'You do not have permission to submit deliverables for this campaign',
      );
    }

    // Validate workflow transition
    validateWorkflowTransition(assignment.status, CampaignInfluencerStatus.submitted);

    // Update with deliverable data
    const updatedAssignment = await this.prisma.campaignInfluencer.update({
      where: { id },
      data: {
        status: CampaignInfluencerStatus.submitted,
        postUrl: dto.postUrl,
        screenshotUrl: dto.screenshotUrl,
        likes: dto.likes,
        comments: dto.comments,
        submittedAt: new Date(),
      },
    });

    return this.toResponseDto(updatedAssignment);
  }

  async verifySubmission(
    id: string,
    brandId: string,
  ): Promise<CampaignInfluencerResponseDto> {
    const assignment = await this.prisma.campaignInfluencer.findUnique({
      where: { id },
      include: {
        campaign: true,
      },
    });

    if (!assignment) {
      throw new NotFoundException('Campaign assignment not found');
    }

    // Verify the campaign belongs to the brand
    if (assignment.campaign.brandId !== brandId) {
      throw new ForbiddenException(
        'You do not have permission to verify this submission',
      );
    }

    // Validate workflow transition
    validateWorkflowTransition(assignment.status, CampaignInfluencerStatus.verified);

    // Update status to verified and create payment
    const updatedAssignment = await this.prisma.campaignInfluencer.update({
      where: { id },
      data: {
        status: CampaignInfluencerStatus.verified,
        payment: {
          create: {
            amount: assignment.campaign.budget,
            status: 'pending',
          },
        },
      },
    });

    return this.toResponseDto(updatedAssignment);
  }

  private toResponseDto(
    assignment: any,
    includeCampaign = false,
    includeInfluencer = false,
  ): CampaignInfluencerResponseDto {
    const response: CampaignInfluencerResponseDto = {
      id: assignment.id,
      campaignId: assignment.campaignId,
      influencerId: assignment.influencerId,
      status: assignment.status,
      postUrl: assignment.postUrl,
      screenshotUrl: assignment.screenshotUrl,
      likes: assignment.likes,
      comments: assignment.comments,
      submittedAt: assignment.submittedAt,
      createdAt: assignment.createdAt,
      updatedAt: assignment.updatedAt,
    };

    if (includeCampaign && assignment.campaign) {
      response.campaign = {
        id: assignment.campaign.id,
        title: assignment.campaign.title,
        brief: assignment.campaign.brief,
        budget: Number(assignment.campaign.budget),
        deadline: assignment.campaign.deadline,
        status: assignment.campaign.status,
      };
    }

    if (includeInfluencer && assignment.influencer) {
      response.influencer = {
        id: assignment.influencer.id,
        name: assignment.influencer.name,
        email: assignment.influencer.email,
      };
    }

    return response;
  }
}

