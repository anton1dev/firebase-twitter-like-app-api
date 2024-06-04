export interface Post {
  id: string;
  title: string;
  text: string;
  authorId: string;
  authorNickname: string;
  commentsScore: number;
  commentaries: Comment[];
  likes?: string[];
  likesScore: number;
  dislikes?: string[];
  mediaUrl?: string;
}
