import { IsNotEmpty, IsUrl, MinLength } from 'class-validator';

export class CreatePostDto {
  @MinLength(20)
  @IsNotEmpty()
  text: string;

  @MinLength(5)
  @IsNotEmpty()
  title: string;

  @IsUrl()
  mediaUrl?: string;
}
