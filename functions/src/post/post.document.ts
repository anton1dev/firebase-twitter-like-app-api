export class PostDocument {
  static collectionName = 'posts';

  id: string;
  title: string;
  text: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  likes?: string[] = [];
  dislikes?: string[] = [];
  mediaUrl?: string;
}
