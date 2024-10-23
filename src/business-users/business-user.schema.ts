import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class BusinessUser extends Document {
  @Prop({ required: true })
  storeName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  phoneNumber: string;

  @Prop({ required: true })
  storeAddress: string;
}

export const BusinessUserSchema = SchemaFactory.createForClass(BusinessUser);
