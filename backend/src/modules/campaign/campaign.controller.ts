import { CampaignStatus } from '@prisma/client';
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
import { CampaignService } from './campaign.service';
import {
  CreateCampaignDto,
  UpdateCampaignDto,
  UpdateCampaignStatusDto,
  CampaignResponseDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';


@Controller('campaigns')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Post()
  @Roles(UserRole.brand)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Request() req,
    @Body() createCampaignDto: CreateCampaignDto,
  ): Promise<CampaignResponseDto> {
    return this.campaignService.create(req.user.userId, createCampaignDto);
  }

  @Get()
  @Roles(UserRole.brand)
  async findAll(@Request() req): Promise<CampaignResponseDto[]> {
    return this.campaignService.findAllByBrand(req.user.userId);
  }

  @Get('analytics')
  @Roles(UserRole.brand)
  async getAnalytics(@Request() req): Promise<{
    totalCampaigns: number;
    totalInfluencers: number;
    pendingVerifications: number;
    totalSpend: number;
  }> {
    return this.campaignService.getAnalytics(req.user.userId);
  }

  @Get(':id')
  @Roles(UserRole.brand)
  async findOne(
    @Request() req,
    @Param('id') id: string,
  ): Promise<CampaignResponseDto> {
    return this.campaignService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  @Roles(UserRole.brand)
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateCampaignDto: UpdateCampaignDto,
  ): Promise<CampaignResponseDto> {
    return this.campaignService.update(id, req.user.userId, updateCampaignDto);
  }

  @Patch(':id/status')
  @Roles(UserRole.brand)
  async updateStatus(
    @Request() req,
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateCampaignStatusDto,
  ): Promise<CampaignResponseDto> {
    return this.campaignService.updateStatus(
      id,
      req.user.userId,
      updateStatusDto.status,
    );
  }
}

