import { Inject, Injectable } from '@nestjs/common';
import { UsersDocument } from './users.document';
import { CollectionReference } from '@google-cloud/firestore';

@Injectable()
export class UsersService {
  constructor(
    @Inject(UsersDocument.collectionName)
    private todosCollection: CollectionReference<UsersDocument>,
  ) {}

  async findAll(): Promise<UsersDocument[]> {
    const snapshot = await this.todosCollection.get();
    const todos: UsersDocument[] = [];
    snapshot.forEach((doc) => todos.push(doc.data()));

    return todos;
  }
}
