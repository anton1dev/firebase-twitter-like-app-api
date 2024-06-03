import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Delete,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDocument } from './user.document';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(): Promise<UserDocument[]> {
    return await this.userService.findAll();
  }

  @Get('/email')
  async getUserByEmail(
    @Query('email') email: string,
  ): Promise<UserDocument | null> {
    return this.userService.getUserByEmail(email);
  }

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<UserDocument> {
    return this.userService.getUserById(id);
  }

  @Post()
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserDocument> {
    return this.userService.createUser(createUserDto);
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<string> {
    return await this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<string> {
    return await this.userService.deleteUser(id);
  }
}
