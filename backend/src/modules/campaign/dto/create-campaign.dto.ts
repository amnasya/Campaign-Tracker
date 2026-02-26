import { IsString, IsNotEmpty, IsNumber, IsPositive, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { Sanitize } from '../../../decorators/sanitize.decorator';

export class CreateCampaignDto {
  @IsString()
  @IsNotEmpty()
  @Sanitize()
  title: string;

  @IsString()
  @IsNotEmpty()
  @Sanitize()
  brief: string;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  budget: number;

  @IsDateString()
  deadline: string;
}

