export interface UserType {
  id: string;

  nickname: string | null;
  name: string;
  surname: string;
  email: string;

  photo?: string;

  posts: string[];
}
