import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  totalPrice: number;

  @Prop({
    required: true,
    enum: ['Pending', 'Pickup Ready', 'Completed', 'Cancelled'],
  })
  status: string;

  @Prop({ required: true, enum: ['Apple Pay', 'Card'] })
  paymentMethod: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  product: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'BusinessUser', required: true })
  businessUser: Types.ObjectId;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
