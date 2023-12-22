import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


@Schema()
export class User extends Document {
  @Prop()
  userId: string;

  @Prop()
  username: string;

  @Prop()
  is_bot: boolean;

  @Prop()
  latitude: number;

  @Prop()
  longitude: number;

  @Prop()
  is_blocked: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
