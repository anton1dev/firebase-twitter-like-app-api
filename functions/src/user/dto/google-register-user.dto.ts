import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class GoogleRegisterUser extends PickType(CreateUserDto, [
  'id',
  'email',
]) {}
