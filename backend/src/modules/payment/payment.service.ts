import { PaymentStatus } from '@prisma/client';
import { CampaignInfluencerStatus } from '@prisma/client';
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PaymentResponseDto } from './dto';


@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async create(
    campaignInfluencerId: string,
    amount: number,
  ): Promise<PaymentResponseDto> {
    const payment = await this.prisma.payment.create({
      data: {
        campaignInfluencerId,
        amount,
        status: PaymentStatus.pending,
      },
    });

    return this.toPaymentResponse(payment);
  }

  async markAsPaid(id: string, brandId: string): Promise<PaymentResponseDto> {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: {
        campaignInfluencer: {
          include: {
            campaign: true,
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Authorization: Verify the campaign belongs to the brand
    if (payment.campaignInfluencer.campaign.brandId !== brandId) {
      throw new ForbiddenException(
        'You do not have permission to update this payment',
      );
    }

    // Validate payment status transition
    if (payment.status !== PaymentStatus.pending) {
      throw new BadRequestException(
        `Cannot transition from ${payment.status} to paid`,
      );
    }

    // Update payment status in a transaction
    const [updatedPayment] = await this.prisma.$transaction([
      this.prisma.payment.update({
        where: { id },
        data: {
          status: PaymentStatus.paid,
          paidAt: new Date(),
        },
      }),
    ]);

    return this.toPaymentResponse(updatedPayment);
  }

  async findByCampaign(
    campaignId: string,
    brandId: string,
  ): Promise<PaymentResponseDto[]> {
    // First verify the campaign belongs to the brand
    const campaign = await this.prisma.campaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    if (campaign.brandId !== brandId) {
      throw new ForbiddenException(
        'You do not have permission to access payments for this campaign',
      );
    }

    // Get all payments for the campaign
    const payments = await this.prisma.payment.findMany({
      where: {
        campaignInfluencer: {
          campaignId,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return payments.map((payment) => this.toPaymentResponse(payment));
  }

  async findByInfluencer(influencerId: string): Promise<PaymentResponseDto[]> {
    const payments = await this.prisma.payment.findMany({
      where: {
        campaignInfluencer: {
          influencerId,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return payments.map((payment) => this.toPaymentResponse(payment));
  }

  private toPaymentResponse(payment: any): PaymentResponseDto {
    return {
      id: payment.id,
      campaignInfluencerId: payment.campaignInfluencerId,
      amount: Number(payment.amount),
      status: payment.status,
      paidAt: payment.paidAt,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    };
  }
}

