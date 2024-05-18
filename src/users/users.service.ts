import { Inject, Injectable } from '@nestjs/common';
import { UsersDocument } from './users.document';
import { CollectionReference } from '@google-cloud/firestore';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(UsersDocument.collectionName)
    private usersCollection: CollectionReference<UsersDocument>,
  ) {}

  async findAll(): Promise<UsersDocument[]> {
    const snapshot = await this.usersCollection.get();
    const users: UsersDocument[] = [];
    snapshot.forEach((doc) => users.push({ id: doc.id, ...doc.data() }));

    return users;
  }

  async getUser(userId: string): Promise<UsersDocument> {
    const user = await this.usersCollection.doc(userId).get();
    if (!user.exists) {
      throw new Error('User not found!');
    }

    return user.data();
  }

  async createUser(createUserDto: CreateUserDto): Promise<UsersDocument> {
    const { nickname, email } = createUserDto;
    const newUser: Omit<UsersDocument, 'id'> = {
      nickname,
      email,
      following: [],
      posts: [],
    };

    const userRef = await this.usersCollection.add(newUser);

    return {
      id: userRef.id,
      ...newUser,
    };
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<void> {
    const user = await this.usersCollection.doc(userId).get();

    if (!user.exists) {
      throw new Error('User not found!');
    }

    const updatedData = {
      ...updateUserDto,
    };

    await this.usersCollection.doc(userId).update(updatedData);
  }

  async deleteUser(userId: string): Promise<void> {
    const user = await this.usersCollection.doc(userId).get();
    if (!user.exists) {
      throw new Error('User not found!');
    }

    await this.usersCollection.doc(userId).delete();
  }
}
