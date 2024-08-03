import { Injectable } from '@nestjs/common';
import { sendMail } from './mail';
import { emailVerificationTemplate } from './emailVerificationTemplate';
import { JwtService } from '@nestjs/jwt';
import { otpGen } from 'otp-gen-agent';
import { InjectRepository } from '@nestjs/typeorm';
import { VisitorId } from 'src/users/entities/visitorId.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { OTP } from 'src/users/entities/otp.entity';
require('dotenv').config();

@Injectable()
export class MailService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(VisitorId)
    private visitorIdRepository: Repository<VisitorId>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(OTP)
    private otpRepository: Repository<OTP>,
    ) {}

  async initiateTwoFA(visitorId: string, username: string, email: string) {
    // create one time password
    const otpCode = await otpGen();
    const createdAt = new Date();
    //set expiration for 1 hour
    const expiresAt = new Date(createdAt.getTime() + 60 * 60 * 1000);
    //Find user and visitorRecord
    const user = await this.userRepository.findOne({ where: [{ username }] });
    const visitorRecord = await this.visitorIdRepository.findOne({
      where: { visitorId, user: { id: user.id } },
      relations: ['user','otp']
    })

    if (!visitorRecord) {
      return { success: false, message: 'Visitor ID not associated with user! Is this your account?' };
    }
    const newOtp = this.otpRepository.create({
      otp: otpCode,
      createdAt: createdAt,
      expiresAt: expiresAt,
      visitorId: visitorRecord
    })

    try {
      // Save the OTP record
      await this.otpRepository.save(newOtp);

      // Send email with OTP
      const mailOptions = {
          from: process.env.GMAIL_USER,
          to: email,
          subject: 'Your OTP Code',
          html: emailVerificationTemplate(otpCode, expiresAt)
      };
      try {
        await sendMail(mailOptions);
        // return { success: true, message: 'OTP sent to your email.' };
        return { success: false, needs2Fa: true, message: 'Please check your email and proceed with two factor authentication' }
      } catch (error) {
        return { success: false, message: 'Failed to send email. Please try again.' };
      }
    } catch (error) {
        console.error('Error saving OTP:', error);
        return { success: false, message: 'Failed to save OTP. Please try again.' };
    }
  }
}


