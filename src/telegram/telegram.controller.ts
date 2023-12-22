import { Controller } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { axiosInstance } from '../axios/axios';
import { UsersService } from '../user/user.service';
import * as cron from 'node-cron';

@Controller('telegram')
export class TelegramController {
  private bot: Telegraf;

  constructor(private readonly userService: UsersService) {
    this.bot = new Telegraf(process.env.TOKEN);

    this.bot.start((ctx) => {
      ctx.reply(`subscribe for current weather data`);
    });

    this.bot.command('help', (ctx) => ctx.reply('This is a helpful message!'));

    this.bot.command('info', (ctx) =>
      ctx.reply('Here is some information about the bot.'),
    );
    this.bot.command('subscribe', async (ctx) => {
      try {
        // Do something with the location data
        const location = ctx.message;
        console.log(location);

        this.getLocation(ctx);
      } catch (error) {
        ctx.reply(error.message);
      }
    });
    cron.schedule('50 17 * * *', async () => {
      // Fetch subscribed users from the database
      const subscribedUsers = await this.userService.findAllUsers();
      console.log(subscribedUsers);

      // Iterate through users and send daily weather updates
      for (const user of subscribedUsers) {
        const { is_blocked, is_bot, username, userId, latitude, longitude } =
          user;
        if (!is_blocked || is_bot) {
          const weatherUpdate = await this.handleLocation(latitude, longitude);
          const { report } = await this.sendWeatherReport(
            weatherUpdate,
            username,
          );
          await this.bot.telegram.sendMessage(userId, report);
        }
      }
    });

    this.bot.command('time', (ctx) => {
      console.log(ctx.message);
    });
    this.bot.on('message', async (ctx: any) => {
      const message = ctx.message;

      // Check if the message contains a location
      if (message!.location) {
        const { latitude, longitude } = message.location;
        const { id, username, is_bot } = message.from;
        console.log(message);

        // this.handleLocation(latitude, longitude).then((weather) => {
        //   console.log(weather);
        //   const {report} = this.sendWeatherReport(weather);
        //   ctx.reply(report)
        // });
        await this.userService.createUser({
          userId: id,
          username,
          is_bot,
          latitude,
          longitude,
          is_blocked: false,
        });
        ctx.reply('you have subscribed susscessfully');
        ctx.reply(
          'the scheduled weather update will follow everday at 2:30 AM (UTC)',
        );
        ctx.reply('alternatively you can also use /now to get instant update');
      } else {
        // Handle other types of messages
        console.log(
          'Received a non-location message:',
          message.text || message.photo || message.document,
        );
      }
    });

    this.bot.launch().then(() => console.log('Bot started'));
  }
  private sendWeatherReport(weatherData, username) {
    const { name, weather, main, wind, visibility, sys, timezone } =
      weatherData;
    const currentDate = new Date();
    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Note: Months are zero-based, so add 1.
    const year = currentDate.getFullYear();
    const report = `
    Hey ${username}, 
    🌤 Weather Report for ${name} of ${day}/${month}/${year}:
    - Condition: ${weather[0].main} (${weather[0].description})
    - Temperature: 🌡️ ${this.convertKelvinToCelsius(main.temp)} °C
    - Feels Like: 🌬️ ${this.convertKelvinToCelsius(main.feels_like)} °C
    - Min Temperature: ❄️ ${this.convertKelvinToCelsius(main.temp_min)} °C
    - Max Temperature: 🔥 ${this.convertKelvinToCelsius(main.temp_max)} °C
    - Pressure: 📊 ${main.pressure} hPa
    - Humidity: 💧 ${main.humidity}% 
 `;

    return { report };
  }

  private convertKelvinToCelsius(kelvin) {
    return (kelvin - 273.15).toFixed(2);
  }

  private formatUnixTimestamp(timestamp, timezone) {
    const date = new Date(timestamp * 1000);
    const localTime = new Date(date.getTime() + timezone * 1000);
    return localTime.toLocaleTimeString();
  }

  private async handleLocation(latitude, longitude) {
    try {
      console.log(process.env.API_KEY, latitude, longitude);

      const response = await axiosInstance.get(
        `/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.API_KEY}`,
      );

      // Return the response data
      return response.data;
    } catch (error) {
      // Handle errors
      console.error('Error fetching weather data:', error.message);
      throw error;
    }
  }
  private setupDefaultKeyboard(ctx) {
    ctx.reply('Please share your location with the bot.', {
      reply_markup: {
        keyboard: [
          [
            {
              text: 'Get Location',
              request_location: true,
            },
          ],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    });
  }

  private getLocation(ctx) {
    ctx.reply('Please share your location with the bot.', {
      reply_markup: {
        keyboard: [
          [
            {
              text: 'Share Location',
              request_location: true,
            },
          ],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    });
  }
}
