import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TelegramController } from './telegram.controller';

import { UsersService } from '../user/user.service';
import { User, UserSchema } from '../user/user.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    // other imports...
  ],
  controllers: [TelegramController],
  providers: [UsersService],
})
export class TelegramModule {}
