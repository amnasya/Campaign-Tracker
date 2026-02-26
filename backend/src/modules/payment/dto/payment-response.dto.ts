import { PaymentStatus } from '@prisma/client';


export class PaymentResponseDto {
  id: string;
  campaignInfluencerId: string;
  amount: number;
  status: PaymentStatus;
  paidAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

