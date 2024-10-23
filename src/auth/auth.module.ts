import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailService } from 'src/mail-service/mail.service';
import { UsersService } from 'src/users/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  BusinessUser,
  BusinessUserSchema,
} from 'src/business-users/business-user.schema';
import { BusinessUsersService } from 'src/business-users/business-users.service';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '2h' },
      }),
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: BusinessUser.name, schema: BusinessUserSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, EmailService, UsersService, BusinessUsersService],
})
export class AuthModule {}
