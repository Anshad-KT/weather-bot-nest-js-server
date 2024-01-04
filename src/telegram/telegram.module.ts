import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TelegramController } from './telegram.controller';

import { UsersService } from '../user/user.service';
import { User, UserSchema } from '../user/user.model';
import { TelegramService } from './telegram.service';
import { Telegram, TelegramSchema } from './telegram.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    // other imports...
    MongooseModule.forFeature([
      { name: Telegram.name, schema: TelegramSchema },
    ]),
  ],
  controllers: [TelegramController],
  providers: [UsersService, TelegramService],
})
export class TelegramModule {}
