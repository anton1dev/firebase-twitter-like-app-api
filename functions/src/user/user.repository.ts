import { Inject, Injectable } from '@nestjs/common';
import { UserDocument } from './user.document';
import { CollectionReference } from '@google-cloud/firestore';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserRepository {
  constructor(
    @Inject(UserDocument.collectionName)
    private readonly userCollection: CollectionReference<UserDocument>,
  ) {}

  async getAll(): Promise<UserDocument[]> {
    const snapshot = await this.userCollection.get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  async getOneById(userId: string): Promise<UserDocument> {
    return (await this.userCollection.doc(userId).get()).data();
  }

  async create(newUser: UserDocument): Promise<UserDocument> {
    await this.userCollection.doc(newUser.id).set(newUser);

    return newUser;
  }

  async update(userId: string, updateUserDto: UpdateUserDto): Promise<string> {
    const updatedUserData = {
      ...updateUserDto,
    };

    await this.userCollection.doc(userId).update(updatedUserData);

    return userId;
  }

  async delete(userId: string): Promise<void> {
    await this.userCollection.doc(userId).delete();
  }
}
