import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@repo/database';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    console.log(`[AuthService] Validating user: ${email}`);
    const user = await this.usersService.findOne(email);
    if (user) {
      console.log('[AuthService] User found, checking password...');
      const isMatch = await bcrypt.compare(pass, user.password);
      if (isMatch) {
        console.log('[AuthService] Password validation successful');
        const { password, ...result } = user;
        return result;
      } else {
        console.log('[AuthService] Password validation failed');
      }
    } else {
      console.log('[AuthService] User not found');
    }
    return null;
  }

  async login(user: any) {
    console.log('[AuthService] Generating JWT for user:', user.email);
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: user,
    };
  }

  async register(data: Prisma.UserCreateInput) {
    console.log('[AuthService] Registering new user:', data.email);
    try {
      const user = await this.usersService.create(data);
      console.log('[AuthService] User created successfully:', user.id);
      return this.login(user);
    } catch (error) {
      console.error('[AuthService] Registration error:', error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Email or username already already exists');
        }
      }
      throw error;
    }
  }
}
