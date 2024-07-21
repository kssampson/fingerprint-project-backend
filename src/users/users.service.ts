import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

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
  async getUserByEmail(email: string) {
    console.log('email is getUserByEmail: ', email)
    const user = await this.userRepository.findOne({
      where: [{ email }]
    });
    return user
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
  async logIn(email: string, password: string) {
    try {
      const existingUser = await this.userRepository.findOne({ where: [{ email }] });
      console.log('existingUser: ', existingUser);
      if (!existingUser) {
        console.log(':::not an existing user:::')
        return {success: false, inValidEmail: true, message: 'Invalid email!'} //works getting the user
      }
      const isPasswordValid = await bcrypt.compare(password, existingUser.password);
      // console.log(':::isPasswordValid: ', isPasswordValid, ':::') //returns true
      if (!isPasswordValid) {
        console.log(':::inside !isPasswordValid block:::', existingUser.password, password)
        return {success: false, inValidPassword: true, message: 'Invalid password!'}
      }
      if (existingUser.has2FA) {
        console.log(':::inside existingUser.has2FA block:::')
        return {success: true, message: 'You have completed two factor authentication and are now logged in. Welcome!'}
      } else {
        console.log(':::inside inside else block:::')
        return {success: false, needs2Fa: true, message: 'Please proceed with two factor authentication'}
      }
    } catch (error) {
      console.log(':::inside catch block:::')
      throw new Error;
    }
  }
  async change2FAStatus(email: string, password: string) {
    await this.userRepository.update({ email }, { has2FA: true });
    return await this.logIn(email, password);
  }
}

