import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Injectable, Logger } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { PostModule } from './post/post.module';
import { FirestoreModule } from './firestore/firestore.module';
import { UserModule } from './user/user.module';
import { serviceAccountPath } from './config/firebase.config';
import { AuthModule } from './auth/auth.module';
import { FirebaseModule } from './firebase/firebase.module';

@Module({
  imports: [
    ConfigModule.forRoot({ cache: true }),
    FirestoreModule.forRoot({
      imports: [ConfigModule],
      useFactory: () => ({
        keyFilename: serviceAccountPath,
      }),
      inject: [ConfigService],
    }),
    FirebaseModule,
    FirestoreModule,
    AuthModule,
    UserModule,
    PostModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
