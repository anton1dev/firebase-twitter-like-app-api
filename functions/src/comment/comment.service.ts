import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CommentRepository } from './comment.repository';
import { UserRepository } from 'src/user/user.repository';
import { PostRepository } from 'src/post/post.repository';
import { CommentDocument } from './comment.document';
import { CreateCommentDto } from './dtos/create-comment-dto';
import { UserDocument } from 'src/user/user.document';
import { UpdateCommentDto } from './dtos/update-comment-dto';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    @Inject(forwardRef(() => UserRepository))
    private readonly userRepository: UserRepository,
    @Inject(forwardRef(() => PostRepository))
    private readonly postRepository: PostRepository,
  ) {}

  async getAllCommentsToPost(postId: string): Promise<CommentDocument[]> {
    const post = await this.postRepository.getOneByPostId(postId);

    if (!post) {
      throw new NotFoundException(`Post ${postId} is not found!`);
    }

    return await this.commentRepository.getAllCommentsForPost(postId);
  }

  async createCommentToPost(
    createCommentDto: CreateCommentDto,
    user: UserDocument,
  ): Promise<CommentDocument> {
    const { text, postId } = createCommentDto;
    const userId = user.id;
    const username = user.nickname;

    const post = await this.postRepository.getOneByPostId(postId);

    if (!post) {
      throw new NotFoundException(`Post ${postId} is not found!`);
    }

    const newComment: Omit<CommentDocument, 'id'> = {
      text,
      username,
      postId,
      userId,
    };

    await this.postRepository.updateCommentsScore(postId, 1);

    return this.commentRepository.create(newComment);
  }

  async updateComment(
    commentId: string,
    updateCommentDto: UpdateCommentDto,
    user: UserDocument,
  ): Promise<void> {
    const commentToUpdate =
      await this.commentRepository.getOneByCommentId(commentId);

    if (!commentToUpdate) {
      throw new NotFoundException('Comment not found!');
    }

    if (commentToUpdate.userId !== user.id) {
      throw new ForbiddenException('This user cant update this comment!');
    }

    await this.commentRepository.update(commentId, updateCommentDto);
  }

  async deleteComment(commentId: string, user: UserDocument): Promise<void> {
    const commentToDelete =
      await this.commentRepository.getOneByCommentId(commentId);

    if (!commentToDelete) {
      throw new NotFoundException('Comment not found!');
    }

    if (commentToDelete.userId !== user.id) {
      throw new ForbiddenException('This user cant delete this comment!');
    }

    const { postId } = commentToDelete;

    const searchedPost = await this.postRepository.getOneByPostId(postId);

    if (!searchedPost) {
      throw new NotFoundException('Post not found!');
    }

    await this.postRepository.updateCommentsScore(postId, -1);

    await this.commentRepository.delete(commentId);
  }
}
