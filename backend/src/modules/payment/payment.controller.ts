import { UserRole } from '@prisma/client';
import {
  Controller,
  Get,
  Patch,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentResponseDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';


@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('campaign/:campaignId')
  @Roles(UserRole.brand)
  async findByCampaign(
    @Request() req,
    @Param('campaignId') campaignId: string,
  ): Promise<PaymentResponseDto[]> {
    return this.paymentService.findByCampaign(campaignId, req.user.userId);
  }

  @Get('my-payments')
  @Roles(UserRole.influencer)
  async findMyPayments(@Request() req): Promise<PaymentResponseDto[]> {
    return this.paymentService.findByInfluencer(req.user.userId);
  }

  @Patch(':id/mark-paid')
  @Roles(UserRole.brand)
  @HttpCode(HttpStatus.OK)
  async markAsPaid(
    @Request() req,
    @Param('id') id: string,
  ): Promise<PaymentResponseDto> {
    return this.paymentService.markAsPaid(id, req.user.userId);
  }
}

