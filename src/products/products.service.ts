import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './product.schema';
import { Model, Types } from 'mongoose';
import { BusinessUser } from 'src/business-users/business-user.schema';
import { CreateProductDto, UpdateProductDto } from 'src/dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(BusinessUser.name)
    private businessUserModel: Model<BusinessUser>,
  ) {}

  async createProduct(
    businessUserId: string,
    createProductDto: CreateProductDto,
  ): Promise<Product> {
    const businessUser = await this.businessUserModel.findById(businessUserId);

    if (!businessUser) {
      throw new NotFoundException('Business user not found');
    }

    const newProduct = new this.productModel({
      ...createProductDto,
      businessUser: businessUser._id,
    });

    return newProduct.save();
  }

  async getAllProductByUser(businessUserId: string) {
    const businessUser = await this.businessUserModel.findById(businessUserId);
    if (!businessUser) {
      throw new NotFoundException('Business user not found');
    }

    return this.productModel
      .find({ businessUser: new Types.ObjectId(businessUserId) })
      .exec();
  }

  async getProductById(
    productId: string,
    businessUserId: string,
  ): Promise<Product> {
    const product = await this.productModel
      .findOne({
        _id: productId,
        businessUser: businessUserId,
      })
      .exec();

    if (!product) {
      throw new NotFoundException(
        'Product not found or you do not have access to this product',
      );
    }
    return product;
  }

  async updateProductByUser(
    businessUserId: string,
    updateProductDto: UpdateProductDto,
    productId: string,
  ) {
    const product = await this.productModel.findOne({
      _id: new Types.ObjectId(productId),
      businessUser: new Types.ObjectId(businessUserId),
    });

    if (!product) {
      throw new NotFoundException(
        'Product not found or not owned by the business user',
      );
    }

    Object.assign(product, updateProductDto);
    return product.save();
  }

  async deleteProductById(
    productId: string,
    businessUserId: string,
  ): Promise<{ deleted: boolean }> {
    const product = await this.productModel.findOne({
      _id: productId,
      businessUser: businessUserId,
    });

    if (!product) {
      throw new NotFoundException(
        'Product not found or you do not have access to this product',
      );
    }

    await this.productModel.deleteOne({ _id: productId });
    return { deleted: true };
  }
}
