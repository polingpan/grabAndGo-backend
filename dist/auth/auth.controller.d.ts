import { AuthService } from './auth.service';
import { CreateBusinessUserDto, CreateUserDto, LoginDto } from 'src/dto/auth.dto';
import { Response } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signUp(createUserDto: CreateUserDto, res: Response): Promise<Response<any, Record<string, any>>>;
    login(loginDto: LoginDto, res: Response): Promise<Response<any, Record<string, any>>>;
    verifyEmail(token: string, res: Response): Promise<Response<any, Record<string, any>>>;
    initBussinessSignup(createBusinessUserDto: CreateBusinessUserDto, res: Response): Promise<Response<any, Record<string, any>>>;
    verifyBusinessEmail(token: string, res: Response): Promise<Response<any, Record<string, any>>>;
    completeBusinessSignup(token: string, password: string, res: Response): Promise<Response<any, Record<string, any>>>;
}
