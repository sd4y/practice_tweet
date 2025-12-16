import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('conversations')
@UseGuards(AuthGuard('jwt'))
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Post()
  async createOrGet(@Request() req: any, @Body() body: { otherUserId: string }) {
    return this.conversationsService.createOrGet(req.user.userId, body.otherUserId);
  }

  @Get()
  async findAll(@Request() req: any) {
    return this.conversationsService.findAll(req.user.userId);
  }

  @Get(':id/messages')
  async getMessages(@Param('id') id: string, @Request() req: any) {
    return this.conversationsService.getMessages(id, req.user.userId);
  }

  @Post(':id/messages')
  async sendMessage(@Param('id') id: string, @Request() req: any, @Body() body: { content: string }) {
    return this.conversationsService.sendMessage(id, req.user.userId, body.content);
  }
}
