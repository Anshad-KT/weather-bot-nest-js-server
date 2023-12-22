// users.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.model';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(user: any): Promise<User> {
    const createdUser = new this.userModel(user);
    return createdUser.save();
  }

  async findAllUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async blockUser(userId: string): Promise<User | null> {
    return this.userModel
      .findByIdAndUpdate(userId, { is_blocked: true }, { new: true })
      .exec();
  }

  async unblockUser(userId: string): Promise<User | null> {
    return this.userModel
      .findByIdAndUpdate(userId, { blocked: false }, { new: true })
      .exec();
  }
}
