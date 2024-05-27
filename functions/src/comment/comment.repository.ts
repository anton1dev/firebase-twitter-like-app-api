import { CollectionReference } from '@google-cloud/firestore';
import { Inject, Injectable } from '@nestjs/common';
import { PostDocument } from 'src/post/post.document';
import { CommentDocument } from './comment.document';
import { UpdateCommentDto } from './dtos/update-comment-dto';

@Injectable()
export class CommentRepository {
  constructor(
    @Inject(PostDocument.collectionName)
    private postCollection: CollectionReference<PostDocument>,
    @Inject(CommentDocument.collectionName)
    private commentCollection: CollectionReference<CommentDocument>,
  ) {}

  async getAllCommentsForPost(postId: string): Promise<CommentDocument[]> {
    const snapshot = await this.commentCollection
      .where('postId', '==', postId)
      .get();

    return snapshot.docs.map((comment) => ({
      id: comment.id,
      ...comment.data(),
    }));
  }

  async getOneByCommentId(commentId: string): Promise<CommentDocument> {
    return (await this.commentCollection.doc(commentId).get()).data();
  }

  async create(
    newComment: Omit<CommentDocument, 'id'>,
  ): Promise<CommentDocument> {
    const postRef = await this.commentCollection.add(
      newComment as CommentDocument,
    );

    return {
      id: postRef.id,
      ...newComment,
    };
  }

  async update(
    commentId: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<void> {
    const updatedComment = { ...updateCommentDto };

    await this.commentCollection.doc(commentId).update(updatedComment);
  }

  async delete(commentId: string): Promise<void> {
    await this.commentCollection.doc(commentId).delete();
  }
}
