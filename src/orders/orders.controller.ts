import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  ValidationPipe,
  Query,
  Param,
  Put,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto, GetOrdersQueryDto } from '../dto/order.dto';
import {
  GetBusinessUser,
  GetUser,
} from 'src/auth/decorators/get-info.decorator';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createOrder(
    @GetUser('id') userId: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createOrderDto: CreateOrderDto,
  ) {
    const order = await this.orderService.createOrder(userId, createOrderDto);
    return {
      statusCode: 201,
      message: 'Order created successfully',
      order,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllOrdersByBusinessUser(
    @GetBusinessUser('id') businessUserId: string,
    @Query() query: GetOrdersQueryDto,
  ) {
    const { page, limit, search, startDate, endDate } = query;

    const orders = await this.orderService.getAllOrdersByUser(
      businessUserId,
      page,
      limit,
      search,
      startDate,
      endDate,
    );

    return {
      statusCode: 200,
      message: 'Orders retrieved successfully',
      ...orders,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/today')
  async getTodayOrdersByBusinessUser(
    @GetBusinessUser('id') businessUserId: string,
  ) {
    const orders =
      await this.orderService.getTodayOrdersByBusinessUser(businessUserId);

    return {
      statusCode: 200,
      message: 'Orders retrieved successfully',
      orders,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put('/status')
  async updateOrderStatus(
    @GetBusinessUser('id') businessUserId: string,
    @Query('orderId') orderId: string,
  ) {
    console.log(orderId);
    const order = await this.orderService.updateOrderStatus(
      businessUserId,
      orderId,
    );

    return {
      statusCode: 200,
      message: 'Orders updated successfully',
      order,
    };
  }
}
