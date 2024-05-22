import { MinLength, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @MinLength(3)
  @IsNotEmpty()
  nickname: string;

  @IsEmail()
  email: string;
}
