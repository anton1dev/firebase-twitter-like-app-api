export interface PostType {
  id: string;
  title: string;
  text: string;
  authorId: string;
  authorNickname: string;
  commentsScore: number;
  likes?: string[];
  likesScore: number;
  dislikes?: string[];
  mediaUrl?: string;
}
