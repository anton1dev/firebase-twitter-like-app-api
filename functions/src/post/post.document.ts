export class PostDocument {
  static collectionName = 'posts';

  id: string;
  title: string;
  text: string;
  authorId: string;
  createdAt: Date;
  commentsScore: number = 0;
  likes?: string[] = [];
  likesScore: number = 0;
  dislikes?: string[] = [];
  mediaUrl?: string;
}
