import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;

  @IsNotEmpty()
  @IsString()
  phoneNumber: string;
}

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class CreateBusinessUserDto {
  @IsNotEmpty()
  @IsString()
  storeName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;

  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  storeAddress: string;

  @IsOptional()
  @IsString()
  password?: string;
}
