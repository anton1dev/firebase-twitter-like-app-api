import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { UserRepository } from 'src/user/user.repository';
import { FirebaseService } from 'src/firebase/firebase.service';
import { UserService } from 'src/user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { jwtConfig } from 'src/config/jwt.config';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: jwtConfig,
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    UserRepository,
    FirebaseService,
    UserService,
    ConfigService,
  ],
})
export class AuthModule {}
