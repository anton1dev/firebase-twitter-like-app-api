import {
  Controller,
  Param,
  Get,
  Body,
  UseGuards,
  Post,
  Patch,
  Delete,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentDocument } from './comment.document';
import { AuthJwtGuard } from 'src/auth/guards/auth-jwt.guard';
import { CreateCommentDto } from './dtos/create-comment-dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserDocument } from 'src/user/user.document';
import { UpdateCommentDto } from './dtos/update-comment-dto';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get('/:postId')
  async getAllCommentsForPostId(
    @Param('postId') postId: string,
  ): Promise<CommentDocument[]> {
    return this.commentService.getAllCommentsToPost(postId);
  }

  @Post()
  @UseGuards(AuthJwtGuard)
  async createCommentForPost(
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() user: UserDocument,
  ) {
    return this.commentService.createCommentToPost(createCommentDto, user);
  }

  @Patch(':commentId')
  @UseGuards(AuthJwtGuard)
  async updateCommentForPost(
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @CurrentUser() user: UserDocument,
  ): Promise<void> {
    return this.commentService.updateComment(commentId, updateCommentDto, user);
  }

  @Delete(':commentId')
  @UseGuards(AuthJwtGuard)
  async deleteCommentForPost(
    @Param('commentId') commentId: string,
    @CurrentUser() user: UserDocument,
  ): Promise<void> {
    return this.commentService.deleteComment(commentId, user);
  }
}
