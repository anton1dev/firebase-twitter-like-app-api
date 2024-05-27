export class UserDocument {
  static collectionName = 'users';

  id: string;

  nickname: string;
  name: string;
  surname: string;
  email: string;

  photo?: string;

  posts: string[];
}
