import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Context, Telegraf } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { Telegram } from './telegram.model';

@Injectable()
export class TelegramService {
  constructor(
    @InjectModel(Telegram.name) private telegramModel: Model<Telegram>,
  ) {}

  async setDescription(
    _botInstance: Telegraf<Context<Update>>,
    content: string,
  ): Promise<any> {
    const deletedUser = await _botInstance.telegram.setMyDescription(
      content,
      'en',
    );
    console.log(content);

    return deletedUser;
  }

  async setApiKey(newApiKey: string) {
    const key = await this.getApiKey();
    console.log(newApiKey, key);

    if (!key) {
      const insert = await this.telegramModel.insertMany([
        { botApi: newApiKey },
      ]);
      console.log(key, newApiKey, insert);
      return insert;
    }
    const updatedApiKey = await this.telegramModel.updateOne(
      {},
      { $set: { botApi: newApiKey } },
    );
    console.log(updatedApiKey);
    
    return updatedApiKey;
  }

  async getApiKey(): Promise<string | null> {
    try {
      const document = await this.telegramModel.findOne(); // You might want to add conditions here
      if (document) {
        return document.botApi;
      } else {
        return null; // Return null or handle the case when the document is not found
      }
    } catch (error) {
      console.error('Error retrieving API key:', error);
      throw error; // Handle the error according to your application's needs
    }
  }

  async setCommands(
    _botInstance: Telegraf<Context<Update>>,
    content: string,
  ): Promise<any> {
    const deletedUser = await _botInstance.telegram.setMyShortDescription(
      content,
      'en',
    );
    console.log(deletedUser);

    return deletedUser;
  }
}
