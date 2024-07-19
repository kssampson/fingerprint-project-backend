import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ){}

  async addUserDetails(username: string, email: string, password: string, visitorId: string, has2FA: boolean) {
    const userExists = await this.checkUserExists(email, visitorId);
    if (!userExists) {
      const newUser = this.userRepository.create({ username, email, password, visitorId, has2FA });
      await this.userRepository.save(newUser);
      return {success: true, message: 'Sign-up Successful'}
    } else {
      return userExists;
    }
  }

  async getAllUsers() {
    return await this.userRepository.find();
  }

  async checkUserExists(email: string, visitorId: string) {
    const existingByEmail = await this.userRepository.findOne({
      where: [{ email }]
    });
    const existingByVisitorId = await this.userRepository.findOne({
      where: [{ visitorId }]
    });
    // console.log(existingByEmail);
    if (existingByEmail) {
      return {success: false, message: 'Email Already Exists. Have you already signed up?'}
    } else if (existingByVisitorId) {
      return {success: false, message: 'Hmm, something\'s not quite right. Have you already signed up?'}
    } else {
      return false;
    }
  }
}

