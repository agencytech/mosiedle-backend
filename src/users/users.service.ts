import { HttpException, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/database/prisma.service';
import { User } from '@prisma/client';

interface Query {
  role?: boolean;
  announcements?: boolean;
  communities?: boolean;
}

async function validateUser(createUserDto: User) {
  const missingFields = [];

  if (!createUserDto || Object.keys(createUserDto).length === 0) {
    throw new HttpException(`Missing fields: all`, 400);
  }

  // check if the object satisfies the User interface
  const user: User = createUserDto;

  if (!user.email) {
    missingFields.push('email');
  }
  if (!user.fullName) {
    missingFields.push('fullName');
  }
  if (!user.password) {
    missingFields.push('password');
  }

  if (missingFields.length) {
    throw new HttpException(`Missing fields: ${missingFields.join(', ')}`, 400);
  }
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: User): Promise<User | null> {
    await validateUser(createUserDto);

    return await this.prisma.user.create({
      data: createUserDto,
    });
  }

  async findAll(query: Query): Promise<User[]> {
    for (const key in query) {
      query[key] = query[key] === 'true';
    }
    return await this.prisma.user.findMany({
      include: query,
    });
  }

  async findOne(id: string, query: Query): Promise<User> {
    for (const key in query) {
      query[key] = query[key] === 'true';
    }
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: query,
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      return await this.prisma.user.update({
        where: {
          id,
        },
        data: updateUserDto,
      });
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.user.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }
}
