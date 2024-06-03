import { Inject, Injectable } from '@nestjs/common';
import { PostDocument } from './post.document';
import { CollectionReference } from '@google-cloud/firestore';
import { UpdatePostDto } from './dto/update-post.dto';
import { firestore } from 'firebase-admin';

@Injectable()
export class PostRepository {
  constructor(
    @Inject(PostDocument.collectionName)
    private postCollection: CollectionReference<PostDocument>,
  ) {}

  async getAll(
    page: string = '1',
    limit: string = '20',
  ): Promise<PostDocument[]> {
    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const startsAt = (pageNumber - 1) * limitNumber;

    const snapshot = await this.postCollection
      .orderBy('createdAt', 'desc')
      .offset(startsAt)
      .limit(limitNumber)
      .get();
    return snapshot.docs.map((post) => ({
      id: post.id,
      createdAt: new Date(post.data().createdAt.toDate().toDateString()),
      ...post.data(),
    }));
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

  async getPostsFromSearchQuery(searchQuery: string): Promise<PostDocument[]> {
    const postsSnapshot = await this.postCollection.get();

    if (postsSnapshot.empty) {
      return [];
    }

    const postsWithSearchedQuery = postsSnapshot.docs.filter(
      (post) =>
        post.data().title.toLowerCase().includes(searchQuery) ||
        post.data().text.toLowerCase().includes(searchQuery),
    );

    return postsWithSearchedQuery.map((post) => ({
      id: post.id,
      ...post.data(),
    }));
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

  async updateLikesScore(postId: string, payload: number): Promise<number> {
    await this.postCollection.doc(postId).update({
      likesScore: firestore.FieldValue.increment(payload),
    });

    const updatedLikesScore = (
      await this.postCollection.doc(postId).get()
    ).data().likesScore;

    return updatedLikesScore;
  }

  async updateCommentsScore(postId: string, payload: number): Promise<number> {
    await this.postCollection.doc(postId).update({
      commentsScore: firestore.FieldValue.increment(payload),
    });

    const updatedCommentsScore = (
      await this.postCollection.doc(postId).get()
    ).data().commentsScore;

    return updatedCommentsScore;
  }

  async addLike(postId: string, userId: string): Promise<void> {
    const prevLikes = (await this.postCollection.doc(postId).get()).data()
      .likes;
    prevLikes.push(userId);

    await this.postCollection.doc(postId).update({ likes: prevLikes });

    await this.updateLikesScore(postId, 1);
  }

  async removeLike(postId: string, userId: string): Promise<void> {
    const prevLikes = (await this.postCollection.doc(postId).get()).data()
      .likes;
    const filteredLikes = prevLikes.filter((like) => like !== userId);

    await this.postCollection.doc(postId).update({ likes: filteredLikes });

    await this.updateLikesScore(postId, -1);
  }

  async addDislike(postId: string, userId: string): Promise<void> {
    const prevDislikes = (await this.postCollection.doc(postId).get()).data()
      .dislikes;
    prevDislikes.push(userId);

    await this.postCollection.doc(postId).update({ dislikes: prevDislikes });
    await this.updateLikesScore(postId, -1);
  }

  async removeDislike(postId: string, userId: string): Promise<void> {
    const prevDislikes = (await this.postCollection.doc(postId).get()).data()
      .dislikes;
    const filteredDislikes = prevDislikes.filter((like) => like !== userId);

    await this.postCollection
      .doc(postId)
      .update({ dislikes: filteredDislikes });

    await this.updateLikesScore(postId, 1);
  }
}
