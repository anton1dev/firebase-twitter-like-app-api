import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { user } from 'firebase-functions/v1/auth';
import { LoginDto } from '../dtos/login-dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async login(loginDto: LoginDto): Promise<any> {
    try {
      this.authService.loginUser(loginDto);
    } catch {
      console.error('Creds are not valid!');
      throw new UnauthorizedException('Creds are not valid');
    }

    return user;
  }
}
