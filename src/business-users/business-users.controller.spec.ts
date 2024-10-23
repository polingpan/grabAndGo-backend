import { Test, TestingModule } from '@nestjs/testing';
import { BusinessUsersController } from './business-users.controller';

describe('BusinessUsersController', () => {
  let controller: BusinessUsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinessUsersController],
    }).compile();

    controller = module.get<BusinessUsersController>(BusinessUsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
