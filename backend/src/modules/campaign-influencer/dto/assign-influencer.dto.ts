import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class AssignInfluencerDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  campaignId: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  influencerId: string;
}

