import { Controller } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { axiosInstance } from '../axios/axios';

@Controller('telegram')
export class TelegramController {
  private bot: Telegraf;

  constructor() {
    this.bot = new Telegraf(process.env.TOKEN);

    this.bot.start((ctx) => {
      ctx.reply(`type in /location for current weather data`);
    });

    this.bot.command('help', (ctx) => ctx.reply('This is a helpful message!'));

    this.bot.command('info', (ctx) =>
      ctx.reply('Here is some information about the bot.'),
    );
    this.bot.command('location', async (ctx) => {
      try {
        // Do something with the location data
        const location = ctx.message;
        console.log(location);

        this.getLocation(ctx);
       
      } catch (error) {
        ctx.reply(error.message);
      }
    });

    this.bot.on('message', async (ctx: any) => {
      const message = ctx.message;

      // Check if the message contains a location
      if (message!.location) {
        const { latitude, longitude } = message.location;
        this.handleLocation(latitude, longitude).then((weather) => {
          console.log(weather);
          this.sendWeatherReport(ctx, weather);
        });
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
  private sendWeatherReport(ctx, weatherData) {
    const { name, weather, main, wind, visibility, sys, timezone } =
      weatherData;

    const report = `
    Weather Report for ${name}:
    - Condition: ${weather[0].main} (${weather[0].description})
    - Temperature: ${this.convertKelvinToCelsius(main.temp)} °C
    - Feels Like: ${this.convertKelvinToCelsius(main.feels_like)} °C
    - Min Temperature: ${this.convertKelvinToCelsius(main.temp_min)} °C
    - Max Temperature: ${this.convertKelvinToCelsius(main.temp_max)} °C
    - Pressure: ${main.pressure} hPa
    - Humidity: ${main.humidity}%
    - Wind Speed: ${wind.speed} m/s, Direction: ${wind.deg}°
    - Visibility: ${visibility} meters
    - Country: ${sys.country}
    - Sunrise: ${this.formatUnixTimestamp(sys.sunrise, timezone)}
    - Sunset: ${this.formatUnixTimestamp(sys.sunset, timezone)}
    `;

    ctx.reply(report);
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
