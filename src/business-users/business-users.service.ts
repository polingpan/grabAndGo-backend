import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BusinessUser } from './business-user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateBusinessUserDto } from 'src/dto/auth.dto';

@Injectable()
export class BusinessUsersService {
  constructor(
    @InjectModel(BusinessUser.name)
    private businessUserModel: Model<BusinessUser>,
  ) {}

  async create(businessUserData: CreateBusinessUserDto): Promise<BusinessUser> {
    const hashedPassword = await bcrypt.hash(
      businessUserData.password,
      parseInt(process.env.SALT_ROUNDS),
    );

    businessUserData.password = hashedPassword;
    const businessUser = await this.businessUserModel.create(businessUserData);

    return businessUser;
  }

  async findByEmail(email: string): Promise<BusinessUser> {
    const businessUser = await this.businessUserModel.findOne({ email }).exec();

    return businessUser;
  }
}
