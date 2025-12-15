import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@repo/database';

@Injectable()
export class TweetsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.TweetCreateInput) {
    return this.prisma.tweet.create({
      data,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
      },
    });
  }

  async toggleLike(tweetId: string, userId: string) {
    const like = await this.prisma.like.findUnique({
      where: {
        userId_tweetId: {
          userId,
          tweetId,
        },
      },
    });

    if (like) {
      await this.prisma.like.delete({
        where: {
          userId_tweetId: {
            userId,
            tweetId,
          },
        },
      });
      return { liked: false };
    } else {
      await this.prisma.like.create({
        data: {
          userId,
          tweetId,
        },
      });
      return { liked: true };
    }
  }

  async findAll(userId?: string) {
    const tweets = await this.prisma.tweet.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            likes: true,
            children: true,
          },
        },
        likes: userId ? {
          where: { userId },
          select: { userId: true }
        } : false,
      },
    });

    return tweets.map(tweet => ({
      ...tweet,
      isLiked: userId ? tweet.likes.length > 0 : false,
      likes: undefined // remove the likes array from the response to clean it up
    }));
  }

  async findOne(id: string, userId?: string) {
    const tweet = await this.prisma.tweet.findUnique({
      where: { id },
      include: {
        author: true,
        children: {
          include: {
            author: true,
            _count: { select: { likes: true, children: true } },
            likes: userId ? {
               where: { userId },
               select: { userId: true }
             } : false,
          },
          orderBy: { createdAt: 'asc' }
        },
        _count: {
          select: { likes: true, children: true },
        },
        likes: userId ? {
          where: { userId },
          select: { userId: true }
        } : false,
      },
    });

    if (!tweet) return null;

    return {
      ...tweet,
      isLiked: userId ? tweet.likes.length > 0 : false,
      likes: undefined,
      children: tweet.children.map(child => ({
        ...child,
        isLiked: userId ? child.likes.length > 0 : false,
        likes: undefined
      }))
    };
  }

  async remove(id: string, userId: string) {
    const tweet = await this.prisma.tweet.findUnique({ where: { id } });
    if (!tweet) {
      throw new NotFoundException(`Tweet with ID ${id} not found`);
    }

    if (tweet.authorId !== userId) {
      throw new ForbiddenException('You are not allowed to delete this tweet');
    }

    return this.prisma.tweet.delete({
      where: { id },
    });
  }

  async update(id: string, userId: string, content: string) {
    const tweet = await this.prisma.tweet.findUnique({ where: { id } });
    if (!tweet) {
      throw new NotFoundException(`Tweet with ID ${id} not found`);
    }

    if (tweet.authorId !== userId) {
      throw new ForbiddenException('You are not allowed to update this tweet');
    }

    return this.prisma.tweet.update({
      where: { id },
      data: { content },
    });
  }
}
