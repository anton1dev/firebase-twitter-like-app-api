export class UsersDocument {
  static collectionName = 'users';

  nickname: string;
  email: string;
  following: string[];
  posts: string[];
}
