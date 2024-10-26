import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BusinessUser } from 'src/business-users/business-user.schema';

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  pickUpTimeFrom: Date;

  @Prop({ required: true })
  pickUpTimeUntil: Date;

  @Prop({
    type: [String],
    enum: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
    required: true,
  })
  availableDays: string[];

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  quantity: number;

  @Prop({ type: Types.ObjectId, ref: 'BusinessUser', required: true })
  businessUser: BusinessUser;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
