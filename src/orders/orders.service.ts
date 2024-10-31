import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types } from 'mongoose';
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

  async getAllOrdersByUser(
    businessUserId: string,
    page: number,
    limit: number,
    search: string,
  ) {
    const businessUser = await this.businessUserModel.findById(businessUserId);
    if (!businessUser) {
      throw new NotFoundException('Business user not found');
    }
    const skip = page * limit;

    const pipeline: PipelineStage[] = [
      { $match: { businessUser: new Types.ObjectId(businessUserId) } },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $lookup: {
          from: 'products',
          localField: 'product',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' },
    ];

    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { status: { $regex: search, $options: 'i' } },
            { 'user.firstName': { $regex: search, $options: 'i' } },
            { 'user.lastName': { $regex: search, $options: 'i' } },
            { 'product.name': { $regex: search, $options: 'i' } },
          ],
        },
      });
    }

    pipeline.push(
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    );

    const orders = await this.orderModel.aggregate(pipeline).exec();

    const countPipeline = [...pipeline];
    countPipeline.splice(
      countPipeline.findIndex((stage) => '$skip' in stage),
      2,
    );
    countPipeline.push({ $count: 'totalOrders' });
    const totalOrdersResult = await this.orderModel
      .aggregate(countPipeline)
      .exec();
    const totalOrders = totalOrdersResult[0]?.totalOrders || 0;

    const totalPages = Math.ceil(totalOrders / limit);

    return {
      orders,
      totalOrders,
      totalPages,
      currentPage: page,
    };
  }
}
