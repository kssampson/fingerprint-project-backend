import { Module } from '@nestjs/common';
import { MailService } from './mail.service';

@Module({
  providers: [MailService],
  imports: [MailModule],
  exports: [MailService]
})
export class MailModule {}
