import { Controller, Get, Post, Body, UseGuards, Request, Param, Delete, Headers, Patch } from '@nestjs/common';
import { TweetsService } from './tweets.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@repo/database';

@Controller('tweets')
export class TweetsController {
  constructor(
    private readonly tweetsService: TweetsService,
    private readonly jwtService: JwtService
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createTweetDto: { content: string; image?: string; parentId?: string }, @Request() req: any) {
    const data: any = {
      content: createTweetDto.content,
      image: createTweetDto.image,
      author: {
        connect: { id: req.user.userId },
      },
    };

    if (createTweetDto.parentId) {
      data.parent = {
        connect: { id: createTweetDto.parentId },
      };
    }

    return this.tweetsService.create(data);
  }

  @Get()
  findAll(@Headers('authorization') authHeader?: string) {
    let userId: string | undefined;
    if (authHeader) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded: any = this.jwtService.decode(token);
        if (decoded?.userId) {
          userId = decoded.userId;
        }
      } catch (e) {
        // ignore invalid tokens
      }
    }
    return this.tweetsService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Headers('authorization') authHeader?: string) {
    let userId: string | undefined;
    if (authHeader) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded: any = this.jwtService.decode(token);
        if (decoded?.userId) {
          userId = decoded.userId;
        }
      } catch (e) {
        // ignore invalid tokens
      }
    }
    return this.tweetsService.findOne(id, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any) {
    console.log(`Attempting to delete tweet ${id} by user ${req.user.userId}`);
    return this.tweetsService.remove(id, req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: { content: string }, @Request() req: any) {
    return this.tweetsService.update(id, req.user.userId, body.content);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/like')
  async toggleLike(@Param('id') id: string, @Request() req: any) {
    return this.tweetsService.toggleLike(id, req.user.userId);
  }
}
