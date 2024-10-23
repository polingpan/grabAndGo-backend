import { Module } from '@nestjs/common';
import { BusinessUsersController } from './business-users.controller';
import { BusinessUsersService } from './business-users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BusinessUser, BusinessUserSchema } from './business-user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BusinessUser.name, schema: BusinessUserSchema },
    ]),
  ],
  controllers: [BusinessUsersController],
  providers: [BusinessUsersService],
})
export class BusinessUsersModule {}
