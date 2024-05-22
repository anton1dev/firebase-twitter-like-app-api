import { IsNotEmpty, MinLength } from 'class-validator';

export class UpdatePostDto {
  @MinLength(20)
  @IsNotEmpty()
  text: string;

  mediaUrl?: string;
}
