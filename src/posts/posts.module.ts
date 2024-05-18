import { Module } from '@nestjs/common';

import { FirebaseModule } from '../firebase/firebase.module';

import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';

@Module({
  imports: [FirebaseModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
