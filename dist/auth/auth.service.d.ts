import { Cache } from 'cache-manager';
import { CreateBusinessUserDto, CreateUserDto } from 'src/dto/auth.dto';
import { EmailService } from 'src/mail-service/mail.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { BusinessUsersService } from 'src/business-users/business-users.service';
export declare class AuthService {
    private readonly cacheManager;
    private readonly userService;
    private readonly emailService;
    private readonly jwtService;
    private readonly businessUserService;
    constructor(cacheManager: Cache, userService: UsersService, emailService: EmailService, jwtService: JwtService, businessUserService: BusinessUsersService);
    signUp(createUserDto: CreateUserDto): Promise<{
        message: string;
    }>;
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
    login(email: string, password: string): Promise<string>;
    initBussinessSignup(createBusinessUserDto: CreateBusinessUserDto): Promise<{
        message: string;
    }>;
    verifyBusinessEmail(token: string): Promise<unknown>;
    completeBusinessSignup(token: string, password: string): Promise<import("../business-users/business-user.schema").BusinessUser>;
}
