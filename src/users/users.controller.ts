import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersDocument } from './users.document';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(): Promise<UsersDocument[]> {
    return await this.usersService.findAll();
  }
}
