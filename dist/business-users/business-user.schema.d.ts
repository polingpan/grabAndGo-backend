import { Document } from 'mongoose';
export declare class BusinessUser extends Document {
    storeName: string;
    email: string;
    password: string;
    isActive: boolean;
    phoneNumber: string;
    storeAddress: string;
}
export declare const BusinessUserSchema: import("mongoose").Schema<BusinessUser, import("mongoose").Model<BusinessUser, any, any, any, Document<unknown, any, BusinessUser> & BusinessUser & Required<{
    _id: unknown;
}> & {
    __v?: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, BusinessUser, Document<unknown, {}, import("mongoose").FlatRecord<BusinessUser>> & import("mongoose").FlatRecord<BusinessUser> & Required<{
    _id: unknown;
}> & {
    __v?: number;
}>;
