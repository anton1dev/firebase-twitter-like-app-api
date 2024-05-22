import { Inject, Injectable } from '@nestjs/common';
import { UserDocument } from './user.document';
import { CollectionReference } from '@google-cloud/firestore';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject(UserDocument.collectionName)
    private userCollection: CollectionReference<UserDocument>,
  ) {}

  async findAll(): Promise<UserDocument[]> {
    const snapshot = await this.userCollection.get();
    const users: UserDocument[] = [];
    snapshot.forEach((doc) => users.push({ id: doc.id, ...doc.data() }));

    return users;
  }

  async getUser(userId: string): Promise<UserDocument> {
    const user = await this.userCollection.doc(userId).get();
    if (!user.exists) {
      throw new Error('User not found!');
    }

    return user.data();
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserDocument> {
    const { nickname, email } = createUserDto;
    const newUser: Omit<UserDocument, 'id'> = {
      nickname,
      email,
      following: [],
      posts: [],
    };

    const userRef = await this.userCollection.add(newUser);

    return {
      id: userRef.id,
      ...newUser,
    };
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<void> {
    const user = await this.userCollection.doc(userId).get();

    if (!user.exists) {
      throw new Error('User not found!');
    }

    const updatedData = {
      ...updateUserDto,
    };

    await this.userCollection.doc(userId).update(updatedData);
  }

  async deleteUser(userId: string): Promise<void> {
    const user = await this.userCollection.doc(userId).get();
    if (!user.exists) {
      throw new Error('User not found!');
    }

    await this.userCollection.doc(userId).delete();
  }
}
