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

  async create(newUser: Omit<UserDocument, 'id'>): Promise<UserDocument> {
    const userRef = await this.userCollection.add(newUser);

    return {
      id: userRef.id,
      ...newUser,
    };
  }

  async update(userId: string, updateUserDto: UpdateUserDto): Promise<void> {
    const updatedUserData = {
      ...updateUserDto,
    };

    await this.userCollection.doc(userId).update(updatedUserData);
  }

  async delete(userId: string): Promise<void> {
    await this.userCollection.doc(userId).delete();
  }
}
