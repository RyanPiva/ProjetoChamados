import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/user.dto';
import { hash } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({
      orderBy: { name: 'asc' },
    });
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  create(dto: CreateUserDto) {
    const { password, ...userData } = dto;
    return hash(password, 10).then((passwordHash) =>
      this.prisma.user.create({
        data: { ...userData, passwordHash },
        select: { id: true, email: true, name: true, role: true },
      }),
    );
  }
}
