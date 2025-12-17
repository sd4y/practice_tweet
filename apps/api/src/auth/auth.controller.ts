import { Controller, Post, Body, UseGuards, Request, Get, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Prisma } from '@repo/database';
import { AuthGuard } from '@nestjs/passport';

import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  @Post('signup')
  async signup(@Body() userData: Prisma.UserCreateInput) {
    console.log('[AuthController] Signup request received:', { ...userData, password: '***' });
    return this.authService.register(userData);
  }

  @Post('login')
  async login(@Body() req: any) {
    console.log('[AuthController] Login request received for email:', req.email);
    const user = await this.authService.validateUser(req.email, req.password);
    if (!user) {
      console.log('[AuthController] Login failed: Invalid credentials');
      throw new UnauthorizedException('Invalid credentials');
    }
    console.log('[AuthController] Login successful, generating token for:', user.id);
    return this.authService.login(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getProfile(@Request() req: any) {
    const user = await this.usersService.findById(req.user.userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const { password, ...result } = user;
    return result;
  }
}
