import { Timestamp } from '@google-cloud/firestore';

export class PostDocument {
  static collectionName = 'posts';

  id: string;
  title: string;
  text: string;
  authorId: string;
  authorNickname: string;
  createdAt: Timestamp;
  commentsScore: number = 0;
  likes?: string[] = [];
  likesScore: number = 0;
  dislikes?: string[] = [];
  mediaUrl?: string;
}
