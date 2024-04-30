import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
// import { CreateCommunityDto } from './dto/create-community.dto';
// import { UpdateCommunityDto } from './dto/update-community.dto';

@Injectable()
export class CommunitiesService {
  constructor(private prisma: PrismaService) {}
  // create(createCommunityDto: CreateCommunityDto) {
  //   return 'This action adds a new community';
  // }

  findAll() {
    return `This action returns all communities`;
  }

  findOne(id: string) {
    return this.prisma.community.findUnique({
      where: {
        id: id,
      },
      include: {
        members: true,
        admins: true,
        announcements: true,
      },
    });
  }

  async join(community_code: string, userId: string) {
    if (!community_code) {
      throw new HttpException('Community code is required', 400);
    }

    const community = await this.prisma.community.findUnique({
      where: {
        code: community_code,
      },
      include: {
        members: true,
      },
    });

    if (!community) {
      throw new HttpException('Community not found', 404);
    }

    community.members.forEach((member) => {
      if (member.id === userId) {
        throw new HttpException(
          'User is already a member of this community',
          400,
        );
      }
    });

    if (community_code !== community.code) {
      throw new HttpException('Invalid community code', 400);
    }

    try {
      await this.prisma.community.update({
        where: {
          code: community_code,
        },
        data: {
          members: {
            connect: {
              id: userId,
            },
          },
        },
      });

      return {
        success: true,
        message: 'Successfully joined community with code: ' + community_code,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, 500);
    }
  }

  // update(id: number, updateCommunityDto: UpdateCommunityDto) {
  //   return `This action updates a #${id} community`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} community`;
  // }
}
