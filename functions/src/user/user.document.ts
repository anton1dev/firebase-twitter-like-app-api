export class UserDocument {
  static collectionName = 'users';

  id?: string;

  nickname: string;
  email: string;
  following: string[];
  posts: string[];
}
