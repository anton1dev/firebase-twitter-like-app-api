import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  Patch,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { PostDocument } from './post.document';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthJwtGuard } from 'src/auth/guards/auth-jwt.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserDocument } from 'src/user/user.document';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  async getAllPosts(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ): Promise<PostDocument[]> {
    return this.postService.getAllPosts(page, limit);
  }

  @Get('user/:userId')
  async getPostsByUserId(
    @Param('userId') userId: string,
  ): Promise<PostDocument[]> {
    return this.postService.getPostsByUserId(userId);
  }

  @Get('post/:postId')
  async getPostByPostId(
    @Param('postId') postId: string,
  ): Promise<PostDocument> {
    return this.postService.getPostByPostId(postId);
  }

  @Get('/:query')
  async getPostsFromSearchQuery(
    @Param('query') query: string,
  ): Promise<PostDocument[]> {
    return this.postService.getPostsFromSearchQuery(query);
  }

  @UseGuards(AuthJwtGuard)
  @Post()
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @CurrentUser() user,
  ): Promise<PostDocument> {
    return this.postService.createPost(createPostDto, user);
  }

  @UseGuards(AuthJwtGuard)
  @Patch(':postId')
  async updatePost(
    @Param('postId') postId: string,
    @Body() updatePostDto: UpdatePostDto,
    @CurrentUser() user,
  ): Promise<void> {
    return this.postService.updatePost(postId, updatePostDto, user);
  }

  @UseGuards(AuthJwtGuard)
  @Delete(':postId')
  async deletePost(
    @Param('postId') postId: string,
    @CurrentUser() user,
  ): Promise<void> {
    return this.postService.deletePost(postId, user);
  }

  @UseGuards(AuthJwtGuard)
  @Patch('like/:postId')
  async likePost(
    @Param('postId') postId: string,
    @CurrentUser() user: UserDocument,
  ): Promise<void> {
    const userId = user.id;
    return this.postService.likePost(userId, postId);
  }

  @UseGuards(AuthJwtGuard)
  @Patch('dislike/:postId')
  async dislikePost(
    @Param('postId') postId: string,
    @CurrentUser() user: UserDocument,
  ): Promise<void> {
    const userId = user.id;
    return this.postService.dislikePost(userId, postId);
  }
}
