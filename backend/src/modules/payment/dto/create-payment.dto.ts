import { IsNotEmpty, IsNumber, IsPositive, IsUUID } from 'class-validator';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsUUID()
  campaignInfluencerId: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number;
}

