import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: any): Promise<User> {
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      parseInt(process.env.SALT_ROUNDS),
    );

    createUserDto.password = hashedPassword;
    const user = await this.userModel.create(createUserDto);

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();

    return user;
  }
}
