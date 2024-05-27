import { IsString, MinLength } from 'class-validator';

export class CreateCommentDto {
  @MinLength(5)
  text: string;

  @IsString()
  postId: string;
}
