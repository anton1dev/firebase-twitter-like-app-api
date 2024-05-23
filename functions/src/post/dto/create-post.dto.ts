import { IsNotEmpty, MinLength } from 'class-validator';

export class CreatePostDto {
  @MinLength(20)
  @IsNotEmpty()
  text: string;

  authorId: string;

  mediaUrl?: string;
}
