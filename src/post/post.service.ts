import { Inject, Injectable } from '@nestjs/common';
import { PostDocument } from './post.document';
import { CollectionReference } from '@google-cloud/firestore';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { UserDocument } from 'src/user/user.document';

@Injectable()
export class PostService {
  constructor(
    @Inject(PostDocument.collectionName)
    private postCollection: CollectionReference<PostDocument>,
    @Inject(UserDocument.collectionName)
    private userCollection: CollectionReference<UserDocument>,
  ) {}

  async getAllPosts(): Promise<PostDocument[]> {
    const snapshot = await this.postCollection.get();
    const posts: PostDocument[] = [];
    snapshot.forEach((post) => posts.push({ id: post.id, ...post.data() }));

    return posts;
  }

  async getPostsByUserId(userId: string): Promise<PostDocument[]> {
    const snapshot = await this.postCollection
      .where('authorId', '==', userId)
      .get();
    const posts: PostDocument[] = [];

    snapshot.forEach((post) =>
      posts.push({
        id: post.id,
        ...post.data(),
      }),
    );

    return posts;
  }

  async getPostByPostId(postId: string): Promise<PostDocument> {
    const post = await this.postCollection.doc(postId).get();

    if (!post.exists) {
      throw new Error('Post doesnt exist!');
    }

    return post.data();
  }

  async createPost(createPostDto: CreatePostDto): Promise<PostDocument> {
    const { text, mediaUrl, authorId } = createPostDto;
    const currentDate = new Date();

    const newPost: Omit<PostDocument, 'id'> = {
      text,
      authorId,
      createdAt: currentDate,
      updatedAt: currentDate,
      likes: [],
      mediaUrl: mediaUrl ? mediaUrl : null,
    };

    const postRef = await this.postCollection.add(newPost as PostDocument);

    return {
      id: postRef.id,
      ...newPost,
    };
  }

  async updatePost(
    postId: string,
    updatePostDto: UpdatePostDto,
  ): Promise<void> {
    const postToUpdate = await this.postCollection.doc(postId).get();

    if (!postToUpdate.exists) {
      throw new Error('Post not found!');
    }

    const updatedPost = {
      ...updatePostDto,
    };

    await this.postCollection.doc(postId).update(updatedPost);
  }

  async deletePost(postId: string): Promise<void> {
    const postToDelete = await this.postCollection.doc(postId).get();

    if (!postToDelete.exists) {
      throw new Error('Post not found!');
    }

    await this.postCollection.doc(postId).delete();
  }

  async likePost(userId: string, postId: string): Promise<void> {
    const post = await this.postCollection.doc(postId).get();

    if (!post.exists) {
      throw new Error('Post not found!');
    }

    const user = await this.userCollection.doc(userId).get();

    if (!user.exists) {
      throw new Error('User with that ID was not found!');
    }

    const likes = post.data().likes;
    let newLikes: string[] = [];

    if (likes.includes(userId)) {
      newLikes = likes.filter((id) => id !== userId);
    } else {
      newLikes = [...likes, userId];
    }

    await this.postCollection.doc(postId).update({ likes: newLikes });
  }
}
