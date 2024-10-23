import { BusinessUser } from './business-user.schema';
import { Model } from 'mongoose';
import { CreateBusinessUserDto } from 'src/dto/auth.dto';
export declare class BusinessUsersService {
    private businessUserModel;
    constructor(businessUserModel: Model<BusinessUser>);
    create(businessUserData: CreateBusinessUserDto): Promise<BusinessUser>;
    findByEmail(email: string): Promise<BusinessUser>;
}
