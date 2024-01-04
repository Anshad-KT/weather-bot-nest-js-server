import { Controller, Delete, Get, Patch } from '@nestjs/common';
import { UsersService } from '../user/user.service'; // Assuming the correct path to the UsersService
import { User } from 'src/user/user.model';

@Controller('admin')
export class AdminController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async getHello(): Promise<User[]> {
    return this.userService.findAllUsers();
  }

  @Get()
  async banUser(userId: string): Promise<User> {
    return this.userService.blockUser(userId);
  }

  @Patch()
  async unBanUser(userId: string): Promise<User> {
    return this.userService.unblockUser(userId);
  }

  @Delete()
  async deleteUser(userId: string): Promise<User> {
    return this.userService.deleteUser(userId);
  }
}
