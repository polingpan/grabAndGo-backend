import { Module } from '@nestjs/common';
import { BusinessUsersController } from './business-users.controller';
import { BusinessUsersService } from './business-users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BusinessUser, BusinessUserSchema } from './business-user.schema';
import { Order, OrderSchema } from 'src/orders/order.schema';
import { User, UserSchema } from 'src/users/user.schema';
import { Product, ProductSchema } from 'src/products/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BusinessUser.name, schema: BusinessUserSchema },
      { name: Order.name, schema: OrderSchema },
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  controllers: [BusinessUsersController],
  providers: [BusinessUsersService],
})
export class BusinessUsersModule {}
