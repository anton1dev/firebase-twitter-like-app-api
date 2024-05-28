import { Body, Controller, Post, Get, UseGuards, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login-dto';
import { RegisterDto } from './dtos/register-dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthJwtGuard } from './guards/auth-jwt.guard';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { UserDocument } from 'src/user/user.document';
import { ChangePasswordDto } from './dtos/change-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.loginUser(loginDto);
  }

  @Post('signup')
  async signup(@Body() createUser: RegisterDto) {
    return await this.authService.createUser(createUser);
  }

  @Post('googlesignup')
  async signupGoogle() {
    return await this.authService.signUpWithGooglePopup();
  }

  @UseGuards(AuthJwtGuard)
  @Post('logout')
  async logout() {
    return this.authService.logout();
  }

  @Post('/password-reset')
  async resetPasswordViaEmail(@Body() passwordForgottenDto: ResetPasswordDto) {
    return this.authService.resetPasswordViaEmail(passwordForgottenDto);
  }

  @Post('/password-change')
  @UseGuards(AuthJwtGuard)
  async updatePassword(
    @CurrentUser() user: UserDocument,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.updatePassword(user, changePasswordDto);
  }

  @UseGuards(AuthJwtGuard)
  @Get('/profile')
  async getProfile(@CurrentUser() user: UserDocument) {
    return user;
  }

  @UseGuards(AuthJwtGuard)
  @Delete('/profile/delete')
  async deleteProfile(@CurrentUser() user: UserDocument) {
    return this.authService.deleteProfile(user.id);
  }
}
