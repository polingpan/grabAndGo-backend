import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types } from 'mongoose';
import { CreateOrderDto } from 'src/dto/order.dto';
import { User } from 'src/users/user.schema';
import { Product } from 'src/products/product.schema';
import { Order } from 'src/orders/order.schema';
import { BusinessUser } from 'src/business-users/business-user.schema';
import { startOfDay, endOfDay } from 'date-fns';
import { toDate, fromZonedTime } from 'date-fns-tz';
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

    if (product.quantity < createOrderDto.quantity) {
      throw new BadRequestException('Insufficient product quantity');
    }

    const totalPrice = product.price * createOrderDto.quantity;

    const newOrder = new this.orderModel({
      ...createOrderDto,
      user: user._id,
      product: product._id,
      businessUser: businessUserId,
      totalPrice,
    });

    const order = await newOrder.save();

    product.quantity -= createOrderDto.quantity;
    await product.save();

    return order;
  }

  async getAllOrdersByUser(
    businessUserId: string,
    page: number,
    limit: number,
    search: string,
    startDate: string,
    endDate: string,
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

    // Add date range filter if provided
    if (startDate || endDate) {
      const dateFilter: any = {};
      if (startDate) {
        dateFilter.$gte = new Date(startDate);
      }
      if (endDate) {
        dateFilter.$lte = new Date(endDate);
      }
      pipeline.push({
        $match: { createdAt: dateFilter },
      });
    }

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

  async getTodayOrdersByBusinessUser(businessUserId: string): Promise<Order[]> {
    // Check if the business user exists
    const businessUser = await this.businessUserModel.findById(businessUserId);
    if (!businessUser) {
      throw new NotFoundException('Business user not found');
    }

    const timeZone = 'America/Toronto'; // Toronto time zone

    const now = new Date();

    // Convert system time to time zone time
    const zonedNow = toDate(now, { timeZone });

    // Calculate the start and end of the day in zone time
    const startOfDayZoned = startOfDay(zonedNow);
    const endOfDayZoned = endOfDay(zonedNow);

    // Convert the start and end of day to UTC
    const startOfDayUTC = fromZonedTime(startOfDayZoned, timeZone);
    const endOfDayUTC = fromZonedTime(endOfDayZoned, timeZone);

    const pipeline: PipelineStage[] = [
      {
        $match: {
          businessUser: new Types.ObjectId(businessUserId),
          createdAt: { $gte: startOfDayUTC, $lte: endOfDayUTC },
        },
      },
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
      {
        $project: {
          productName: '$product.name',
          quantity: 1,
          status: 1,
          totalPrice: 1,
          userName: { $concat: ['$user.firstName', ' ', '$user.lastName'] },
        },
      },
    ];

    return await this.orderModel.aggregate(pipeline).exec();
  }

  async updateOrderStatus(
    businessUserId: string,
    orderId: string,
  ): Promise<Order> {
    const businessUser = await this.businessUserModel.findById(businessUserId);
    if (!businessUser) {
      throw new NotFoundException('Business user not found');
    }

    const order = await this.orderModel.findByIdAndUpdate(
      orderId,
      { status: 'Completed' },
      { new: true },
    );

    if (!order) {
      throw new NotFoundException(
        'Order not found or you do not have access to this order',
      );
    }

    return order;
  }
}
