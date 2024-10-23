import { Test, TestingModule } from '@nestjs/testing';
import { BusinessUsersService } from './business-users.service';

describe('BusinessUsersService', () => {
  let service: BusinessUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessUsersService],
    }).compile();

    service = module.get<BusinessUsersService>(BusinessUsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
