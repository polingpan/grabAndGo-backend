import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateOrderDto } from 'src/dto/order.dto';
import { User } from 'src/users/user.schema';
import { Product } from 'src/products/product.schema';
import { Order } from 'src/orders/order.schema';
import { BusinessUser } from 'src/business-users/business-user.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(BusinessUser.name)
    private businessUserModel: Model<BusinessUser>,
  ) {}

  async createOrder(
    userId: string,
    createOrderDto: CreateOrderDto,
  ): Promise<Order> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const product = await this.productModel.findById(createOrderDto.productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const businessUserId = product.businessUser;
    if (!businessUserId) {
      throw new NotFoundException('Business user for the product not found');
    }

    const totalPrice = product.price * createOrderDto.quantity;

    const newOrder = new this.orderModel({
      ...createOrderDto,
      user: user._id,
      product: product._id,
      businessUser: businessUserId,
      totalPrice,
    });

    return newOrder.save();
  }

  async getAllOrdersByUser(businessUserId: string) {
    const businessUser = await this.businessUserModel.findById(businessUserId);
    if (!businessUser) {
      throw new NotFoundException('Business user not found');
    }

    return this.orderModel
      .find({ businessUser: new Types.ObjectId(businessUserId) })
      .populate('user', 'firstName lastName')
      .populate('product', 'name price')
      .exec();
  }
}
