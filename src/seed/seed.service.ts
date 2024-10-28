import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BusinessUser } from '../business-users/business-user.schema';
import { Model } from 'mongoose';
import { Product } from '../products/product.schema';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(BusinessUser.name)
    private businessUserModel: Model<BusinessUser>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async runSeed() {
    await this.businessUserModel.deleteMany({});
    await this.productModel.deleteMany({});

    const hashedCustomPassword = await bcrypt.hash(
      'customPassword123',
      parseInt(process.env.SALT_ROUNDS),
    );
    const customBusinessUser = await this.businessUserModel.create({
      storeName: 'Custom Store',
      email: 'custom@store.com',
      password: hashedCustomPassword,
      isActive: true,
      phoneNumber: '123-456-7890',
      storeAddress: '123 Custom Street, Custom City',
    });

    const businessUsers = [customBusinessUser];
    for (let i = 0; i < 9; i++) {
      const hashedPassword = await bcrypt.hash(
        faker.internet.password(),
        parseInt(process.env.SALT_ROUNDS),
      );

      const businessUser = new this.businessUserModel({
        storeName: faker.company.name(),
        email: faker.internet.email(),
        password: hashedPassword,
        isActive: faker.datatype.boolean(),
        phoneNumber: faker.phone.number(),
        storeAddress: faker.location.streetAddress(),
      });
      businessUsers.push(businessUser);
    }

    await this.businessUserModel.insertMany(businessUsers.slice(1));

    const products = [];
    for (let i = 0; i < businessUsers.length; i++) {
      for (let j = 0; j < 6; j++) {
        const product = new this.productModel({
          name: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          pickUpTimeFrom: faker.date.future(),
          pickUpTimeUntil: faker.date.future(),
          availableDays: faker.helpers.arrayElements(
            [
              'Monday',
              'Tuesday',
              'Wednesday',
              'Thursday',
              'Friday',
              'Saturday',
              'Sunday',
            ],
            faker.number.int({ min: 1, max: 7 }),
          ),
          price: faker.commerce.price({ min: 10, max: 100 }),
          quantity: faker.number.int({ min: 1, max: 100 }),
          businessUser: businessUsers[i]._id,
        });
        products.push(product);
      }
    }

    await this.productModel.insertMany(products);

    console.log(
      'Database seeding complete with custom and faker-generated data!',
    );
  }
}
