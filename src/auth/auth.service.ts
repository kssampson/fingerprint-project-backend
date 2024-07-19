import { Injectable } from '@nestjs/common';
import { SignUpDto } from 'src/users/dto/SignUpDto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService){}
  async signUp(signUpDto: SignUpDto) {
    signUpDto.password = await bcrypt.hash(signUpDto.password, 10);
    const { username, email, password, visitorId, has2FA } = signUpDto;
    // console.log('signUpDto: ', signUpDto)
    const result = await this.userService.addUserDetails(username, email, password, visitorId, has2FA);
    // console.log('result from addUserDetails: ', result)
    return result;
  }
}
