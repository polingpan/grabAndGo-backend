import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BusinessUser } from './business-user.schema';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateBusinessUserDto } from 'src/dto/auth.dto';
import { Order } from 'src/orders/order.schema';
import { User } from 'src/users/user.schema';
import { Product } from 'src/products/product.schema';

@Injectable()
export class BusinessUsersService {
  constructor(
    @InjectModel(BusinessUser.name)
    private businessUserModel: Model<BusinessUser>,
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Product.name) private productModel: Model<Product>,
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

  async getDashboardData(businessUserId: string, days?: number) {
    const businessUser = await this.businessUserModel.findById(businessUserId);
    if (!businessUser) {
      throw new NotFoundException('Business user not found');
    }

    const startDate = days
      ? new Date(new Date().setDate(new Date().getDate() - days))
      : undefined;

    const orders = await this.orderModel.aggregate([
      {
        $match: {
          businessUser: new Types.ObjectId(businessUserId),
          ...(startDate && { createdAt: { $gte: startDate } }),
          status: 'Completed',
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$totalPrice' },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const data = [
      {
        title: '訂單',
        interval: days ? `Last ${days} days` : 'Since Joined',
        data: orders.map((order) => ({
          date: order._id,
          value: order.totalOrders,
        })),
      },
      {
        title: '營收',
        interval: days ? `Last ${days} days` : 'Since Joined',
        data: orders.map((order) => ({
          date: order._id,
          value: order.totalRevenue,
        })),
      },
    ];

    return data;
  }
}
