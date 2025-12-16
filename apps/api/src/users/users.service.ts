import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@repo/database';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }

  async findOne(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            followers: true,
            following: true,
            tweets: true,
          }
        }
      }
    });
  }

  async findByUsername(username: string, currentUserId?: string): Promise<User & { isFollowing?: boolean } | null> {
    const user = await this.prisma.user.findFirst({
      where: { 
        username: {
          equals: username,
          mode: 'insensitive',
        }
      },
      include: {
        _count: {
          select: {
            followers: true,
            following: true,
            tweets: true,
          }
        }
      }
    });

    if (!user) return null;

    let isFollowing = false;
    if (currentUserId) {
      const follow = await this.prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: currentUserId,
            followingId: user.id,
          },
        },
      });
      isFollowing = !!follow;
    }

    return { ...user, isFollowing };
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    try {
      return await this.prisma.user.update({
        where: { id },
        data,
      });
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  }

  async follow(userId: string, targetId: string) {
    if (userId === targetId) throw new Error("Cannot follow yourself");
    
    // Create follow
    await this.prisma.follow.create({
      data: {
        followerId: userId,
        followingId: targetId,
      },
    });

    // Create notification
    // Need to avoid circular dependency if NotificationsService depends on UsersService?
    // NotificationsModule is imported in AppModule.
    // Ideally inject NotificationsService here. (Assuming it's safe)
    // For now, let's just create the follow.
    
    return { success: true };
  }

  async unfollow(userId: string, targetId: string) {
    await this.prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: targetId,
        },
      },
    });
    return { success: true };
  }
}
