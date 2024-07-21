import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from 'src/users/dto/SignUpDto';
import { LogInDto, VerifyEmailDto } from 'src/users/dto/LogInDto';
import { VerifiedLogInDto } from 'src/users/dto/VerifiedLogInDto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService){}
  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    const result = await this.authService.signUp(signUpDto);
    return result;
  }
  @Post('log-in')
  async logIn(@Body() logInDto: LogInDto) {
    const result = await this.authService.logIn(logInDto);
    return result;
  }
  @Post('verify-email')
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return await this.authService.verifyEmail(verifyEmailDto);
  }
  @Post('verified-log-in')
  async verifiedLogin(@Body() verifiedLogInDto: VerifiedLogInDto) {
    return await this.authService.verifiedLogin(verifiedLogInDto);
  }
}
