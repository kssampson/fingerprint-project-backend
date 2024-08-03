import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { VisitorId } from './entities/visitorId.entity';
import { MailService } from 'src/mail/mail.service';
import { OTP } from './entities/otp.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(VisitorId)
    private visitorIdRepository: Repository<VisitorId>,
    private readonly mailService: MailService,
    @InjectRepository(OTP)
    private otpRepository: Repository<OTP>,
  ){}

  async signUp(username: string, email: string, password: string, visitorId: string) {
    const userExists = await this.checkUserExists(email, visitorId);
    if (userExists) {
      return userExists;
    }
    //Create a new user and save user to user
    const newUser = this.userRepository.create({ username, email, password});
    const savedUser = await this.userRepository.save(newUser);
    //Create and save the visitorId record
    const newVisitorId = this.visitorIdRepository.create({ visitorId, user: savedUser })
    await this.visitorIdRepository.save(newVisitorId);
    return {success: true, message: 'Sign-up Successful'}
  }

  async logIn(username: string, password: string, visitorId: string) {
    //Check if user has valid assoc. username, password, and visitorID
    const user = await this.userRepository.findOne({ where: [{ username }] });
    if (!user) {
      return { success: false, inValidUsername: true, message: 'Invalid username!' }
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { success: false, inValidPassword: true, message: 'Invalid password!' }
    }
    // Get record assoc. with visitor id and credentials
    const visitorRecord = await this.visitorIdRepository.findOne({
      where: { visitorId, user: { id: user.id } },
      relations: ['user','otp']
    })
    //if user doesn't have visitor record
    if (!visitorRecord) {
      return { success: false, message: 'Visitor ID not associated with user! Is this your account?' };
    }
    //If visitor record has not done 2fa
    if (!visitorRecord.twoFA) {
      //Initiate 2fa logic here. Create and use helpers.
      return await this.mailService.initiateTwoFA(visitorRecord.visitorId, visitorRecord.user.username, visitorRecord.user.email, )
    }
    if (visitorRecord.twoFA) {
      return { success: true, message: 'You have completed two factor authentication and are now logged in. Welcome!' }
    }
    console.log('error logging in at end of users.service')
    return { success: false, message: 'Error logging in, please try again' }
  }

  async processOtp(otp: string, username: string, password: string, visitorId: string) {
    //find user
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      return { success: false, message: 'Incorrect username or user not found.' };
    }
    //verify current visitorId is found with the user credentials
    const visitorRecord = await this.visitorIdRepository.findOne({
      where: { visitorId, user: { id: user.id } },
      relations: ['user', 'otp'],
    });
    if (!visitorRecord) {
      return { success: false, message: 'Visitor ID not associated with user.' };
    }
    //validate the input otp matches the one in the database
    const otpRecord = await this.otpRepository.findOne({
      where: { otp: otp, visitorId: visitorRecord },
    });
    if (!otpRecord) {
      return { success: false, otpInvalid: true, message: 'Invalid OTP.' };
    }
    //check if OTP is expired
    const now = new Date();
    if (now > otpRecord.expiresAt) {
      // Remove the expired OTP record
      await this.otpRepository.remove(otpRecord);
      return { success: false, otpExpired: true, message: 'OTP has expired.' };
    }
    //update 2fa status to true
    visitorRecord.twoFA = true;
    await this.visitorIdRepository.save(visitorRecord);
    //cleanup the otp table
    otpRecord.otp = null;
    otpRecord.createdAt = null;
    otpRecord.expiresAt = null;
    await this.otpRepository.save(otpRecord);
    return { success: true, message: 'OTP verified successfully. Two-factor authentication is now complete.' };
  }

  async checkUserExists(email: string, visitorId: string) {
    const existingByEmail = await this.userRepository.findOne({
      where: [{ email }]
    });
    if (existingByEmail) {
      return {success: false, message: 'Email Already Exists. Have you already signed up?'}
    }
    const existingByVisitorId = await this.visitorIdRepository.findOne({
      where: { visitorId },
      relations: ['user']
    });
    if (existingByVisitorId) {
      return {success: false, message: 'Hmm, something\'s not quite right. Have you already signed up?'}
    }
    return null;
  }
}

