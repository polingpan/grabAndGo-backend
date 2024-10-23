import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  CreateBusinessUserDto,
  CreateUserDto,
  LoginDto,
} from 'src/dto/auth.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      await this.authService.signUp(createUserDto);

      return res.status(200).json({
        statusCode: 200,
        message: 'Verification email sent. Please check your inbox to verify.',
      });
    } catch (err) {
      return res.status(500).json({
        statusCode: 500,
        error: err.message,
      });
    }
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    try {
      const result = await this.authService.login(
        loginDto.email,
        loginDto.password,
      );

      return res.status(200).json({
        statusCode: 200,
        message: 'Login successful',
        token: result,
      });
    } catch (error) {
      return res.status(401).json({
        statusCode: 401,
        message: 'Invalid email or password.',
        error: error.message,
      });
    }
  }

  @Get('verify/:token')
  async verifyEmail(@Param('token') token: string, @Res() res: Response) {
    try {
      const result = await this.authService.verifyEmail(token);

      if (!result) {
        return res.status(400).json({
          statusCode: 400,
          message: 'Verification token is invalid or has expired.',
        });
      }

      return res.status(200).json({
        statusCode: 200,
        message: 'Email verified successfully, account created.',
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        message:
          'Error occurred during email verification. Please try again later.',
        error: error.message,
      });
    }
  }

  @Post('business-Signup')
  async initBussinessSignup(
    @Body() createBusinessUserDto: CreateBusinessUserDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.authService.initBussinessSignup(
        createBusinessUserDto,
      );

      return res.status(200).json({
        statusCode: 200,
        message: result.message,
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        error: error.message,
      });
    }
  }

  @Get('business-verify/:token')
  async verifyBusinessEmail(
    @Param('token') token: string,
    @Res() res: Response,
  ) {
    try {
      const cachedBusinessUser =
        await this.authService.verifyBusinessEmail(token);

      return res.status(200).json({
        statusCode: 200,
        message: 'Email verified successfully. Please set your password.',
        data: cachedBusinessUser,
      });
    } catch (error) {
      return res.status(400).json({
        statusCode: 400,
        error: error.message,
      });
    }
  }

  @Post('complete-business-signup/:token')
  async completeBusinessSignup(
    @Param('token') token: string,
    @Body('password') password: string,
    @Res() res: Response,
  ) {
    try {
      const businessUser = await this.authService.completeBusinessSignup(
        token,
        password,
      );

      return res.status(201).json({
        statusCode: 201,
        message: 'Business user created successfully.',
        user: {
          storeName: businessUser.storeName,
          email: businessUser.email,
          phoneNumber: businessUser.phoneNumber,
          storeAddress: businessUser.storeAddress,
        },
      });
    } catch (error) {
      return res.status(400).json({
        statusCode: 400,
        error: error.message,
      });
    }
  }
}
