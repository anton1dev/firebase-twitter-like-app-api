export class PostDocument {
  static collectionName = 'posts';

  id: string;
  text: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  likes: string[];
  mediaUrl?: string;
}
