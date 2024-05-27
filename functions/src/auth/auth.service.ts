import { Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dtos/login-dto';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { RegisterDto } from './dtos/register-dto';
import { GoogleRegisterUser } from 'src/user/dto/google-register-user.dto';
import { NewUserCreds } from './dtos/new-user-creds.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserDocument } from 'src/user/user.document';

@Injectable()
export class AuthService {
  constructor(
    private firebaseService: FirebaseService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signUserToken(googleRegCreds: GoogleRegisterUser): Promise<string> {
    const payload = { sub: googleRegCreds.id, email: googleRegCreds.email };

    return this.jwtService.sign(payload);
  }

  async loginUser(loginDto: LoginDto) {
    const { email, password } = loginDto;

    try {
      const user = await this.firebaseService.loginUser(email, password);

      const token = await this.signUserToken({
        id: user.uid,
        email: user.email,
      });

      return {
        userId: user.uid,
        token,
      };
    } catch (error) {
      throw new Error('Error logging in user: ' + error.message);
    }
  }

  async createUser(userDto: RegisterDto): Promise<NewUserCreds> {
    const { email, password, nickname, name, surname } = userDto;

    try {
      const userCreds = (await this.firebaseService.createUser(email, password))
        .user;

      const user: CreateUserDto = {
        id: userCreds.uid,
        email: userCreds.email,
        nickname,
        name,
        surname,
      };
      await this.userService.createUser(user);
      await userCreds.sendEmailVerification();

      return {
        id: user.id,
        token: await this.signUserToken({ id: user.id, email }),
      };
    } catch (error) {
      throw new Error(`Error here ${error}`);
    }
  }

  async signUpWithGooglePopup(): Promise<NewUserCreds> {
    const { user } = await this.firebaseService.signUpWithGooglePopup();
    const newUser: CreateUserDto = {
      id: user.uid,
      email: user.email,
      name: user.displayName.split(' ')[0],
      surname: user.displayName.split(' ')[1],
      nickname: user.displayName,
    };

    await this.userService.createUser(newUser);

    return {
      id: newUser.id,
      token: await this.signUserToken({ id: newUser.id, email: newUser.email }),
    };
  }

  async logout() {
    try {
      await this.firebaseService.logOutUser();
    } catch (error) {
      throw new Error(`Error while logging out `);
    }
  }

  async getProfile(@CurrentUser() user: UserDocument) {
    return user;
  }

  async deleteProfile(userId: string) {
    try {
      await this.firebaseService.deleteUser(userId);
      await this.userService.deleteUser(userId);
      await this.logout();
    } catch (error) {
      throw new Error('Error while deleting user');
    }
  }
}
