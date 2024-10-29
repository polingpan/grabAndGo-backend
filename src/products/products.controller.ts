import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { GetBusinessUser } from 'src/auth/decorators/get-info.decorator';
import { CreateProductDto, UpdateProductDto } from 'src/dto/product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createProduct(
    @GetBusinessUser('id') businessUserId: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createProductDto: CreateProductDto,
  ) {
    const product = await this.productService.createProduct(
      businessUserId,
      createProductDto,
    );
    return {
      statusCode: 201,
      message: 'Product created successfully',
      product,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllProductsByBusinessUser(
    @GetBusinessUser('id') businessUserId: string,
  ) {
    const products =
      await this.productService.getAllProductByUser(businessUserId);
    return {
      statusCode: 200,
      message: 'Products retrieved successfully',
      products,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getProductById(
    @Param('id') productId: string,
    @GetBusinessUser('id') businessUserId: string,
  ) {
    const product = await this.productService.getProductById(
      productId,
      businessUserId,
    );
    return {
      statusCode: 200,
      message: 'Product retrieved successfully',
      product,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateProduct(
    @Param('id') productId: string,
    @GetBusinessUser('id') businessUserId: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    updateProductDto: UpdateProductDto,
  ) {
    const updatedProduct = await this.productService.updateProductByUser(
      productId,
      updateProductDto,
      businessUserId,
    );
    return {
      statusCode: 200,
      message: 'Product updated successfully',
      product: updatedProduct,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteProduct(
    @Param('id') productId: string,
    @GetBusinessUser('id') businessUserId: string,
  ) {
    const result = await this.productService.deleteProductById(
      productId,
      businessUserId,
    );
    return {
      statusCode: 200,
      message: 'Product deleted successfully',
      result,
    };
  }
}
