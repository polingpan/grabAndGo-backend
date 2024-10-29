import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { User, UserSchema } from '../users/user.schema';
import { Product, ProductSchema } from '../products/product.schema';
import { Order, OrderSchema } from 'src/orders/order.schema';
import {
  BusinessUser,
  BusinessUserSchema,
} from 'src/business-users/business-user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema },
      { name: BusinessUser.name, schema: BusinessUserSchema },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
