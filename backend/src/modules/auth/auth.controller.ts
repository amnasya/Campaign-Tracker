import { UserRole } from '@prisma/client';
import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, UserResponseDto } from './dto';
import { JwtAuthGuard } from './guards';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto): Promise<UserResponseDto> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<{ access_token: string; user: UserResponseDto }> {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req): Promise<UserResponseDto> {
    // The user is already attached to the request by the JWT strategy
    return {
      id: req.user.userId,
      email: req.user.email,
      role: req.user.role,
      name: '', // We don't have name in the JWT payload, would need to fetch from DB
      createdAt: new Date(), // Same here
    };
  }

  @Get('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.brand)
  async getUsers(@Query('role') role?: string): Promise<UserResponseDto[]> {
    return this.authService.getUsers(role);
  }
}

