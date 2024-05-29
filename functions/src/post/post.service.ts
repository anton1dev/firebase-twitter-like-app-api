import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { PostDocument } from './post.document';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostRepository } from './post.repository';
import { UserRepository } from 'src/user/user.repository';
import { UserDocument } from 'src/user/user.document';
import { firestore } from 'firebase-admin';

import 'firebase/firestore';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    @Inject(forwardRef(() => UserRepository))
    private readonly userRepository: UserRepository,
  ) {}

  async getAllPosts(
    page: string = '1',
    limit: string = '20',
  ): Promise<PostDocument[]> {
    return await this.postRepository.getAll(page, limit);
  }

  async getPostsByUserId(userId: string): Promise<PostDocument[]> {
    const user = await this.userRepository.getOneById(userId);

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    return this.postRepository.getAllByUserId(userId);
  }

  async getPostByPostId(postId: string): Promise<PostDocument> {
    const post = await this.postRepository.getOneByPostId(postId);

    if (!post) {
      throw new NotFoundException('Post doesnt exist!');
    }

    return post;
  }

  async getPostsFromSearchQuery(query: string): Promise<PostDocument[]> {
    const preparedQuery = query.toLowerCase().trim();

    return await this.postRepository.getPostsFromSearchQuery(preparedQuery);
  }

  async createPost(
    createPostDto: CreatePostDto,
    user: UserDocument,
  ): Promise<PostDocument> {
    const { title, text, mediaUrl } = createPostDto;

    const currentDate = new Date();

    const newPost: Omit<PostDocument, 'id'> = {
      title,
      text,
      authorId: user.id,
      authorNickname: user.nickname,
      createdAt: firestore.Timestamp.fromDate(currentDate),
      likesScore: 0,
      commentsScore: 0,
      likes: [],
      dislikes: [],
      mediaUrl: mediaUrl ? mediaUrl : null,
    };

    return this.postRepository.create(newPost);
  }

  async updatePost(
    postId: string,
    updatePostDto: UpdatePostDto,
    user: UserDocument,
  ): Promise<void> {
    const postToUpdate = await this.postRepository.getOneByPostId(postId);

    if (!postToUpdate) {
      throw new NotFoundException('Post not found!');
    }

    if (postToUpdate.authorId !== user.id) {
      throw new ForbiddenException('This user cant update this post!');
    }

    await this.postRepository.update(postId, updatePostDto);
  }

  async deletePost(postId: string, user: UserDocument): Promise<void> {
    const postToDelete = await this.postRepository.getOneByPostId(postId);

    if (!postToDelete) {
      throw new NotFoundException('Post not found!');
    }

    if (postToDelete.authorId !== user.id) {
      throw new ForbiddenException('This user cant delete this post!');
    }

    await this.postRepository.delete(postId);
  }

  async likePost(userId: string, postId: string): Promise<void> {
    const post = await this.postRepository.getOneByPostId(postId);

    if (!post) {
      throw new NotFoundException('Post not found!');
    }

    const user = await this.userRepository.getOneById(userId);

    if (!user) {
      throw new NotFoundException('User with that ID was not found!');
    }

    const { likes, dislikes } = post;

    if (dislikes.includes(userId)) {
      this.postRepository.removeDislike(postId, userId);

      return this.postRepository.addLike(postId, userId);
    }

    if (likes.includes(userId)) {
      return this.postRepository.removeLike(postId, userId);
    } else {
      return this.postRepository.addLike(postId, userId);
    }
  }

  async dislikePost(userId: string, postId: string): Promise<void> {
    const post = await this.postRepository.getOneByPostId(postId);

    if (!post) {
      throw new NotFoundException('Post not found!');
    }

    const user = await this.userRepository.getOneById(userId);

    if (!user) {
      throw new NotFoundException('User with that ID was not found!');
    }

    const { likes, dislikes } = post;

    if (likes.includes(userId)) {
      this.postRepository.removeLike(postId, userId);

      return this.postRepository.addDislike(postId, userId);
    }

    if (dislikes.includes(userId)) {
      return this.postRepository.removeDislike(postId, userId);
    } else {
      return this.postRepository.addDislike(postId, userId);
    }
  }
}
