import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Injectable, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CreateBusinessUserDto, CreateUserDto } from 'src/dto/auth.dto';
import { EmailService } from 'src/mail-service/mail.service';
import { UsersService } from 'src/users/users.service';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { BusinessUsersService } from 'src/business-users/business-users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly userService: UsersService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
    private readonly businessUserService: BusinessUsersService,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    const existingUser = await this.userService.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new Error('Email is already in use.');
    }

    const verificationToken = uuidv4();

    await this.cacheManager.set(
      `user_${verificationToken}`,
      createUserDto,
      1800,
    );

    await this.emailService.sendSignUpVerificationEmail(
      createUserDto,
      verificationToken,
    );

    return { message: 'Verification email sent. Please verify your email.' };
  }

  async verifyEmail(token: string) {
    const cachedUser = await this.cacheManager.get(`user_${token}`);

    if (!cachedUser) {
      return { message: 'Verification token is invalid or has expired.' };
    }

    await this.userService.create(cachedUser);

    await this.cacheManager.del(`user_${token}`);

    return { message: 'Email verified successfully.' };
  }

  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid email or password.');
    }

    const payload = { userId: user._id, email: user.email };

    return this.jwtService.sign(payload);
  }

  async initBussinessSignup(createBusinessUserDto: CreateBusinessUserDto) {
    const existingUser = await this.businessUserService.findByEmail(
      createBusinessUserDto.email,
    );
    if (existingUser) {
      throw new Error('Email is already in use.');
    }
    const verificationToken = uuidv4();

    await this.cacheManager.set(
      `businessUser_${verificationToken}`,
      createBusinessUserDto,
      1800,
    );

    // Send verification email
    await this.emailService.sendBusinessVerificationEmail(
      createBusinessUserDto.email,
      verificationToken,
    );

    return { message: 'Verification email sent. Please verify your email.' };
  }

  async verifyBusinessEmail(token: string) {
    const cachedBusinessUser = await this.cacheManager.get(
      `businessUser_${token}`,
    );

    if (!cachedBusinessUser) {
      throw new Error('Verification token is invalid or has expired.');
    }

    return cachedBusinessUser;
  }

  async completeBusinessSignup(token: string, password: string) {
    const cachedBusinessUser: CreateBusinessUserDto =
      await this.cacheManager.get(`businessUser_${token}`);

    if (!cachedBusinessUser) {
      throw new Error('Verification token is invalid or has expired.');
    }

    const businessUserData = {
      ...cachedBusinessUser,
      password: password,
    };
    const businessUser =
      await this.businessUserService.create(businessUserData);

    await this.cacheManager.del(`businessUser_${token}`);

    return businessUser;
  }
}
