import { Injectable } from '@nestjs/common';
import { sendMail } from './mail';
import { emailVerificationTemplate } from './emailVerificationTemplate';
import { JwtService } from '@nestjs/jwt';
require('dotenv').config();

@Injectable()
export class MailService {
  constructor(private readonly jwtService: JwtService) {}

  async verifyEmail(email: string): Promise<{ success: boolean, message: string }> {
    const payload = { email };
    const token = this.jwtService.sign(payload, { expiresIn: '90s' });
    const mailOptions = {
      from: `${process.env.GMAIL_USER}`,
      to: `${email}`,
      subject: "Verify Your Account",
      html: emailVerificationTemplate(email, token),
    };

    try {
      await sendMail(mailOptions);
      return { success: true, message: 'Please check your email. You can close this tab in your browser.' };
    } catch (error) {
      console.error('Error sending email:', error);
      return { success: false, message: 'Something went wrong. Please try again.' };
    }
  }
}


