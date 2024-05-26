export class UserDocument {
  static collectionName = 'users';

  id: string;

  nickname: string;
  name: string;
  surname: string;
  email: string;

  posts: string[];
}
