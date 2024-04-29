import { HttpException, Injectable } from '@nestjs/common';
import { AuthLoginDto, AuthRegisterDto } from './dto/auth.dto';
import { PrismaService } from 'src/database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

function validateRegisterPayload(registerPayload: AuthRegisterDto) {
  if (!registerPayload.email) {
    throw new HttpException('Email is required', 400);
  }

  if (!registerPayload.password) {
    throw new HttpException('Password is required', 400);
  }

  if (!registerPayload.fullName) {
    throw new HttpException('Full name is required', 400);
  }
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(authPayload: AuthLoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: authPayload.email,
      },
      include: {
        role: true,
        communities: true,
        community_admins: true,
      },
    });

    if (!user || user.password !== authPayload.password) {
      return null;
    }

    return user;
  }

  async login(user: User) {
    const { password, ...result } = user;
    return {
      access_token: this.jwtService.sign({
        sub: user.id,
        ...result,
      }),
    };
  }

  async register(registerPayload: AuthRegisterDto) {
    validateRegisterPayload(registerPayload);

    const userExists = await this.prisma.user.findUnique({
      where: {
        email: registerPayload.email,
      },
    });

    if (userExists) {
      throw new HttpException(
        'User with the given email address already exists',
        400,
      );
    }

    try {
      await this.prisma.user.create({
        data: {
          email: registerPayload.email,
          password: registerPayload.password,
          fullName: registerPayload.fullName,
        },
      });
    } catch (e) {
      throw new HttpException('Error creating user: \n' + e.message, 500);
    }

    return {
      success: true,
      message: 'User registered successfully. Please login to continue',
    };
  }
}
