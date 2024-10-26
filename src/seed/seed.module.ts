import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BusinessUser,
  BusinessUserSchema,
} from '../business-users/business-user.schema';
import { Product, ProductSchema } from '../products/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BusinessUser.name, schema: BusinessUserSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
