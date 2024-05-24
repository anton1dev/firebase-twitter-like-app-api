import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PostModule } from './post/post.module';
import { FirestoreModule } from './firestore/firestore.module';
import { UserModule } from './user/user.module';
import { serviceAccountPath } from './config/firebase.config';
import { AuthModule } from './auth/auth.module';

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
    UserModule,
    PostModule,
    FirestoreModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
