import { Injectable } from '@nestjs/common';
import { App } from 'firebase-admin/app';
import { FirebaseApp } from 'firebase/app';

@Injectable()
export class AppService {
  private readonly serviceApp: App;
  private readonly firebase: FirebaseApp;

  getHello(): string {
    return 'Hello World! \n Its a brand new App';
  }
}
