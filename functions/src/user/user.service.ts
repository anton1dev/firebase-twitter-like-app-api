import { Injectable, NotFoundException } from '@nestjs/common';
import { UserDocument } from './user.document';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async findAll(): Promise<UserDocument[]> {
    return await this.userRepository.getAll();
  }

  async getUserById(userId: string): Promise<UserDocument> {
    const user = this.userRepository.getOneById(userId);

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserDocument> {
    const { nickname, email, password } = createUserDto;
    const newUser: Omit<UserDocument, 'id'> = {
      nickname,
      email,
      password,
      following: [],
      posts: [],
    };

    return await this.userRepository.create(newUser);
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<void> {
    const user = await this.userRepository.getOneById(userId);

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    return this.userRepository.update(userId, updateUserDto);
  }

  async deleteUser(userId: string): Promise<void> {
    const user = await this.userRepository.getOneById(userId);
    if (!user) {
      throw new Error('User not found!');
    }

    await this.userRepository.delete(userId);
  }
}
