import { Module } from '@nestjs/common';
import { TelegramController } from './telegram.controller';

@Module({
  controllers: [TelegramController],
})
export class TelegramModule {}
