import {
  MinLength,
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  @MinLength(3)
  @IsNotEmpty()
  nickname: string;

  @IsEmail()
  email: string;

  @IsStrongPassword({ minLength: 6, minSymbols: 0 })
  password: string;
}
