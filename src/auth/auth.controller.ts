import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from 'src/users/dto/SignUpDto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService){}
  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    const result = await this.authService.signUp(signUpDto);
    return result;
  }
}
