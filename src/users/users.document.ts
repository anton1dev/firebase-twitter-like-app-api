export class UsersDocument {
  static collectionName = 'users';

  id?: string;

  nickname: string;
  email: string;
  following: string[];
  posts: string[];
}
