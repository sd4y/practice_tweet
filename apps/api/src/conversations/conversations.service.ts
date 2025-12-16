import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@repo/database';

@Injectable()
export class ConversationsService {
  constructor(private prisma: PrismaService) {}

  async createOrGet(userId: string, otherUserId: string) {
    if (userId === otherUserId) {
      throw new Error("Cannot chat with yourself");
    }

    // Check if conversation exists
    const existing = await this.prisma.conversation.findFirst({
      where: {
        AND: [
          { participants: { some: { userId } } },
          { participants: { some: { userId: otherUserId } } }
        ]
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                avatar: true
              }
            }
          }
        }
      }
    });

    if (existing) return existing;

    // Create new conversation
    return this.prisma.conversation.create({
      data: {
        participants: {
          create: [
            { userId: userId },
            { userId: otherUserId }
          ]
        }
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                avatar: true
              }
            }
          }
        }
      }
    });
  }

  async findAll(userId: string) {
    return this.prisma.conversation.findMany({
      where: {
        participants: {
          some: { userId }
        }
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                avatar: true
              }
            }
          }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { updatedAt: 'desc' }
    });
  }

  async getMessages(conversationId: string, userId: string) {
    // Verify participation
    const participation = await this.prisma.conversationParticipant.findUnique({
      where: {
        userId_conversationId: {
          userId,
          conversationId
        }
      }
    });

    if (!participation) throw new NotFoundException('Conversation not found');

    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true
          }
        }
      }
    });
  }

  async sendMessage(conversationId: string, userId: string, content: string) {
     // Verify participation
    const participation = await this.prisma.conversationParticipant.findUnique({
      where: {
        userId_conversationId: {
          userId,
          conversationId
        }
      }
    });

    if (!participation) throw new NotFoundException('Conversation not found');

    const message = await this.prisma.message.create({
      data: {
        content,
        conversationId,
        senderId: userId
      },
      include: {
        sender: {
          select: {
             id: true,
             name: true,
             username: true,
             avatar: true
          }
        }
      }
    });

    // Update conversation timestamp
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() }
    });

    return message;
  }
}
