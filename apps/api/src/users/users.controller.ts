import { Controller, Get, Body, Patch, Param, UseGuards, Request, NotFoundException, Post, Delete, Headers } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  @Get(':username')
  async getUserProfile(@Param('username') username: string, @Headers('authorization') authHeader?: string) {
    let userId: string | undefined;
    if (authHeader) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded: any = this.jwtService.decode(token);
        if (decoded?.sub) {
          userId = decoded.sub;
        } else if (decoded?.userId) {
          userId = decoded.userId;
        }
      } catch (e) {
        // ignore
      }
    }

    const user = await this.usersService.findByUsername(username, userId);
    if (!user) {
      throw new NotFoundException(`User @${username} not found`);
    }
    const { password, ...result } = user;
    return result;
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('profile')
  async updateProfile(@Request() req: any, @Body() updateData: { name?: string; bio?: string; location?: string; website?: string; avatar?: string; coverImage?: string }) {
    return this.usersService.update(req.user.userId, updateData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/follow')
  async followUser(@Param('id') targetId: string, @Request() req: any) {
    return this.usersService.follow(req.user.userId, targetId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id/follow')
  async unfollowUser(@Param('id') targetId: string, @Request() req: any) {
    return this.usersService.unfollow(req.user.userId, targetId);
  }
}
