import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { BusinessUsersModule } from './business-users/business-users.module';
import { AuthModule } from './auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/tooGoodToGo', {}),
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PROT,
      isGlobal: true,
    }),
    ConfigModule.forRoot({
      envFilePath: '.env.development.local',
      isGlobal: true,
    }),
    UsersModule,
    ProductsModule,
    OrdersModule,
    BusinessUsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [CacheModule],
})
export class AppModule {}
