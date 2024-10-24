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
      from: { name: 'GRAB & GO', address: process.env.COMPANY_EMAIL },
      to: email,
      subject: '請驗證您的電子郵件',
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
      <div style="text-align: center;">
        <img src="https://drive.google.com/uc?export=view&id=10Ie43Dy5HZHtDASPGcF4B3yrWNyGsmLh" alt="Logo" style="max-width: 150px;">
      </div>
      <div style="background-color: #ffffff; padding: 20px; border-radius: 10px;">
        <p style="color: #333333; font-size:15px">您好，感謝你註冊 GRAB & GO</p>
        <p style="color: #333333;font-size:15px">請點擊下方按鈕以驗證您的電子郵件，驗證後即可開始使用我們的服務！</p>
        <div style="text-align: center; margin: 50px 0;">
          <a href="${verificationUrl}" style="background-color: #c8c5b2; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 5px; font-size: 16px;">開始使用</a>
        </div>
        <p style="color: #999999; font-size: 12px;">本郵件是由系統自動寄發，請勿直接回覆。如果有任何問題，請聯絡我們。</p>
         <p style="color: #999999; font-size: 12px;">客服時間：週一～週五 09:30-12:00 / 13:30-18:00。</p>
      </div>
      <div style="text-align: center; padding-top: 10px;">
        <p style="color: #999999; font-size: 12px;">© 2024 GRAB & GO. All rights reserved.</p>
      </div>
    </div>
  `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
