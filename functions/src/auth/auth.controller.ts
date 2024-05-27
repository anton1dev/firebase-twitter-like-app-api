import { Body, Controller, Post, Get, UseGuards, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login-dto';
import { RegisterDto } from './dtos/register-dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthJwtGuard } from './guards/auth-jwt.guard';

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

  @UseGuards(AuthJwtGuard)
  @Get('/profile')
  async getProfile(@CurrentUser() user) {
    return user;
  }

  @UseGuards(AuthJwtGuard)
  @Delete('/profile/delete')
  async deleteProfile(@CurrentUser() user) {
    return this.authService.deleteProfile(user.id);
  }
}
