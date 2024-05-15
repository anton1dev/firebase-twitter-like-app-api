import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World! \n Its a brand new App';
  }

  getId(): string {
    return `Your new ID is: ${randomUUID()}`;
  }
}
