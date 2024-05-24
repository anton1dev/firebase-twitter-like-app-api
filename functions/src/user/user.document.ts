export class UserDocument {
  static collectionName = 'users';

  id?: string;

  nickname: string;
  email: string;
  password: string;
  following: string[];
  posts: string[];
}
