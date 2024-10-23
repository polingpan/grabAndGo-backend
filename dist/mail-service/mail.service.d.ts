import { CreateUserDto } from 'src/dto/auth.dto';
export declare class EmailService {
    private transporter;
    sendSignUpVerificationEmail(createUserDto: CreateUserDto, token: string): Promise<void>;
    sendBusinessVerificationEmail(email: string, token: string): Promise<void>;
}
