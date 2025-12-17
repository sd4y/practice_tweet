import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@repo/database';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class TweetsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService
  ) {}

  async create(data: Prisma.TweetCreateInput) {
    const tweet = await this.prisma.tweet.create({
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

    if (data.parent?.connect?.id && data.author?.connect?.id) {
       const parentTweet = await this.prisma.tweet.findUnique({ where: { id: data.parent.connect.id } });
       if (parentTweet && parentTweet.authorId !== data.author.connect.id) {
           await this.notificationsService.create({
               type: 'REPLY',
               user: { connect: { id: parentTweet.authorId } },
               issuer: { connect: { id: data.author.connect.id } },
               tweet: { connect: { id: tweet.id } }
           });
       }
    }

    return tweet;
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

      const tweet = await this.prisma.tweet.findUnique({ where: { id: tweetId } });
      if (tweet && tweet.authorId !== userId) {
          await this.notificationsService.create({
              type: 'LIKE',
              user: { connect: { id: tweet.authorId } },
              issuer: { connect: { id: userId } },
              tweet: { connect: { id: tweetId } }
          });
      }

      return { liked: true };
    }
  }

  async findAll(userId?: string, authorId?: string, excludeReplies: boolean = false, onlyFollowing: boolean = false, page: number = 1, limit: number = 3) {
    let whereClause: Prisma.TweetWhereInput = {
      AND: [
        authorId ? { authorId } : {},
        excludeReplies ? { parentId: null } : {}
      ]
    };

    if (onlyFollowing && userId) {
      const following = await this.prisma.follow.findMany({
        where: { followerId: userId },
        select: { followingId: true }
      });
      const followingIds = following.map(f => f.followingId);
      // Include own tweets as well? Usually yes or no. Let's strictly follow "following".
      // But typically "Following" feed includes only following.
      // If user wants to see own tweets, they go to profile.
      // Let's stick to followingIds.
      whereClause.AND = [
        ...(whereClause.AND as Prisma.TweetWhereInput[]),
        { authorId: { in: followingIds } }
      ];
    }

    const tweets = await this.prisma.tweet.findMany({
      where: whereClause,
      take: limit,
      skip: (page - 1) * limit,
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
            replies: true,
            retweets: true,
            quotes: true,
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
      isLiked: userId ? (tweet.likes as any[]).length > 0 : false,
      likes: tweet._count.likes,
      retweets: tweet._count.retweets,
      replies: tweet._count.replies,
      views: tweet.views,
    }));
  }

  async findOne(id: string, userId?: string) {
    const tweet = await this.prisma.tweet.findUnique({
      where: { id },
      include: {
        author: true,
        replies: {
          include: {
            author: true,
            _count: { select: { likes: true, replies: true, retweets: true, quotes: true } },
            likes: userId ? {
               where: { userId },
               select: { userId: true }
             } : false,
          },
          orderBy: { createdAt: 'asc' }
        },
        _count: {
          select: { likes: true, replies: true, retweets: true, quotes: true },
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
      isLiked: userId ? (tweet.likes as any[]).length > 0 : false,
      likes: tweet._count.likes,
      retweets: tweet._count.retweets,
      replies: tweet._count.replies,
      views: tweet.views,
      children: tweet.replies.map(child => ({
        ...child,
        isLiked: userId ? (child.likes as any[]).length > 0 : false,
        likes: child._count.likes,
        retweets: child._count.retweets,
        replies: child._count.replies,
        views: child.views,
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
