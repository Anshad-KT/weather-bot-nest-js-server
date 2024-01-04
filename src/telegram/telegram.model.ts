import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Telegram extends Document {
  @Prop()
  botApi: string;

  @Prop()
  weatherApi: string;
}

export const TelegramSchema = SchemaFactory.createForClass(Telegram);
