import { IsString, IsNotEmpty, IsInt, Min, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';
import { Sanitize } from '../../../decorators/sanitize.decorator';

export class SubmitDeliverableDto {
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  @Sanitize()
  postUrl: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  @Sanitize()
  screenshotUrl: string;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  likes: number;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  comments: number;
}

