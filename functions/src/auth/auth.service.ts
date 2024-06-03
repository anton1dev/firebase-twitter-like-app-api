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
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { v4 as uuidv4 } from 'uuid';
import { log } from 'console';

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
        id: user.uid,
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
        password,
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

  async createGoogleUser(userDto: RegisterDto): Promise<UserDocument> {
    const id = uuidv4();

    const user: CreateUserDto = { id, ...userDto };

    const userCreated = await this.userService.createUser(user);

    return userCreated;
  }

  async signUpWithGooglePopup(
    createUserDto: CreateUserDto,
  ): Promise<NewUserCreds> {
    try {
      const userCheck = await this.userService.getUserByEmail(
        createUserDto.email,
      );

      if (userCheck) {
        return {
          id: userCheck.id,
          token: await this.signUserToken({
            id: userCheck.id,
            email: userCheck.email,
          }),
        };
      }
      const newUser = await this.userService.createUser(createUserDto);

      return {
        id: newUser.id,
        token: await this.signUserToken({
          id: newUser.id,
          email: newUser.email,
        }),
      };
    } catch (err) {
      console.error(err);
    }
  }

  async logout() {
    try {
      await this.firebaseService.logOutUser();
    } catch (error) {
      throw new Error(`Error while logging out `);
    }
  }

  async resetPasswordViaEmail(passwordForgottenDto: ResetPasswordDto) {
    try {
      const { email } = passwordForgottenDto;
      await this.firebaseService.resetPassword(email);
    } catch (error) {
      throw new Error(`Error during password reset!`);
    }
  }

  async updatePassword(
    @CurrentUser() user: UserDocument,
    changePasswordDto: ChangePasswordDto,
  ) {
    try {
      const { newPassword } = changePasswordDto;
      const userId = user.id;

      await this.firebaseService.updatePassword(userId, newPassword);
    } catch (error) {
      throw new Error(`Error during password update!`);
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
