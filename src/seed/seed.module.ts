import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BusinessUser,
  BusinessUserSchema,
} from '../business-users/business-user.schema';
import { Product, ProductSchema } from '../products/product.schema';
import { Order, OrderSchema } from 'src/orders/order.schema';
import { User, UserSchema } from 'src/users/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BusinessUser.name, schema: BusinessUserSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Order.name, schema: OrderSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
