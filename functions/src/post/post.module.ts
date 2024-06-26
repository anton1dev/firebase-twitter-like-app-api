import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PostRepository } from './post.repository';
import { UserRepository } from 'src/user/user.repository';

@Module({
  providers: [PostService, PostRepository, UserRepository],
  controllers: [PostController],
})
export class PostModule {}
