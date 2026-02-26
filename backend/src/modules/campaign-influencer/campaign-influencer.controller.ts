import { UserRole } from '@prisma/client';
import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CampaignInfluencerService } from './campaign-influencer.service';
import {
  AssignInfluencerDto,
  SubmitDeliverableDto,
  CampaignInfluencerResponseDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';


@Controller('campaign-influencers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CampaignInfluencerController {
  constructor(
    private readonly campaignInfluencerService: CampaignInfluencerService,
  ) {}

  @Post()
  @Roles(UserRole.brand)
  @HttpCode(HttpStatus.CREATED)
  async assignInfluencer(
    @Request() req,
    @Body() dto: AssignInfluencerDto,
  ): Promise<CampaignInfluencerResponseDto> {
    return this.campaignInfluencerService.assignInfluencer(dto, req.user.userId);
  }

  @Get('my-campaigns')
  @Roles(UserRole.influencer)
  async getMyCampaigns(@Request() req): Promise<CampaignInfluencerResponseDto[]> {
    return this.campaignInfluencerService.findByInfluencer(req.user.userId);
  }

  @Get('campaign/:campaignId')
  @Roles(UserRole.brand)
  async getCampaignInfluencers(
    @Request() req,
    @Param('campaignId') campaignId: string,
  ): Promise<CampaignInfluencerResponseDto[]> {
    return this.campaignInfluencerService.findByCampaign(campaignId, req.user.userId);
  }

  @Patch(':id/accept')
  @Roles(UserRole.influencer)
  async acceptCampaign(
    @Request() req,
    @Param('id') id: string,
  ): Promise<CampaignInfluencerResponseDto> {
    return this.campaignInfluencerService.acceptCampaign(id, req.user.userId);
  }

  @Patch(':id/submit')
  @Roles(UserRole.influencer)
  async submitDeliverable(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: SubmitDeliverableDto,
  ): Promise<CampaignInfluencerResponseDto> {
    return this.campaignInfluencerService.submitDeliverable(id, req.user.userId, dto);
  }

  @Patch(':id/verify')
  @Roles(UserRole.brand)
  async verifySubmission(
    @Request() req,
    @Param('id') id: string,
  ): Promise<CampaignInfluencerResponseDto> {
    return this.campaignInfluencerService.verifySubmission(id, req.user.userId);
  }
}

