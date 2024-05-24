import { Inject, Injectable } from '@nestjs/common';
import { PostDocument } from './post.document';
import { CollectionReference } from '@google-cloud/firestore';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostRepository {
  constructor(
    @Inject(PostDocument.collectionName)
    private postCollection: CollectionReference<PostDocument>,
  ) {}

  async getAll(): Promise<PostDocument[]> {
    const snapshot = await this.postCollection.get();
    return snapshot.docs.map((post) => ({ id: post.id, ...post.data() }));
  }

  async getAllByUserId(userId: string): Promise<PostDocument[]> {
    const snapshot = await this.postCollection
      .where('authorId', '==', userId)
      .get();

    return snapshot.docs.map((post) => ({ id: post.id, ...post.data() }));
  }

  async getOneByPostId(postId: string): Promise<PostDocument> {
    return (await this.postCollection.doc(postId).get()).data();
  }

  async create(newPost: Omit<PostDocument, 'id'>): Promise<PostDocument> {
    const postRef = await this.postCollection.add(newPost as PostDocument);

    return {
      id: postRef.id,
      ...newPost,
    };
  }

  async update(postId: string, updatePostDto: UpdatePostDto): Promise<void> {
    const updatedPost = {
      ...updatePostDto,
    };

    await this.postCollection.doc(postId).update(updatedPost);
  }

  async delete(postId: string): Promise<void> {
    await this.postCollection.doc(postId).delete();
  }

  async addLike(postId: string, userId: string): Promise<void> {
    const prevLikes = (await this.postCollection.doc(postId).get()).data()
      .likes;
    prevLikes.push(userId);

    await this.postCollection.doc(postId).update({ likes: prevLikes });
  }

  async removeLike(postId: string, userId: string): Promise<void> {
    const prevLikes = (await this.postCollection.doc(postId).get()).data()
      .likes;
    const filteredLikes = prevLikes.filter((like) => like !== userId);

    await this.postCollection.doc(postId).update({ likes: filteredLikes });
  }

  async addDislike(postId: string, userId: string): Promise<void> {
    const prevDislikes = (await this.postCollection.doc(postId).get()).data()
      .dislikes;
    prevDislikes.push(userId);

    await this.postCollection.doc(postId).update({ dislikes: prevDislikes });
  }

  async removeDislike(postId: string, userId: string): Promise<void> {
    const prevDislikes = (await this.postCollection.doc(postId).get()).data()
      .dislikes;
    const filteredDislikes = prevDislikes.filter((like) => like !== userId);

    await this.postCollection
      .doc(postId)
      .update({ dislikes: filteredDislikes });
  }
}
