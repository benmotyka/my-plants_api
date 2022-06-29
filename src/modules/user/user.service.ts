import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '.prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findOneByUsername(username: string): Promise<User> {
    return this.prisma.user.findFirst({
      where: {
        username,
      },
    });
  }

  async createUser({
    username,
    password,
  }: {
    username: string;
    password: string;
  }): Promise<User> {
    return this.prisma.user.create({
      data: {
        username,
        password,
      },
    });
  }
}
