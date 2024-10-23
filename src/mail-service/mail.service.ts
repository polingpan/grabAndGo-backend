import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { CreateUserDto } from 'src/dto/auth.dto';

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'stmp.gmail.com',
    auth: {
      user: process.env.COMPANY_EMAIL,
      pass: process.env.COMPANY_EMAIL_PASSWORD,
    },
  });

  async sendSignUpVerificationEmail(
    createUserDto: CreateUserDto,
    token: string,
  ) {
    const verificationUrl = `${token}`;
    const mailOptions = {
      from: process.env.COMPANY_EMAIL,
      to: createUserDto.email,
      subject: 'Verification Email',
      text: `Click on the following link to verify your account: ${verificationUrl}`,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendBusinessVerificationEmail(email: string, token: string) {
    const verificationUrl = `${token}`;
    const mailOptions = {
      from: process.env.COMPANY_EMAIL,
      to: email,
      subject: 'Verification Email For Business',
      text: `Click on the following link to verify your account: ${verificationUrl}`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
