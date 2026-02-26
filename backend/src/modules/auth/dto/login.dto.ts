import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Sanitize } from '../../../decorators/sanitize.decorator';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  @Sanitize()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

