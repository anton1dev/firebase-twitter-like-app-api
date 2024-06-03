import { IsEmail, IsString, MinLength } from 'class-validator';
export class CreateUserDto {
  @IsString()
  id: string;

  @IsString()
  password: string = '12345678';

  @MinLength(3)
  nickname: string;

  @IsEmail()
  email: string;

  @MinLength(3)
  name: string;

  @MinLength(2)
  surname: string;
}
