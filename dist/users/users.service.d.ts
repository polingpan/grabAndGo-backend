import { User } from './user.schema';
import { Model } from 'mongoose';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<User>);
    create(createUserDto: any): Promise<User>;
    findByEmail(email: string): Promise<User>;
}
