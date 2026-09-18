import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { User } from '@prisma/client';
import { UsersService } from '../users/users.service';

export type AuthUser = Pick<User, 'id' | 'email' | 'name' | 'role'>;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwt: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || !(await compare(password, user.passwordHash))) {
      throw new UnauthorizedException('E-mail ou senha inválidos');
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET não configurado');
    }

    const safeUser = this.toSafeUser(user);
    return {
      accessToken: await this.jwt.signAsync(safeUser, {
        secret: jwtSecret,
        expiresIn: '8h',
      }),
      user: safeUser,
    };
  }

  toSafeUser(user: User): AuthUser {
    const { id, email, name, role } = user;
    return { id, email, name, role };
  }
}