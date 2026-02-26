import { IsString, IsOptional, IsNumber, IsPositive, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateCampaignDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  brief?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  budget?: number;

  @IsDateString()
  @IsOptional()
  deadline?: string;
}

