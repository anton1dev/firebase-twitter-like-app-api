export interface User {
  id: string;

  nickname: string;
  name: string;
  surname: string;
  email: string;
  password: string;

  photo?: string;

  posts: string[];
}
