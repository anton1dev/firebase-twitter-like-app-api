import { IsNotEmpty, IsUrl, MinLength } from 'class-validator';

export class UpdatePostDto {
  @MinLength(5)
  title: string;

  @MinLength(20)
  @IsNotEmpty()
  text: string;

  @IsUrl()
  mediaUrl?: string;
}
