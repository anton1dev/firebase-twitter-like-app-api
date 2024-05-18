import { Injectable } from '@nestjs/common';

import { FirebaseRepository } from '../firebase/firebase.repository';

@Injectable()
export class PostsService {
  constructor(private firebaseRepository: FirebaseRepository) {}
  getPosts(): string[] {
    return [];
  }
}
