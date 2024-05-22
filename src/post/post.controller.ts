import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  Patch,
  Delete,
} from '@nestjs/common';
import { PostService } from './post.service';
import { PostDocument } from './post.document';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { LikePostDto } from './dto/like-post.dto';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  async getAllPosts(): Promise<PostDocument[]> {
    return this.postService.getAllPosts();
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

  @Post()
  async createPost(
    @Body() createPostDto: CreatePostDto,
  ): Promise<PostDocument> {
    return this.postService.createPost(createPostDto);
  }

  @Patch('post/:postId')
  async updatePost(
    @Param('postId') postId: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<void> {
    return this.postService.updatePost(postId, updatePostDto);
  }

  @Delete(':postId')
  async deletePost(@Param('postId') postId: string): Promise<void> {
    return this.postService.deletePost(postId);
  }

  @Patch('like/:postId')
  async likePost(
    @Param('postId') postId: string,
    @Body() likePostDto: LikePostDto,
  ): Promise<void> {
    const { userId } = likePostDto;
    return this.postService.likePost(userId, postId);
  }
}
