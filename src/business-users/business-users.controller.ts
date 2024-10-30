import { Controller, Get, UseGuards } from '@nestjs/common';
import { BusinessUsersService } from 'src/business-users/business-users.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { GetBusinessUser } from 'src/auth/decorators/get-info.decorator';

@Controller('business-users')
export class BusinessUsersController {
  constructor(private readonly businessUsersService: BusinessUsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getDashboardData(@GetBusinessUser('id') businessUserId: string) {
    const data =
      await this.businessUsersService.getDashboardData(businessUserId);
    return {
      statusCode: 200,
      message: 'Data retrieved successfully',
      data,
    };
  }
}
