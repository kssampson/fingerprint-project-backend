import { Injectable } from '@nestjs/common';
import { SignUpDto } from 'src/users/dto/SignUpDto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { LogInDto, VerifyEmailDto } from 'src/users/dto/LogInDto';
import { MailService } from 'src/mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import { VerifiedLogInDto } from 'src/users/dto/VerifiedLogInDto';
import { VisitorId } from 'src/users/entities/visitorId.entity';
import { OtpDto } from 'src/users/dto/OtpDto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private mailService: MailService,
    private jwtService: JwtService,
    ){}
  async signUp(signUpDto: SignUpDto) {
    signUpDto.password = await bcrypt.hash(signUpDto.password, 10);
    const { username, email, password, visitorId } = signUpDto;
    const result = await this.userService.signUp(username, email, password, visitorId);
    return result;
  }
  async logIn(logInDto: LogInDto) {
    const { username, password, visitorId } = logInDto;
    const result = await this.userService.logIn(username, password, visitorId);
    return result;
  }
  async processOtp(otpDto: OtpDto) {
    const { otp, username, password, visitorId } = otpDto;
    const result = await this.userService.processOtp(otp, username, password, visitorId)
    return result;
  }
}

/*
this.userService.change2FAStatus(email, password);
return {success: false, message: 'verfied email and database email do not match!'}
return {success: false, message: 'hmmm, doesn\'t look like we have you on file...'}

*/