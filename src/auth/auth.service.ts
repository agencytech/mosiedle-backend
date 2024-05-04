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

    const tokens = await this.getTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
      ...result,
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
      const user = await this.prisma.user.create({
        data: {
          email: registerPayload.email,
          password: registerPayload.password,
          fullName: registerPayload.fullName,
        },
        include: {
          role: true,
        },
      });
      const tokens = await this.getTokens(user);
      await this.updateRefreshToken(user.id, tokens.refreshToken);

      const { password, ...userData } = user;

      return {
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken,
        ...userData,
      };
    } catch (e) {
      throw new HttpException('Error creating user: \n' + e.message, 500);
    }
  }

  getProfile(user: User) {
    return this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        role: true,
        communities: true,
        community_admins: true,
        announcements: true,
      },
    });
  }

  async getTokens(user: User) {
    const data = {
      sub: user.id,
      id: user.id,
      email: user.email,
      fullName: user.fullName,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(data),
      this.jwtService.signAsync(data, {
        secret: 'secret',
        expiresIn: '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refresh_token: refreshToken,
      },
    });
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        role: true,
      },
    });

    if (user.refresh_token !== refreshToken) {
      throw new HttpException('Invalid refresh token', 401);
    }

    const tokens = await this.getTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    const { password, ...userData } = user;

    return {
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
      ...userData,
    };
  }
}
