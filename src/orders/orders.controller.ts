import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from '../dto/order.dto';
import { GetBusinessUser } from 'src/auth/decorators/get-business-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    const { userId, productId } = createOrderDto;
    const order = await this.orderService.createOrder(
      userId,
      createOrderDto,
      productId,
    );
    return {
      statusCode: 201,
      message: 'Order created successfully',
      order,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllProductsByBusinessUser(
    @GetBusinessUser('id') businessUserId: string,
  ) {
    const orders = await this.orderService.getAllOrdersByUser(businessUserId);
    return {
      statusCode: 200,
      message: 'Orders retrieved successfully',
      orders,
    };
  }
}
