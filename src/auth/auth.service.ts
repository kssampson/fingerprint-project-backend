import { Injectable } from '@nestjs/common';
import { SignUpDto } from 'src/users/dto/SignUpDto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { LogInDto, VerifyEmailDto } from 'src/users/dto/LogInDto';
import { MailService } from 'src/mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import { VerifiedLogInDto } from 'src/users/dto/VerifiedLogInDto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private mailService: MailService,
    private jwtService: JwtService,
    ){}
  async signUp(signUpDto: SignUpDto) {
    signUpDto.password = await bcrypt.hash(signUpDto.password, 10);
    const { username, email, password, visitorId, has2FA } = signUpDto;
    // console.log('signUpDto: ', signUpDto)
    const result = await this.userService.addUserDetails(username, email, password, visitorId, has2FA);
    // console.log('result from addUserDetails: ', result)
    return result;
  }
  async logIn(logInDto: LogInDto) {
    const { email, password } = logInDto;
    const result = await this.userService.logIn(email, password);
    return result;
  }
  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const { email } = verifyEmailDto;
    return this.mailService.verifyEmail(email);
  }
  async verifiedLogin(verifiedLogInDto: VerifiedLogInDto) {
    const { email, password, token } = verifiedLogInDto;
    try {
      const decoded = await this.jwtService.verify(token);
      console.log('decoded in auth.service: ', decoded.email);
      if (decoded.email) {
        const existingByEmail = await this.userService.getUserByEmail(email);
        // console.log('existingByEmail: ', existingByEmail)
        if (existingByEmail && existingByEmail.email === decoded.email) {
          console.log('error one')
          return this.userService.change2FAStatus(email, password);
        } else {
          console.log('error two')
          return {success: false, message: 'verfied email and database email do not match!'}
        }
      } else {
        console.log('error three')
        return {success: false, message: 'hmmm, doesn\'t look like we have you on file...'}
      }
    } catch (error) {
      console.log('error four')
      return {success: false, message: 'we encountered an error, please refresh your page and try again'}
    }
  }
}

/*
this.userService.change2FAStatus(email, password);
return {success: false, message: 'verfied email and database email do not match!'}
return {success: false, message: 'hmmm, doesn\'t look like we have you on file...'}

*/