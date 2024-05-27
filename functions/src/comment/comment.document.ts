export class CommentDocument {
  static collectionName = 'comments';

  id: string;
  userId: string;
  username: string;
  postId: string;
  text: string;
}
