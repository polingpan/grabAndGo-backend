export declare class CreateUserDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    isActive?: boolean;
    phoneNumber: string;
}
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class CreateBusinessUserDto {
    storeName: string;
    email: string;
    isActive?: boolean;
    phoneNumber: string;
    storeAddress: string;
    password?: string;
}
