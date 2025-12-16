import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@repo/database';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.NotificationCreateInput) {
    return this.prisma.notification.create({
      data,
    });
  }

  async findAll(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      include: {
        issuer: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        tweet: {
          select: {
            id: true,
            content: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async markAsRead(id: string, userId: string) {
     // Verify ownership
     const notification = await this.prisma.notification.findFirst({
        where: { id, userId }
     });
     
     if (!notification) return null;

     return this.prisma.notification.update({
       where: { id },
       data: { read: true },
     });
  }
}
