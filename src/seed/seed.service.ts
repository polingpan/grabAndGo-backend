import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BusinessUser } from '../business-users/business-user.schema';
import { Model } from 'mongoose';
import { Product } from '../products/product.schema';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import { Order } from 'src/orders/order.schema';
import { User } from 'src/users/user.schema';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(BusinessUser.name)
    private businessUserModel: Model<BusinessUser>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async runSeed() {
    await this.businessUserModel.deleteMany({});
    await this.productModel.deleteMany({});
    await this.orderModel.deleteMany({});
    await this.userModel.deleteMany({});

    //create business user
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

      const businessUser = await this.businessUserModel.create({
        storeName: faker.company.name(),
        email: faker.internet.email(),
        password: hashedPassword,
        isActive: faker.datatype.boolean(),
        phoneNumber: faker.phone.number(),
        storeAddress: faker.location.streetAddress(),
      });
      businessUsers.push(businessUser);
    }

    //create products
    const products = [];
    for (let i = 0; i < businessUsers.length; i++) {
      for (let j = 0; j < 6; j++) {
        const product = await this.productModel.create({
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

    // Create Users
    const customUser = await this.userModel.create({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: 'custom@store.com',
      password: hashedCustomPassword,
      isActive: true,
      phoneNumber: '123-456-7890',
    });

    const users = [customUser];

    for (let i = 0; i < 9; i++) {
      const hashedPassword = await bcrypt.hash(
        faker.internet.password(),
        parseInt(process.env.SALT_ROUNDS),
      );
      const user = await this.userModel.create({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: hashedPassword,
        isActive: faker.datatype.boolean(),
        phoneNumber: faker.phone.number(),
      });
      users.push(user);
    }

    // // Create Orders
    // const orders = [];
    // for (let i = 0; i < users.length; i++) {
    //   const randomProduct = faker.helpers.arrayElement(products);
    //   const order = await this.orderModel.create({
    //     quantity: faker.number.int({ min: 1, max: randomProduct.quantity }),
    //     totalPrice: randomProduct.price * faker.number.int({ min: 1, max: 5 }),
    //     status: faker.helpers.arrayElement([
    //       'pending',
    //       'completed',
    //       'canceled',
    //     ]),
    //     paymentMethod: faker.helpers.arrayElement(['card', 'cash']),
    //     user: users[i]._id,
    //     product: randomProduct._id,
    //     businessUser: randomProduct.businessUser,
    //   });
    //   orders.push(order);
    // }

    // Create 40 Orders for Custom User
    for (let i = 0; i < 40; i++) {
      const randomProduct = faker.helpers.arrayElement(products);
      const randomUser = faker.helpers.arrayElement(users);

      await this.orderModel.create({
        quantity: faker.number.int({ min: 1, max: randomProduct.quantity }),
        totalPrice: randomProduct.price * faker.number.int({ min: 1, max: 5 }),
        status: faker.helpers.arrayElement([
          'Pending',
          'Completed',
          'Cancelled',
        ]),
        paymentMethod: faker.helpers.arrayElement(['Card', 'Apple Pay']),
        user: randomUser._id,
        product: randomProduct._id,
        businessUser: customBusinessUser._id,
        createdAt: faker.date.between({ from: '2024-07-01', to: '2024-10-20' }),
      });
    }

    console.log(
      'Database seeding complete with custom and faker-generated data!',
    );
  }
}
